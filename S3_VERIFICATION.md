# ☁️ คู่มือการใช้งาน AWS S3 & CloudWatch Logs

โปรเจคนี้รองรับการตรวจสอบทั้งไฟล์ใน S3 และ Log ใน CloudWatch โดยไม่ต้องเข้าหน้า AWS Console

---

## 🔑 1. การเตรียมสิทธิ์เข้าถึง (AWS Permissions)

สคริปต์จะทำงานผ่าน **Programmatic Access** คุณต้องขอสิทธิ์จากแอดมินดังนี้:

### **IAM Policy ที่จำเป็น:**
- **AmazonS3FullAccess**: สำหรับ Upload/Check/Read/Delete ไฟล์
- **CloudWatchLogsReadOnlyAccess**: สำหรับการดึง Log มาตรวจสอบ

### **การตั้งค่าในโปรเจค (.env):**
```text
AWS_ACCESS_KEY_ID=กุญแจ_ID_ของคุณ
AWS_SECRET_ACCESS_KEY=รหัสกุญแจ_ของคุณ
AWS_REGION=ap-southeast-1
```

---

## 🔍 2. การตรวจสอบ Log (CloudWatch)

ใช้ `AwsLogHelper.js` เพื่อดึงข้อมูล Log มาเช็กความถูกต้อง:

```javascript
const AwsLogHelper = require('../lib/AwsLogHelper');
const logs = new AwsLogHelper();

test('Verify CloudWatch', async () => {
    const group = '/aws/lambda/my-service';
    const pattern = 'SUCCESS'; // คำที่ต้องการค้นหา
    const events = await logs.findLogs(group, pattern);
    
    expect(events.length).toBeGreaterThan(0);
});
```

---

## 📂 3. การจัดการไฟล์ (S3 Lifecycle)

ใช้ `S3Helper.js` สำหรับ Flow งาน Batch:
1.  **Upload**: `await s3.uploadFile(bucket, key, content)`
2.  **Poll & Check**: ใช้ลูปคู่กับ `await s3.fileExists(bucket, key)`
3.  **Read**: `await s3.getFileContent(bucket, key)`
4.  **Cleanup**: `await s3.deleteFile(bucket, key)` (ใส่ใน afterEach เสมอ)
