# 📘 API Test Automation (Playwright Native)

โปรเจคสำหรับทดสอบ API แบบอัตโนมัติ โดยใช้ Playwright Framework ออกแบบตามโครงสร้าง Modular เพื่อความยืดหยุ่นและการดูแลรักษาที่ง่ายในระดับองค์กร

---

## 🚀 การเริ่มต้นใช้งาน (Quick Start for Team)

### 1. การตั้งค่าเครื่อง (Setup)
```bash
# 1. Clone โปรเจค
git clone https://github.com/Chutiphat/api-test-playwright-native.git
cd api-test-playwright-native

# 2. ติดตั้ง Library
npm install

# 3. ติดตั้งเบราว์เซอร์สำหรับ Playwright
npx playwright install chromium
```

### 2. สร้างไฟล์ Environment (`.env`)
คัดลอกข้อความด้านล่างนี้ไปสร้างไฟล์ชื่อ `.env` ไว้ที่ Root ของโปรเจค (ห้ามลืม! ⚠️)
```text
ACCOUNT_URL=http://127.0.0.1:8081
RESTRICTION_URL=http://127.0.0.1:8086
API_CLIENT_ID=MY_LOCAL_CLIENT
API_CLIENT_SECRET=LOCAL_SECRET_PASS
```

---

## 📂 โครงสร้างโปรเจค (Project Structure)

```text
api-test-playwright-native/
├── lib/                     # 🧠 ส่วนสมองและเครื่องมือกลาง (The Engine)
│   ├── api/                 # 🚀 API Definitions: เก็บ URL และฟังก์ชันยิง API แยกตาม Service
│   ├── GlobalVars.js        # 📦 State Management: เก็บตัวแปรกลาง (เหมือน pm.globals)
│   ├── TestHelper.js        # 🛠️ Utilities: ตัวช่วยสร้าง UUID, Date, และข้อมูลสุ่ม
│   └── Utils.js             # ✅ Assertion Engine: ตัวตรวจสอบข้อมูล JSON (รองรับ Regex/Mandatory)
├── tests/                   # 🧪 สคริปต์ทดสอบ (Test Scenarios)
│   └── *.spec.js            # ไฟล์ทดสอบแยกตามฟีเจอร์หรือ Scenario
├── .env                     # 🔑 Local Configuration (ไม่ถูกอัปโหลดขึ้น Git)
├── Jenkinsfile              # ⚙️ สคริปต์ควบคุมการรันบน CI/CD (Jenkins)
└── playwright.config.js     # 🛠️ การตั้งค่าหลักของ Playwright
```

---

## 🧪 การรันชุดทดสอบ (Running Tests)

```bash
# รันเทสทั้งหมด
npx playwright test

# รันเฉพาะไฟล์ที่ต้องการ
npx playwright test tests/test02-scene1.spec.js

# ดูรายงานผลการทดสอบ (HTML Report)
npx playwright show-report
```

---

## ☁️ การใช้งานบน Jenkins
โปรเจคนี้รองรับการรันแบบ Pipeline พร้อม Parameters:
1. **ACCOUNT_URL**: ระบุ URL ของ API ที่ต้องการเทส (เช่น UAT/Dev)
2. **TEST_SCOPE**: เลือกเทสทั้งหมด หรือเฉพาะบาง Scene

---

## 💡 แนวทางการเขียนเทส (Best Practices)
1. **Don't Repeat Yourself (DRY)**: หากต้องใช้ API เส้นเดิมซ้ำ ให้สร้างเป็น Method ใน `lib/api/`
2. **Modular Assertions**: ใช้ `utils.TestSuccess(expectedData, response)` เพื่อตรวจสอบข้อมูล
3. **Sensitive Data**: ห้ามใส่ Password หรือ Secret ลงในโค้ดโดยตรง ให้ใช้ผ่าน `.env` หรือ `GlobalVars`



## ถ้าจะยกเลิก Rebase ที่ค้างอยู่:
   1.  git rebase --abort

   2. เริ่ม Rebase ใหม่ (ใช้ตัวเลข HEAD แทนจะง่ายกว่าครับ):
      สมมติว่าคุณต้องการย้อนกลับไปแก้ commit ลำดับที่ 2 จากบนสุด:
      git rebase -i HEAD~2

   3. ทำตามขั้นตอนเดิมใน Vim:
       * กด i
       * เปลี่ยน pick เป็น reword (หรือแค่ r)
       * กด Esc
       * พิมพ์ :wq แล้วกด Enter
       * (หน้าจอใหม่จะเด้งมาให้แก้ข้อความ)
       * แก้ข้อความเสร็จ กด Esc ➔ พิมพ์ :wq ➔ กด Enter

   4. Force Push:
   git push --force origin main

