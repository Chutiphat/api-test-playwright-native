const { expect, test } = require('@playwright/test');

/**
 * Utils - Core assertion engine for API response validation.
 * Mimics Postman's validation style with support for mandatory, optional, and Regex.
 */
class Utils {
    constructor() {
        this.testIndex = 1;
    }

    /**
     * Standard success validation (Status 200/201 + Body Validation)
     */
    async testSuccess(expectedData, response, actualData = null) {
        await test.step("Status code is 200 or 201", async () => {
            expect([200, 201], `Expected 200 or 201 but received ${response.status()}`).toContain(response.status());
        });

        if (!actualData) {
            try {
                actualData = await response.json();
            } catch (e) {
                await test.step("Response body is valid JSON", async () => {
                    expect(false, `Response body is not valid JSON. Error: ${e.message}`).toBe(true);
                });
                return;
            }
        }

        this.testIndex = 1;
        await this.recursiveValidate(expectedData, actualData, '', actualData);
    }

    /** Alias for testSuccess to maintain Postman naming convention */
    async TestSuccess(expectedData, response, actualData = null) {
        return this.testSuccess(expectedData, response, actualData);
    }

    /** Logs response details for debugging */
    async logResponse(response) {
        const body = await response.json();
        console.log('--- Response Log ---');
        console.log(`Status: ${response.status()}`);
        console.log('Body:', JSON.stringify(body, null, 2));
        console.log('---------------------');
    }

    /** Alias for logResponse */
    async LogResponse(response) {
        return this.logResponse(response);
    }

    /** Standard failure validation (Status 400 or 500) */
    async testFailed(expectedData, response, actualData = null) {
        await test.step("Status code is 400 or 500", async () => {
            expect([400, 500]).toContain(response.status());
        });

        if (!actualData) {
            try {
                actualData = await response.json();
            } catch (e) {
                await test.step("Response body is valid JSON", async () => {
                    expect(false, `Response body is not valid JSON. Error: ${e.message}`).toBe(true);
                });
                return;
            }
        }

        this.testIndex = 1;
        await this.recursiveValidate(expectedData, actualData, '', actualData);
    }

    /** Validates data without checking status codes */
    async validateData(expectedData, actualData) {
        this.testIndex = 1;
        await this.recursiveValidate(expectedData, actualData, '', actualData);
    }

    getTypeString(value) {
        if (Array.isArray(value)) return 'array';
        if (value === null) return 'null';
        return typeof value;
    }

    /** Performs individual field assertions */
    async runAssertion(expected, actual, keyPrefix, fullObject = {}) {
        let expectedStr;
        let regexToUse = expected instanceof RegExp ? expected : null;
        expectedStr = expected instanceof RegExp ? expected.toString() : JSON.stringify(expected);

        let actualStr = actual === null ? 'null' : JSON.stringify(actual);
        let actualType = this.getTypeString(actual);

        // Step name for Playwright/Allure report
        const stepName = `[Expected Result][${this.testIndex}] ${keyPrefix} → expected: ${expectedStr}, actual: ${actualStr} (type: ${actualType})`;
        
        await test.step(stepName, async () => {
            // 1. Mandatory/Optional/Must Not Exist Check
            if (expected === "mandatory") {
                expect(actual, `${keyPrefix} is mandatory`).not.toBeNull();
                expect(actual, `${keyPrefix} is mandatory`).not.toBeUndefined();
                expect(actual, `${keyPrefix} is mandatory`).not.toBe("");
                return;
            }

            if (expected === "optional") {
                return;
            }

            if (expected === undefined) {
                expect([undefined, null, ""], `${keyPrefix} must not exist`).toContain(actual);
                return;
            }

            // 2. Data Type Check
            if (typeof expected === "string" && expected.startsWith("TYPE_")) {
                switch(expected) {
                    case "TYPE_STRING":
                        expect(typeof actual, `${keyPrefix} should be a string`).toBe('string');
                        return;
                    case "TYPE_NUMBER":
                        expect(typeof actual, `${keyPrefix} should be a number`).toBe('number');
                        return;
                    case "TYPE_BOOLEAN":
                        expect(typeof actual, `${keyPrefix} should be a boolean`).toBe('boolean');
                        return;
                    case "TYPE_OBJECT":
                        expect(typeof actual, `${keyPrefix} should be an object`).toBe('object');
                        expect(Array.isArray(actual), `${keyPrefix} should not be an array`).toBe(false);
                        expect(actual, `${keyPrefix} should not be null`).not.toBeNull();
                        return;
                    case "TYPE_ARRAY":
                        expect(Array.isArray(actual), `${keyPrefix} should be an array`).toBe(true);
                        return;
                }
            }
            
            // 3. Direct Equality Check
            if (typeof expected === "string" || typeof expected === "number" || typeof expected === "boolean") {
                expect(actual, `${keyPrefix} should equal ${expected}`).toEqual(expected);
                return;
            }

            // 4. Regex Check
            if (regexToUse && actual !== null && actual !== undefined) {
                let actualStrForMatch = actual.toString();
                expect(actualStrForMatch, `${keyPrefix} should match pattern`).toMatch(regexToUse);
            }
        });

        this.testIndex++;
    }

    /** Recursively traverses objects and arrays for validation */
    async recursiveValidate(expected, actual, keyPrefix = '', fullObject = {}) {
        if (expected && expected.CONDITIONAL) {
            await this.runAssertion(expected, actual, keyPrefix, fullObject);
            return;
        }

        if (Array.isArray(expected)) {
            await test.step(`[Expected Result][${this.testIndex}] ${keyPrefix} should be an array with ${expected.length} items`, async () => {
                expect(Array.isArray(actual), `${keyPrefix} should be an array`).toBe(true);
                expect(actual.length, `${keyPrefix} array length mismatch`).toBe(expected.length);
            });
            this.testIndex++;
            for (let i = 0; i < expected.length; i++) {
                await this.recursiveValidate(expected[i], actual?.[i], `${keyPrefix}[${i}]`, fullObject);
            }
        } else if (typeof expected === 'object' && expected !== null && !(expected instanceof RegExp)) {
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
