const { expect, test } = require('@playwright/test');
const { parse } = require('csv-parse/sync');
const fs = require('fs');
const path = require('path');

/**
 * Utils - Core assertion engine for API & File validation.
 */
class Utils {
    constructor() {
        this.testIndex = 1;
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
        this.testIndex = 1;
        await this.recursiveValidate(expectedData, actualData, '', actualData);
    }

    async TestSuccess(expectedData, response, actualData = null) {
        return this.testSuccess(expectedData, response, actualData);
    }

    async logResponse(response) {
        const body = await response.json();
        console.log('--- Response Log ---');
        console.log(`Status: ${response.status()}`);
        console.log('Body:', JSON.stringify(body, null, 2));
        console.log('---------------------');
    }

    async LogResponse(response) { return this.logResponse(response); }

    async validateData(expectedData, actualData) {
        this.testIndex = 1;
        await this.recursiveValidate(expectedData, actualData, '', actualData);
    }

    // --- 📊 CSV Comparison Features ---
    /**
     * Compares an actual CSV string with an expected CSV file stored locally.
     */
    async compareCsvWithFile(expectedFileName, actualCsvString) {
        const expectedPath = path.resolve(__dirname, '../input/expected_results', expectedFileName);
        
        await test.step(`📊 Compare with expected file: ${expectedFileName}`, async () => {
            if (!fs.existsSync(expectedPath)) {
                expect(false, `Expected CSV file not found at: ${expectedPath}`).toBe(true);
                return;
            }

            const expectedRaw = fs.readFileSync(expectedPath, 'utf8');
            
            // 📎 1. Attach files to report (for download)
            await test.info().attach('Expected CSV', { body: expectedRaw, contentType: 'text/csv' });
            await test.info().attach('Actual CSV', { body: actualCsvString, contentType: 'text/csv' });

            // 📝 2. Log content to report console (for quick view)
            console.log('--- [CSV Comparison] Expected Content ---');
            console.log(expectedRaw);
            console.log('--- [CSV Comparison] Actual Content ---');
            console.log(actualCsvString);
            console.log('-----------------------------------------');

            const expectedRecords = parse(expectedRaw, { columns: true, skip_empty_lines: true, trim: true });
            await this.validateCsv(expectedRecords, actualCsvString);
        });
    }

    /**
     * Internal: Compares an expected array of objects with a CSV string.
     */
    async validateCsv(expectedArray, actualCsvString) {
        await test.step("📊 CSV Structure Validation", async () => {
            try {
                const actualRecords = parse(actualCsvString, { columns: true, skip_empty_lines: true, trim: true });
                
                await test.step(`Verify Row Count (Expected: ${expectedArray.length}, Actual: ${actualRecords.length})`, async () => {
                    expect(actualRecords.length, "CSV row count mismatch").toBe(expectedArray.length);
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
        let expectedStr = expected instanceof RegExp ? expected.toString() : JSON.stringify(expected);
        let actualStr = actual === null ? 'null' : JSON.stringify(actual);
        let actualType = this.getTypeString(actual);

        const stepName = `[Expected Result][${this.testIndex}] ${keyPrefix} → expected: ${expectedStr}, actual: ${actualStr} (type: ${actualType})`;
        
        await test.step(stepName, async () => {
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
