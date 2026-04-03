# 📘 API Test Automation (Playwright Native)

โปรเจคทดสอบ API อัตโนมัติมาตรฐาน Enterprise ออกแบบตามแนวคิด **Modular Design** เพื่อความยืดหยุ่นสูงสุด รองรับ E2E Flow, ระบบไฟล์ S3 และการรายงานผลแบบ Hybrid

---

## ✨ ฟีเจอร์เด่น (Key Features)

### 🚀 1. Modular API Repository
แยก Logic การยิง API ออกจากสคริปต์ทดสอบ ทำให้แก้ไข Path หรือ URL ได้ในที่เดียวที่ `lib/api/`

### ✅ 2. Advanced JSON Validation (`Utils.js`)
ระบบตรวจสอบ JSON ที่ถอดแบบมาจาก Postman รองรับการเช็กแบบ:
- `mandatory`: ต้องมีค่าและไม่ว่าง
- `optional`: มีก็ได้ไม่มีก็ได้
- `Regex`: ตรวจสอบรูปแบบ (เช่น วันที่, UUID)
- **Expected vs Actual**: แสดงผลการเปรียบเทียบชัดเจนในทุกรายงาน

### 📦 3. Global State Management (`GlobalVars.js`)
จำลอง `pm.globals` ใน Postman เพื่อส่งค่าข้าม API เช่น เก็บ `accountNo` จาก API แรกไปใช้ใน API ที่สอง

### ☁️ 4. AWS S3 Lifecycle Management
Helper สำหรับจัดการไฟล์บน S3 แบบครบวงจร (Upload -> Check -> Read -> Delete) เหมาะสำหรับงาน Batch Testing

### 📊 5. Hybrid Reporting System
- **Allure Report**: รายงานหลักสำหรับการดูประวัติย้อนหลังและ Dashboard สวยงาม
- **Monocart Reporter**: สร้างไฟล์ HTML ไฟล์เดียว (`automation-report.html`) สำหรับส่งเข้า Discord

### 🎮 6. Discord Notification with Logs & Files
แจ้งเตือนเข้า Discord อัตโนมัติเมื่อรันจบ พร้อม:
- ตารางสรุปจำนวน Pass/Fail/Duration
- Log รายละเอียดเคสที่พัง (Failed Logs)
- **แนบไฟล์รายงานตัวเต็ม** เข้าห้องแชททันที

---

## 📂 โครงสร้างโฟลเดอร์ (Folder Structure)

```text
api-test-playwright-native/
├── lib/                     # 🧠 The Engine (ส่วนประมวลผลหลัก)
│   ├── api/                 # 🚀 API Definitions (Path & Method)
│   ├── GlobalVars.js        # 📦 ตัวเก็บตัวแปรส่งต่อข้าม API
│   ├── TestHelper.js        # 🛠️ ตัวช่วยสร้าง UUID, Date, Headers
│   ├── S3Helper.js          # ☁️ เครื่องมือจัดการ AWS S3
│   ├── NotifyHelper.js      # 🎮 ระบบส่งข้อความ/ไฟล์เข้า Discord
│   └── Utils.js             # ✅ ระบบตรวจสอบ JSON (Assertion)
├── tests/                   # 🧪 Scenarios (สคริปต์ทดสอบ)
├── .env                     # 🔑 ตั้งค่า URLs/Secrets (Local Only)
├── Jenkinsfile              # ⚙️ Pipeline สำหรับรันอัตโนมัติบน Jenkins
└── playwright.config.js     # 🛠️ คอนฟิกหลักและระบบแจ้งเตือน
```

---

## 🚀 วิธีใช้งาน (Commands)

### **การรันเทสปกติ:**
```bash
npx playwright test
```

### **รันเทสพร้อมเปิด Allure Report ทันที (แนะนำ!):**
```bash
npm run test:allure
```

### **ดูรายงานย้อนหลัง:**
```bash
allure serve allure-results
```
