# ☁️ คู่มือการตรวจสอบ AWS S3 (Batch Testing)

ใช้สำหรับเคสที่ต้องตรวจสอบไฟล์ผลลัพธ์ใน S3 หลังจากสั่งรัน Batch Process

---

## 🛠️ เครื่องมือ: `lib/S3Helper.js`
เรียกใช้ Class นี้เพื่อจัดการไฟล์แบบครบวงจร:
- `uploadFile(bucket, key, content)`: เตรียมไฟล์ Input
- `fileExists(bucket, key)`: เช็กว่าไฟล์มาหรือยัง (ส่งคืน true/false)
- `getFileContent(bucket, key)`: อ่านข้อมูลในไฟล์มาเช็กฟิลด์
- `deleteFile(bucket, key)`: ล้างข้อมูลหลังเทสเสร็จ

---

## 🧪 ตัวอย่างการเขียนสคริปต์ (E2E)
```javascript
const s3 = new S3Helper();

test('Full Flow', async () => {
    // 1. Upload Input
    await s3.uploadFile("my-bucket", "in.csv", "data...");

    // 2. Poll for Output (วนเช็กไฟล์)
    for (let i = 0; i < 10; i++) {
        if (await s3.fileExists("my-bucket", "out.json")) break;
        await new Promise(r => setTimeout(r, 5000));
    }

    // 3. Verify & Cleanup
    const content = await s3.getFileContent("my-bucket", "out.json");
    expect(JSON.parse(content).status).toBe("SUCCESS");
    await s3.deleteFile("my-bucket", "in.csv");
});
```
*ดูตัวอย่างตัวเต็มที่ `tests/batch-e2e-flow.spec.js`*
