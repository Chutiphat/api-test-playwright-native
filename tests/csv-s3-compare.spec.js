const { test } = require('@playwright/test');
const Utils = require('../lib/Utils');
const fs = require('fs');
const path = require('path');

test.describe('CSV Validation with Template File @csv', () => {
    const utils = new Utils();

    test('Should match actual mock CSV with template.csv', async () => {
        // ✅ อ่านข้อมูลจากไฟล์ Mock เพื่อจำลองข้อมูลที่ได้จาก S3
        const mockPath = path.join(__dirname, '../input/mocks/actual_mock.csv');
        const actualCsv = fs.readFileSync(mockPath, 'utf8');

        // ✅ ทำการเปรียบเทียบกับไฟล์ต้นแบบ (ที่วางไว้ใน input/expected_results/template.csv)
        await utils.compareCsvWithFile("template.csv", actualCsv);
    });
});
