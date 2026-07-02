const { expect, test } = require('@playwright/test');
const { parse } = require('csv-parse/sync');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');
const path = require('path');

const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);

/**
 * Utils - Core assertion engine for API, File, and Schema validation.
 */
class Utils {
    constructor() {
        this.testIndex = 1;
    }

    // --- 🛡️ New Feature: JSON Schema Validation ---
    /**
     * Validates a JSON object against a specified schema with detailed logging.
     * @param {Object} schema - JSON Schema definition.
     * @param {Object} data - Actual JSON data from response.
     */
    async validateSchema(schema, data) {
        await test.step("🛡️ JSON Schema Validation", async () => {
            const validate = ajv.compile(schema);
            const valid = validate(data);

            if (!valid) {
                const errorReport = validate.errors.map((err, index) => {
                    const fieldPath = err.instancePath ? err.instancePath.replace(/^\//,'').replace(/\//g, '.') : 'root';
                    const actualValue = err.data !== undefined ? this.formatValue(err.data) : 'undefined';
                    const expectedValue = (() => {
                        switch(err.keyword) {
                            case 'required':
                                return `required field ${err.params.missingProperty}`;
                            case 'type':
                                return `type ${err.params.type}`;
                            case 'maxLength':
                                return `string length <= ${err.params.limit}`;
                            case 'minLength':
                                return `string length >= ${err.params.limit}`;
                            case 'format':
                                return `format ${err.params.format}`;
                            case 'enum':
                                return `one of ${JSON.stringify(err.params.allowedValues)}`;
                            default:
                                return err.message;
                        }
                    })();

                    let assertDetails = '';
                    switch(err.keyword) {
                        case 'required':
                            assertDetails = `❌ Missing required field`;
                            break;
                        case 'type':
                            assertDetails = `❌ Wrong type`;
                            break;
                        case 'maxLength':
                            assertDetails = `❌ String too long`;
                            break;
                        case 'minLength':
                            assertDetails = `❌ String too short`;
                            break;
                        case 'format':
                            assertDetails = `❌ Invalid format`;
                            break;
                        case 'enum':
                            assertDetails = `❌ Invalid value`;
                            break;
                        default:
                            assertDetails = err.message;
                    }
                    
                    return `
  [Assert #${index + 1}] Field: ${fieldPath}
  └─ ${assertDetails}
  └─ Expected: ${expectedValue}
  └─ Actual: ${actualValue}`;
                }).join('\n');

                const fullErrorMsg = `
════════════════════════════════════════════════════════
  🛡️  SCHEMA VALIDATION FAILED
════════════════════════════════════════════════════════
${errorReport}
════════════════════════════════════════════════════════`;

                await test.info().attach('Schema Validation Failure', {
                    body: fullErrorMsg,
                    contentType: 'text/plain',
                });

                console.error(fullErrorMsg);
                expect(valid, fullErrorMsg).toBe(true);
            } else {
                console.log('✅ JSON Schema is valid.');
            }
        });
    }

    // --- API & JSON Validations ---
    async testSuccess(expectedData, response, actualData = null) {
        await test.step("Status code is 200 or 201", async () => {
            expect([200, 201], `Expected 200 or 201 but received ${response.status()}`).toContain(response.status());
        });

        if (!actualData) {
            try { actualData = await response.json(); } catch (e) {
                await test.step("Response body is valid JSON", async () => {
                    expect(false, `Response body is not valid JSON. Error: ${e.message}`).toBe(true);
                });
                return;
            }
        }

        await test.step("📋 Assertion Summary", async () => {
            const expectedText = JSON.stringify(expectedData, null, 2);
            const actualText = JSON.stringify(actualData, null, 2);
            const summary = `Test Case: ${test.info().title}\n\nExpected data:\n${expectedText}\n\nActual data:\n${actualText}`;
            await test.info().attach('Assertion Summary', { body: summary, contentType: 'text/plain' });
        });

        this.testIndex = 1;
        await this.recursiveValidate(expectedData, actualData, '', actualData);
    }

    async TestSuccess(expectedData, response, actualData = null) {
        return this.testSuccess(expectedData, response, actualData);
    }

    async logResponse(response) {
        const body = await response.json();
        const responseText = `Status: ${response.status()}\n\nBody:\n${JSON.stringify(body, null, 2)}`;
        await test.info().attach('Response Body', { body: responseText, contentType: 'text/plain' });
        console.log('--- Response Log ---');
        console.log(`Status: ${response.status()}`);
        console.log('Body:', JSON.stringify(body, null, 2));
        console.log('---------------------');
    }

    async LogResponse(response) { return this.logResponse(response); }

    async validateData(expectedData, actualData) {
        this.testIndex = 1;
        await this.attachAssertionReport('Expected vs Actual', expectedData, actualData);
        await this.recursiveValidate(expectedData, actualData, '', actualData);
    }

    // --- CSV Comparison Features ---
    async compareCsvWithFile(expectedFileName, actualCsvString) {
        const expectedPath = path.resolve(__dirname, '../input/expected_results', expectedFileName);
        await test.step(`📊 Compare with expected file: ${expectedFileName}`, async () => {
            if (!fs.existsSync(expectedPath)) {
                expect(false, `Expected CSV file not found at: ${expectedPath}`).toBe(true);
                return;
            }
            const expectedRaw = fs.readFileSync(expectedPath, 'utf8');
            await test.info().attach('Expected CSV', { body: expectedRaw, contentType: 'text/csv' });
            await test.info().attach('Actual CSV', { body: actualCsvString, contentType: 'text/csv' });
            console.log('--- [CSV Comparison] Contents Logged to Attachments ---');
            const expectedRecords = parse(expectedRaw, { columns: true, skip_empty_lines: true, trim: true });
            await this.validateCsv(expectedRecords, actualCsvString);
        });
    }

    async validateCsv(expectedArray, actualCsvString) {
        await test.step("📊 CSV Structure Validation", async () => {
            try {
                const actualRecords = parse(actualCsvString, { columns: true, skip_empty_lines: true, trim: true });
                await test.step(`Verify Row Count (Expected: ${expectedArray.length}, Actual: ${actualRecords.length})`, async () => {
                    expect(actualRecords.length).toBe(expectedArray.length);
                });
                this.testIndex = 1;
                for (let i = 0; i < expectedArray.length; i++) {
                    await this.recursiveValidate(expectedArray[i], actualRecords[i], `Row[${i}]`, actualRecords[i]);
                }
            } catch (err) {
                expect(false, `Failed to parse CSV: ${err.message}`).toBe(true);
            }
        });
    }

    // --- Core Engine Methods ---
    getTypeString(value) {
        if (Array.isArray(value)) return 'array';
        if (value === null) return 'null';
        return typeof value;
    }

    async runAssertion(expected, actual, keyPrefix, fullObject = {}) {
        const expectedStr = expected instanceof RegExp ? expected.toString() : JSON.stringify(expected);
        const actualStr = actual === null ? 'null' : JSON.stringify(actual);
        const actualType = this.getTypeString(actual);

        const stepName = `[Expected Result][${this.testIndex}] ${keyPrefix}`;

        await test.step(stepName, async () => {
            const assertionDetail = `Field: ${keyPrefix}\nExpected: ${expectedStr}\nActual: ${actualStr}\nType: ${actualType}`;
            await test.info().attach(`Assertion - ${keyPrefix}`, { body: assertionDetail, contentType: 'text/plain' });
            console.log(`Assertion: ${keyPrefix}`);
            console.log(`  Expected: ${expectedStr}`);
            console.log(`  Actual:   ${actualStr}`);
            console.log(`  Type:     ${actualType}`);

            if (expected === "mandatory") {
                expect(actual, `${keyPrefix} is mandatory`).not.toBeNull();
                expect(actual, `${keyPrefix} is mandatory`).not.toBeUndefined();
                expect(actual, `${keyPrefix} is mandatory`).not.toBe("");
                return;
            }
            if (expected === "optional") return;
            if (expected === undefined) {
                expect([undefined, null, ""], `${keyPrefix} must not exist`).toContain(actual);
                return;
            }
            if (typeof expected === "string" && expected.startsWith("TYPE_")) {
                switch(expected) {
                    case "TYPE_STRING": expect(typeof actual).toBe('string'); return;
                    case "TYPE_NUMBER": expect(isNaN(Number(actual)), `${keyPrefix} should be a number`).toBe(false); return;
                }
            }
            if (typeof expected === "string" || typeof expected === "number" || typeof expected === "boolean") {
                expect(actual.toString(), `${keyPrefix} equality check`).toEqual(expected.toString());
                return;
            }
            if (expected instanceof RegExp && actual !== null && actual !== undefined) {
                expect(actual.toString(), `${keyPrefix} regex match`).toMatch(expected);
            }
        });
        this.testIndex++;
    }

    formatValue(value) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'string') return JSON.stringify(value);
        if (typeof value === 'object') {
            if (value && value.asymmetricMatch) return '[asymmetric matcher]';
            return JSON.stringify(value);
        }
        return value.toString();
    }

    buildAssertionSummary(expectedData, actualData, prefix = '') {
        const lines = [];

        const walk = (expected, actual, currentPath) => {
            if (expected === undefined || expected === null || typeof expected !== 'object' || expected instanceof RegExp) {
                lines.push(`[Assert] ${currentPath || 'root'}\n  Expected: ${this.formatValue(expected)}\n  Actual: ${this.formatValue(actual)}`);
                return;
            }

            if (Array.isArray(expected)) {
                const maxLen = Math.max(expected.length, Array.isArray(actual) ? actual.length : 0);
                for (let i = 0; i < maxLen; i++) {
                    walk(expected[i], Array.isArray(actual) ? actual[i] : undefined, `${currentPath}[${i}]`);
                }
                return;
            }

            const expectedKeys = Object.keys(expected);
            const actualKeys = actual && typeof actual === 'object' && !Array.isArray(actual) ? Object.keys(actual) : [];
            const unionKeys = [...new Set([...expectedKeys, ...actualKeys])];
            for (const key of unionKeys) {
                const nextPath = currentPath ? `${currentPath}.${key}` : key;
                walk(expected[key], actual?.[key], nextPath);
            }
        };

        walk(expectedData, actualData, prefix || 'root');
        return lines.join('\n\n');
    }

    async attachAssertionReport(title, expectedData, actualData) {
        const report = this.buildAssertionSummary(expectedData, actualData);
        await test.step(`📌 ${title}`, async () => {
            console.log(`--- ${title} ---`);
            console.log(report);
            console.log('-------------------');
            await test.info().attach(title, { body: report, contentType: 'text/plain' });
        });
    }

    async recursiveValidate(expected, actual, keyPrefix = '', fullObject = {}) {
        if (typeof expected === 'object' && expected !== null && !(expected instanceof RegExp)) {
            for (const key in expected) {
                const newKeyPrefix = keyPrefix ? `${keyPrefix}.${key}` : key;
                await this.recursiveValidate(expected[key], actual?.[key], newKeyPrefix, fullObject);
            }
        } else {
            await this.runAssertion(expected, actual, keyPrefix, fullObject);
        }
    }
}

module.exports = Utils;
