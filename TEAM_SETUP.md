# 🚀 คู่มือการเซ็ตอัพสำหรับทีม (Team Setup Guide)

ทำตามขั้นตอนด้านล่างนี้เพื่อตั้งค่าเครื่องของคุณให้พร้อมทำงานภายใน 5 นาที

---

## 1. ติดตั้งเครื่องมือ (Prerequisites)
- **Node.js**: แนะนำเวอร์ชัน 20 หรือล่าสุด
- **Git**
- **Allure CLI**: (จำเป็นสำหรับดูรายงาน)
  - Mac: `brew install allure`
  - Windows: โหลดไฟล์ `.zip` จากเว็บ Allure และนำไปวางใน Environment Path

---

## 2. การติดตั้ง (Installation)
```bash
# Clone โปรเจค
git clone https://github.com/Chutiphat/api-test-playwright-native.git
cd api-test-playwright-native

# ติดตั้ง Library
npm install

# ติดตั้ง Browser
npx playwright install chromium
```

---

## 3. การตั้งค่า Environment (`.env`)
สร้างไฟล์ **`.env`** ไว้ที่โฟลเดอร์ Root และใส่ค่าดังนี้:
```text
ACCOUNT_URL=http://127.0.0.1:8081
RESTRICTION_URL=http://127.0.0.1:8086
BATCH_URL=http://127.0.0.1:8085

# --- AWS (สำหรับ Batch Test) ---
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-southeast-1

# --- Notifications ---
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

---

## 4. การรันและตรวจสอบผล (Execution)
```bash
# รันเทสและเปิด Report ทันที
npm run test:allure
```
หากทุกอย่างถูกต้อง ข้อความแจ้งเตือนจะเด้งเข้า Discord และหน้ารายงาน Allure จะเปิดขึ้นมาใน Browser ครับ
