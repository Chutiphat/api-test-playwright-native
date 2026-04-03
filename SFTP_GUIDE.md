# 📂 คู่มือการรับ-ส่งไฟล์ผ่าน SFTP

ใช้สำหรับทดสอบ Flow ที่มีการส่งไฟล์เข้าเครื่อง Server (Unix/Linux) โดยตรง

---

## 🛠️ เครื่องมือ: `lib/SftpHelper.js`
เรียกใช้ Class นี้เพื่อจัดการไฟล์บน Server:
- `uploadFile(content, remotePath)`: ส่งเนื้อหาไฟล์ขึ้น Server
- `listFiles(remoteDir)`: ดูรายชื่อไฟล์ในโฟลเดอร์
- `deleteFile(remotePath)`: ลบไฟล์ออกจาก Server

---

## 🔑 การตั้งค่าในโปรเจค (.env)
คุณต้องระบุข้อมูลเครื่อง Server ที่ต้องการเชื่อมต่อ:

```text
SFTP_HOST=10.x.x.x
SFTP_PORT=22
SFTP_USER=your_username
SFTP_PASSWORD=your_password
```

---

## 🧪 ตัวอย่างการเขียนสคริปต์
```javascript
const SftpHelper = require('../lib/SftpHelper');
const sftp = new SftpHelper();

test('SFTP Upload Test', async () => {
    const content = 'Hello SFTP';
    const remotePath = '/tmp/test.txt';

    // 1. Upload
    await sftp.uploadFile(content, remotePath);

    // 2. Verify
    const list = await sftp.listFiles('/tmp');
    const exists = list.some(f => f.name === 'test.txt');
    expect(exists).toBe(true);

    // 3. Cleanup
    await sftp.deleteFile(remotePath);
});
```
