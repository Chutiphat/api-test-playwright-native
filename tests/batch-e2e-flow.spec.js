const { test, expect } = require('@playwright/test');
const BatchApi = require('../lib/api/BatchApi');
const S3Helper = require('../lib/S3Helper');
const TestHelper = require('../lib/TestHelper');
const Utils = require('../lib/Utils');

/**
 * 🎬 E2E Scenario: รัน Batch Restriction และตรวจสอบไฟล์ผลลัพธ์
 * อัปเดตตาม API: http://localhost:8085/deposit/v1/batch/create
 */
test.describe('BatchFlow (E2E S3)', () => {
    const utils = new Utils();
    const s3 = new S3Helper();
    
    // ตั้งค่าตัวแปร S3 สำหรับตรวจสอบผลลัพธ์
    const BUCKET = "deposit-batch-bucket";
    const OUTPUT_PATH = "outputs/result_success.json"; // ปรับตาม Path จริงใน S3

    test('ควรสั่งรัน Batch และได้รับไฟล์ผลลัพธ์ที่ถูกต้องจาก S3', async ({ request }) => {
        const batchApi = new BatchApi(request);
        
        // สร้าง Dynamic Headers (requestId, traceparent)
        const { requestId, traceParent } = TestHelper.generateApiHeaders();
        const { date, time } = TestHelper.getRequestDateTime();

        const headers = {
            'x-request-id': requestId,
            'x-traceparent': traceParent,
            'x-channel-id': 'PB',
            'x-request-date': date,
            'x-request-time': time,
            'x-devops-src': 'ops-portal',
            'x-devops-dest': 'ops-portal',
            'Content-Type': 'application/json'
        };

        // --- STEP 1: สั่งรัน Batch ผ่าน API ---
        await test.step('1. Trigger Batch API', async () => {
            const payload = {
                "name": "CCD_RESTRICTION_RESTRICTION_02",
                "triggerMode": "AUTO",
                "triggerBy": "AUTOSYS",
                "additionalInfo": {
                    "executeDate": date // ใช้วันที่ปัจจุบัน
                }
            };

            const response = await batchApi.triggerBatch(headers, payload);
            
            // ตรวจสอบว่า API ตอบกลับสำเร็จ
            await utils.TestSuccess({ "responseCode": "0000" }, response);
        });

        // --- STEP 2: รอจนกว่าผลลัพธ์จะปรากฏใน S3 (Polling) ---
        await test.step('2. Monitoring: Wait for Output in S3', async () => {
            let isDone = false;
            const maxAttempts = 12; // 1 นาที
            
            for (let i = 0; i < maxAttempts; i++) {
                isDone = await s3.fileExists(BUCKET, OUTPUT_PATH);
                if (isDone) break;
                
                console.log(`Waiting for batch... attempt ${i+1}/${maxAttempts}`);
                await new Promise(r => setTimeout(r, 5000));
            }
            
            expect(isDone, "Batch should finish and generate output file").toBe(true);
        });

        // --- STEP 3: ตรวจสอบความถูกต้องของข้อมูลในไฟล์ Output ---
        await test.step('3. Validation: Verify S3 Content', async () => {
            const content = await s3.getFileContent(BUCKET, OUTPUT_PATH);
            const result = JSON.parse(content);

            const expectedData = {
                "status": "SUCCESS",
                "processedCount": "mandatory"
            };
            utils.validateData(expectedData, result);
        });
    });
});
