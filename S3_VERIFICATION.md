# ☁️ คู่มือการตรวจสอบไฟล์บน AWS S3

คู่มือนี้อธิบายวิธีการใช้ Playwright เพื่อตรวจสอบไฟล์ที่เป็นผลลัพธ์ (Output) จาก Batch Process บน AWS S3

---

## 🛠️ 1. สิ่งที่ต้องเตรียม (Setup)

### Environment Variables
คนในทีมต้องเพิ่มค่าเหล่านี้ในไฟล์ `.env` ของตัวเองเพื่อให้โค้ดเข้าถึง S3 ได้:

```text
# AWS Credentials
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-southeast-1
```

---

## 📂 2. โครงสร้างเครื่องมือ

### `lib/api/S3Helper.js`
เป็น Helper หลักที่ใช้สำหรับ:
- `fileExists(bucket, key)`: เช็กว่าไฟล์มาหรือยัง (ส่งคืน true/false)
- `getFileContent(bucket, key)`: อ่านเนื้อหาข้างในไฟล์ออกมาเป็น String
- `uploadFile(bucket, key, content, contentType)`: อัปโหลดไฟล์ขึ้น S3 (เช่น ไฟล์ CSV/JSON)

---

## 🧪 3. วิธีการเขียนสคริปต์ทดสอบ

### การอัปโหลดไฟล์ (Upload)
```javascript
await s3.uploadFile("my-bucket", "inputs/data.json", JSON.stringify({id: 1}), "application/json");
```

### การตรวจสอบไฟล์ (Wait & Verify)
คุณสามารถใช้รูปแบบการ **Polling** (วนซ้ำเช็ก) เพื่อรอไฟล์จาก Batch ที่อาจใช้เวลานานในการประมวลผล:

```javascript
const S3Helper = require('../lib/api/S3Helper');
const s3 = new S3Helper();

test('Check S3 Output', async () => {
    // วนลูปเช็กไฟล์จนกว่าจะเจอ หรือจนกว่าจะหมดเวลา
    for (let i = 0; i < 10; i++) {
        const found = await s3.fileExists("my-bucket", "path/to/file.txt");
        if (found) break;
        await new Promise(r => setTimeout(res, 5000)); // รอ 5 วิ
    }
    
    // ดึงเนื้อหามาเช็ก
    const content = await s3.getFileContent("my-bucket", "path/to/file.txt");
    expect(content).toContain("Expected Text");
});
```

---

## ☁️ 4. การใช้งานบน Jenkins
เมื่อรันบน Jenkins คุณสามารถส่งค่า AWS Credentials ผ่าน **Jenkins Credentials** หรือระบุใน Stage Environment ได้เลยครับ:

```groovy
environment {
    AWS_ACCESS_KEY_ID = credentials('aws-access-key')
    AWS_SECRET_ACCESS_KEY = credentials('aws-secret-key')
}
```

---
*หมายเหตุ: ไฟล์ตัวอย่างตัวเต็มอยู่ที่ `tests/batch-s3-verify.spec.js`*
