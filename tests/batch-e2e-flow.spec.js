const { test, expect } = require('@playwright/test');
const BatchApi = require('../lib/api/BatchApi');
const S3Helper = require('../lib/S3Helper');
const TestHelper = require('../lib/TestHelper');
const Utils = require('../lib/Utils');

test.describe('BatchFlow (E2E S3)', () => {
    const utils = new Utils();
    const s3 = new S3Helper();
    
    const BUCKET = "deposit-batch-bucket";
    const INPUT_PATH = `restriction/input/test_${Date.now()}.csv`;
    const OUTPUT_PATH = `restriction/output/result_${Date.now()}.json`;

    test.afterEach(async () => {
        await s3.deleteFile(BUCKET, INPUT_PATH);
        await s3.deleteFile(BUCKET, OUTPUT_PATH);
    });

    test('ควรสั่งรัน Batch ด้วย Ops Portal Header และตรวจสอบผลสำเร็จ', async ({ request }) => {
        const batchApi = new BatchApi(request);
        
        // 1. สร้างค่าพื้นฐาน
        const { requestId, traceParent } = TestHelper.generateApiHeaders();
        const { date, time } = TestHelper.getRequestDateTime();

        // 2. ดึง Template Header มาใช้ (ไม่ต้องพิมพ์ 'ops-portal' เองแล้ว)
        // ถ้าอยากใช้ Paotang ก็แค่เปลี่ยนเป็น TestHelper.getPaotangHeaders(...)
        const headers = {
            ...TestHelper.getOpsHeaders(requestId, traceParent),
            'x-request-date': date,
            'x-request-time': time
        };

        await test.step('1. Preparation: Upload Input', async () => {
            await s3.uploadFile(BUCKET, INPUT_PATH, "accountNo,restrictionCode\n123,10");
        });

        await test.step('2. Action: Trigger Batch', async () => {
            const payload = {
                "name": "CCD_RESTRICTION_RESTRICTION_02",
                "triggerMode": "AUTO",
                "triggerBy": "AUTOSYS",
                "additionalInfo": { "executeDate": date, "input": INPUT_PATH, "output": OUTPUT_PATH }
            };
            // ส่ง headers ที่เป็น Template เข้าไปได้เลย
            const response = await batchApi.triggerBatch(headers, payload);
            await utils.TestSuccess({ "responseCode": "0000" }, response);
        });

        await test.step('3. Monitoring & Validation', async () => {
            // ... (Logic เหมือนเดิม)
        });
    });
});
