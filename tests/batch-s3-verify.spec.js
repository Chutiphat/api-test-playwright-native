const { test, expect } = require('@playwright/test');
const S3Helper = require('../lib/api/S3Helper');

/**
 * 🎬 Scenario: E2E Batch Process (Upload Input ➔ Verify Output)
 */
test.describe('E2E Batch Lifecycle on S3', () => {
    const s3 = new S3Helper();
    
    const BUCKET_NAME = "my-batch-bucket";
    const INPUT_KEY = "inputs/test_data.json";
    const OUTPUT_KEY = "outputs/result.json";

    test('ควรทำงานได้ครบวงจรตั้งแต่การอัปโหลดจนถึงตรวจสอบผลลัพธ์', async () => {
        
        // --- STEP 1: อัปโหลดไฟล์ Input เพื่อเตรียมให้ Batch รัน ---
        await test.step('1. Upload Input file to S3', async () => {
            const inputData = JSON.stringify({
                id: "TXN_001",
                amount: 5000,
                status: "PENDING"
            });

            const success = await s3.uploadFile(BUCKET_NAME, INPUT_KEY, inputData, "application/json");
            expect(success, "Input file should be uploaded successfully").toBe(true);
        });

        // --- STEP 2: (จำลอง) สั่งรัน Batch ผ่าน API ---
        await test.step('2. Trigger Batch via API (Simulated)', async () => {
            console.log("Triggering batch process...");
            // await batchApi.startJob(INPUT_KEY);
        });

        // --- STEP 3: รอและตรวจสอบไฟล์ Output ใน S3 ---
        await test.step('3. Wait for Output in S3', async () => {
            let isFileReady = false;
            for (let i = 0; i < 10; i++) {
                isFileReady = await s3.fileExists(BUCKET_NAME, OUTPUT_KEY);
                if (isFileReady) break;
                await new Promise(r => setTimeout(r, 3000));
            }
            expect(isFileReady, "Output file should be generated").toBe(true);
        });

        // --- STEP 4: ตรวจสอบเนื้อหาใน Output ---
        await test.step('4. Verify Output Content', async () => {
            const content = await s3.getFileContent(BUCKET_NAME, OUTPUT_KEY);
            const json = JSON.parse(content);
            expect(json.status).toBe("SUCCESS");
        });
    });
});
