# 📘 API Test Automation (Playwright Native) - Professional Guide

โปรเจคทดสอบ API อัตโนมัติมาตรฐาน Enterprise ที่ออกแบบมาให้ทำสอบได้ "ลึก" กว่าแค่การเช็ก Response ของ API แต่ครอบคลุมไปถึงฐานข้อมูลและ Log เบื้องหลังระบบ

---

## ✨ ฟีเจอร์ที่โปรเจคนี้ทำได้ (Key Capabilities)

### 🚀 1. End-to-End API Chaining
ร้อยเรียง API หลายเส้นเข้าด้วยกัน เช่น **เปิดบัญชี ➔ ฝากเงิน ➔ เช็กยอด** โดยมีการส่งค่าตัวแปรข้ามกันผ่าน `GlobalVars.js` (จำลอง pm.globals)

### 🗄️ 2. Deep Verification (DB & AWS Logs)
ไม่ได้เช็กแค่หน้าบ้าน แต่ตรวจสอบลึกถึงหลังบ้าน:
- **Database**: รัน SQL เช็กข้อมูลใน **PostgreSQL** โดยตรงผ่าน `DbHelper.js`
- **AWS Logs**: ดึง Log จาก **CloudWatch** มาตรวจสอบ Error หรือ Success message ผ่าน `AwsLogHelper.js`

### ☁️ 3. AWS S3 & SFTP File Management
จัดการไฟล์รับ-ส่งสำหรับงาน Batch:
- **S3**: Upload/Check/Read/Delete ไฟล์บน AWS S3
- **SFTP**: รับ-ส่งไฟล์กับเครื่อง Server โดยตรงผ่านโปรโตคอล SFTP

### ✅ 4. Advanced JSON Assertions (`Utils.js`)
ระบบตรวจสอบข้อมูลที่อ่านง่าย แสดงผลแบบ **Expected vs Actual** ทุกฟิลด์ รองรับ Regex และ Mandatory check

### 🎮 5. Discord Smart Notification
แจ้งเตือนสรุปผลเข้า Discord ทันทีที่รันจบ พร้อมตารางสรุป, Log เคสที่พัง และแนบไฟล์รายงานตัวเต็ม

### 📊 6. Allure Dashboard
รายงานผลระดับสากลที่โชว์กราฟสถิติและประวัติการรันย้อนหลัง (บน Jenkins)

---

## 📂 โครงสร้างโฟลเดอร์ล่าสุด (Folder Structure)

```text
api-test-playwright-native/
├── lib/                     # 🧠 ส่วนประมวลผลและเครื่องมือ (The Engine)
│   ├── api/                 # 🚀 API Definitions: เก็บ Path/Method แยกตาม Service
│   ├── DbHelper.js          # 🗄️ Database: เครื่องมือรัน SQL (Postgres)
│   ├── AwsLogHelper.js      # 🔍 AWS Logs: เครื่องมือดึง CloudWatch Logs
│   ├── S3Helper.js          # ☁️ AWS S3: เครื่องมือจัดการไฟล์ S3
│   ├── SftpHelper.js        # 📂 SFTP: เครื่องมือรับ-ส่งไฟล์ผ่าน SFTP
│   ├── NotifyHelper.js      # 🎮 Discord: ระบบส่งแจ้งเตือนและไฟล์
│   ├── TestHelper.js        # 🛠️ Utilities: สร้าง UUID, Date, Header Templates
│   └── Utils.js             # ✅ Assertion: ตัวตรวจสอบ JSON (Postman Style)
├── tests/                   # 🧪 Scenarios (สคริปต์ทดสอบจริง)
├── .env                     # 🔑 Configuration: เก็บ URLs/Keys (Local)
└── playwright.config.js     # 🛠️ Main Config & Discord Notify Logic
```

---

## 🚀 คำสั่งสำคัญ (Commands)

| คำสั่ง | หน้าที่ |
| :--- | :--- |
| `npm run test:allure` | **(แนะนำ)** รันเทสทั้งหมด + เปิด Allure Report ทันที |
| `npx playwright test` | รันเทสปกติ (ส่งแจ้งเตือน Discord อัตโนมัติ) |
| `allure serve allure-results` | เปิดดูรายงาน Allure ย้อนหลังในเครื่อง |
| `npm install` | ติดตั้งเครื่องมือครั้งแรกเมื่อได้โค้ดไป |
