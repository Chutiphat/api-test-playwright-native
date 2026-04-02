# 📘 API Test Automation (Playwright Native)

โปรเจคนี้ใช้แนวคิด **Modular Design** (แยกส่วนการทำงาน) เพื่อให้โค้ดอ่านง่าย แก้ไขที่เดียว และรองรับการทำ E2E Flow ที่ซับซ้อนได้อย่างยืดหยุ่น

---

## 📂 1. โครงสร้างโฟลเดอร์ (Folder Structure)

```text
api-test-playwright-native/
├── lib/                     # 🧠 ส่วนสมองและเครื่องมือกลาง (The Engine)
│   ├── api/                 # 🚀 API Definitions: เก็บ URL และวิธีการยิง API
│   │   ├── AccountApi.js    # API จัดการบัญชี (Port 8081)
│   │   ├── BatchApi.js      # API สั่งรัน Batch (Port 8085)
│   │   ├── S3Helper.js      # AWS S3 Utilities (Upload/Check/Read)
│   │   ├── ExchangeApi.js   # ตัวอย่าง API ภายนอก
│   │   └── JsonPlaceholderApi.js
│   ├── GlobalVars.js        # 📦 State & Config Management (pm.globals)
│   ├── TestHelper.js        # 🛠️ Utilities: สร้าง UUID, Date, ข้อมูลสุ่ม
│   └── Utils.js             # ✅ Assertion Engine: ตัวตรวจสอบ JSON แบบละเอียด
├── tests/                   # 🧪 สคริปต์ทดสอบ (Test Scenarios)
│   ├── batch-e2e-flow.spec.js # เทส E2E: Upload ➔ Batch ➔ S3 Verify
│   ├── test02-scene1.spec.js  # เทส Scene แยกตามฟีเจอร์
│   └── test02-scene2.spec.js
├── .env                     # 🔑 ตั้งค่า URL/AWS Keys (Local)
├── Jenkinsfile              # ⚙️ สคริปต์ควบคุมการรันอัตโนมัติบน Jenkins
└── playwright.config.js     # 🛠️ การตั้งค่าหลัก (Timeout, Default Headers)
```

---

## 🔍 2. รายละเอียดส่วนประกอบสำคัญ (Core Components)

### 🚀 **lib/api/ (API Repository)**
*   **หลักการ**: 1 Service = 1 ไฟล์ เพื่อความง่ายในการดูแลรักษา
*   **Dynamic URL**: ดึง Base URL จาก `GlobalVars` โดยระบุชื่อเฉพาะเจาะจง (เช่น `orch_deposit_batch_trigger`)

### ✅ **lib/Utils.js (The Assertion Engine)**
*   **การใช้งาน**: เรียก `utils.TestSuccess(expectedData, response)`
*   **ฟีเจอร์**: ตรวจสอบแบบ `mandatory`, `optional`, **Regex**, และ **Data Type** พร้อมแสดงผลแบบ **Expected vs Actual** ในทุกฟิลด์

### 📦 **lib/GlobalVars.js (State Management)**
*   **State**: ใช้เก็บค่าจาก API หนึ่งไปใช้อีก API หนึ่ง (จำลอง `pm.globals.set/get`)
*   **Config**: รองรับการ Override ค่าจากไฟล์ `.env` และ Environment Variables ของ Jenkins

---

## ☁️ 3. การรันบน Jenkins (CI/CD)
โปรเจคนี้รองรับการรันผ่าน **Jenkins Pipeline** พร้อมระบบเลือกเคส (**TEST_SCOPE**):

### **สโคปการรันที่มีให้เลือก:**
1.  **ALL**: รันไฟล์เทสทั้งหมดในโปรเจค
2.  **Scene 1 Only**: รันเฉพาะการเช็ก Exchange Rates
3.  **Scene 2 Only**: รันเฉพาะการสร้าง Post
4.  **Batch Flow**: (เพิ่มใหม่) รันขั้นตอน E2E สำหรับ Batch และ S3

---

## 🚀 การตั้งค่าเครื่องสำหรับทีมใหม่ (Setup)
```bash
# 1. Clone & Install
git clone https://github.com/Chutiphat/api-test-playwright-native.git
npm install
npx playwright install chromium

# 2. สร้างไฟล์ .env
# คัดลอกค่าจากตัวอย่างในไฟล์ README นี้ไปใส่ในไฟล์ .env ของคุณ
```
