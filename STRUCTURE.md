📘 คู่มือโครงสร้างโปรเจค API Test Automation (Playwright)

  โปรเจคนี้ใช้แนวคิด Modular Design (แยกส่วนการทำงาน) เพื่อให้โค้ดอ่านง่าย แก้ไขที่เดียว และรองรับการทำ E2E Flow ที่ซับซ้อนได้อย่างยืดหยุ่น

  📂 1. โครงสร้างโฟลเดอร์ (Folder Structure)

    1 api-test-playwright-native/
    2 ├── lib/                     # 🧠 ส่วนสมองและเครื่องมือกลาง (The Engine)
    3 │   ├── api/                 # 🚀 API Definitions (เส้นหลัก)
    4 │   │   ├── AccountApi.js    # Logic การยิง API ของแต่ละ Service
    5 │   │   └── ...              # (เพิ่มไฟล์ตาม Service เช่น OrderApi, UserApi)
    6 │   ├── GlobalVars.js        # 📦 ตัวเก็บตัวแปรกลาง (pm.globals)
    7 │   ├── TestHelper.js        # 🛠️ ตัวช่วยสร้าง UUID, Date, และข้อมูลสุ่ม
    8 │   └── Utils.js             # ✅ ตัวตรวจสอบข้อมูล (Assertion Engine)
    9 ├── tests/                   # 🧪 ส่วนสคริปต์ทดสอบ (Test Scenarios)
   10 │   ├── test02-scene1.spec.js# เทสเคสแยกตาม Feature หรือ Scenario
   11 │   └── bck/                 # ไฟล์สำรองหรือตัวอย่างดั้งเดิม
   12 ├── .env                     # 🔑 ตั้งค่า URL/Secrets สำหรับรันในเครื่อง (Local)
   13 ├── Jenkinsfile              # ⚙️ สคริปต์ควบคุมการรันอัตโนมัติบน Jenkins
   14 ├── playwright.config.js     # 🛠️ คอนฟิกหลักของ Playwright (Timeout, Reporter)
   15 ├── package.json             # 📄 รายการ Library และคำสั่งรันเทส (Scripts)
   16 └── .gitignore               # 🚫 สิ่งที่ไม่ต้องการให้ขึ้น Git (node_modules, .env)

  ---

  🔍 2. รายละเอียดส่วนประกอบสำคัญ (Core Components)

  🚀 lib/api/ (API Repository)
   * หน้าที่: เก็บ URL และวิธีการยิง API (Method, Path) ของแต่ละเส้น
   * การดูแลรักษา: หาก API เปลี่ยน URL หรือ Path ให้แก้ที่นี่ที่เดียว ทุกไฟล์เทสจะอัปเดตตามทันที
   * หลักการ: 1 Service = 1 ไฟล์ (เช่น AccountApi.js, PaymentApi.js)

  ✅ lib/Utils.js (The Assertion Engine)
   * หน้าที่: เป็นตัวตรวจสอบ JSON Response ให้เหมือนใน Postman
   * ฟีเจอร์เด่น: รองรับการตรวจสอบแบบ mandatory (ต้องมีค่า), optional (มีก็ได้ไม่มีก็ได้), Regex (ตรวจสอบรูปแบบ), และ Data Type (เช่น TYPE_STRING,
     TYPE_NUMBER)
   * การใช้งาน: เรียก utils.TestSuccess(expectedData, response)

  📦 lib/GlobalVars.js (State Management)
   * หน้าที่: จำลอง pm.globals ใน Postman ใช้สำหรับเก็บค่าจาก API หนึ่งไปใช้อีก API หนึ่ง
   * การใช้งาน: pmGlobals.set('accountNo', '123') และ pmGlobals.get('accountNo')
   * CI/CD: รองรับการดึงค่าจาก Environment Variables ของ Jenkins อัตโนมัติ

  🛠️ lib/TestHelper.js (Utilities)
   * หน้าที่: ฟังก์ชันช่วยสร้างข้อมูล เช่น generateApiHeaders() เพื่อสร้าง UUID และ TraceParent ใหม่ทุกครั้งที่รัน

  ---

  🔄 3. ขั้นตอนการทำงาน (Workflow)

  เมื่อต้องการเพิ่ม API เส้นใหม่:
   1. เพิ่ม URL ของ Service นั้นใน lib/GlobalVars.js และไฟล์ .env
   2. สร้างไฟล์ใน lib/api/ เพื่อเขียนฟังก์ชันการยิง API นั้น
   3. สร้างไฟล์ .spec.js ใน tests/ เพื่อเขียน Scenario การทดสอบ

  การรันเทส (Commands):
   * รันทั้งหมด: npx playwright test
   * รันเฉพาะไฟล์: npx playwright test tests/my-test.spec.js
   * ดู Report: npx playwright show-report

  ---

  ☁️ 4. การรันบน Jenkins (CI/CD)
   * โปรเจคนี้รองรับการรันผ่าน Jenkins Pipeline โดยใช้ไฟล์ Jenkinsfile
   * สามารถส่งพารามิเตอร์ ACCOUNT_URL หรือเลือก TEST_SCOPE ได้จากหน้าจอ Jenkins โดยไม่ต้องแก้โค้ด

  ---

  💡 คำแนะนำสำหรับคนที่จะมา Maintain ต่อ:
   1. ห้ามแก้ไฟล์ Utils.js: ถ้าไม่จำเป็น เพราะเป็นหัวใจของการตรวจสอบข้อมูล
   2. แยก Scene ให้ชัดเจน: 1 ไฟล์ .spec.js ควรเป็น 1 Scenario ที่อ่านแล้วเข้าใจง่าย
   3. ใช้ .env เสมอ: อย่าใส่ URL จริงลงในโค้ด ให้ใส่ผ่าน .env หรือ GlobalVars เพื่อความปลอดภัยและความยืดหยุ่น