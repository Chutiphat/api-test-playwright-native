const { test, expect } = require('@playwright/test');
const BatchApi = require('../lib/api/BatchApi');
const S3Helper = require('../lib/S3Helper');
const TestHelper = require('../lib/TestHelper');
const Utils = require('../lib/Utils');

/**
 * 🎬 BatchFlow (E2E S3)
 * Runs Batch Restriction process and verifies output files in S3 with cleanup.
 */
test.describe('BatchFlow (E2E S3)', () => {
    const utils = new Utils();
    const s3 = new S3Helper();
    
    // Configuration
    const BUCKET = "deposit-batch-bucket";
    const INPUT_PATH = `restriction/input/test_${Date.now()}.csv`;
    const OUTPUT_PATH = `restriction/output/result_${Date.now()}.json`;

    // 🧹 Teardown: Cleanup S3 files after test
    test.afterEach(async () => {
        console.log("🧹 Cleaning up S3 files...");
        await s3.deleteFile(BUCKET, INPUT_PATH);
        await s3.deleteFile(BUCKET, OUTPUT_PATH);
    });

    test('Should trigger batch via API and verify result in S3', async ({ request }) => {
        const batchApi = new BatchApi(request);
        
        const { requestId, traceParent } = TestHelper.generateApiHeaders();
        const { date, time } = TestHelper.getRequestDateTime();

        const headers = {
            ...TestHelper.getOpsHeaders(requestId, traceParent),
            'x-request-date': date,
            'x-request-time': time,
            'Content-Type': 'application/json'
        };

        // --- STEP 1: Preparation ---
        await test.step('1. Preparation: Upload Input to S3', async () => {
            const csvContent = "accountNo,restrictionCode\n1234567890,10";
            await s3.uploadFile(BUCKET, INPUT_PATH, csvContent);
        });

        // --- STEP 2: Action ---
        await test.step('2. Action: Trigger Batch API', async () => {
            const payload = {
                "name": "CCD_RESTRICTION_RESTRICTION_02",
                "triggerMode": "AUTO",
                "triggerBy": "AUTOSYS",
                "additionalInfo": { 
                    "executeDate": date, 
                    "input": INPUT_PATH, 
                    "output": OUTPUT_PATH 
                }
            };
            const response = await batchApi.triggerBatch(headers, payload);
            await utils.TestSuccess({ "responseCode": "0000" }, response);
        });

        // --- STEP 3: Monitoring ---
        await test.step('3. Monitoring: Wait for Output in S3', async () => {
            let isDone = false;
            const maxAttempts = 12; // 1 minute timeout
            
            for (let i = 0; i < maxAttempts; i++) {
                isDone = await s3.fileExists(BUCKET, OUTPUT_PATH);
                if (isDone) break;
                
                console.log(`Waiting for batch... attempt ${i+1}/${maxAttempts}`);
                await new Promise(r => setTimeout(r, 5000));
            }
            
            expect(isDone, "Batch should finish and generate output file").toBe(true);
        });

        // --- STEP 4: Validation ---
        await test.step('4. Validation: Verify S3 Content', async () => {
            const content = await s3.getFileContent(BUCKET, OUTPUT_PATH);
            const result = JSON.parse(content);
            
            const expectedData = {
                "status": "SUCCESS",
                "processedCount": "mandatory"
            };
            await utils.validateData(expectedData, result);
        });
    });
});
