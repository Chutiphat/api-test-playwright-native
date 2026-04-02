# 🚀 คู่มือการเซ็ตอัพสำหรับทีม (Team Onboarding Guide)

ยินดีต้อนรับสู่โปรเจค API Test Automation! ทำตามขั้นตอนด้านล่างนี้เพื่อตั้งค่าเครื่องของคุณให้พร้อมรันเทสครับ

---

## 1. การเตรียมเครื่อง (Prerequisites)
ตรวจสอบให้มั่นใจว่าเครื่องของคุณติดตั้งสิ่งเหล่านี้แล้ว:
- **Node.js**: (แนะนำเวอร์ชัน 18 ขึ้นไป)
- **Git**

---

## 2. ขั้นตอนการติดตั้ง (Installation)

เปิด Terminal แล้วรันคำสั่งตามลำดับดังนี้:

```bash
# 1. Clone โปรเจคลงมาที่เครื่อง
git clone https://github.com/Chutiphat/api-test-playwright-native.git
cd api-test-playwright-native

# 2. ติดตั้ง Library ทั้งหมด
npm install

# 3. ติดตั้ง Browser สำหรับ Playwright
npx playwright install chromium
```

---

## 3. การตั้งค่า Environment (`.env`) ⚠️ สำคัญมาก

ไฟล์นี้จะไม่ถูกอัปโหลดขึ้น Git เพื่อความปลอดภัย ให้คุณสร้างไฟล์ชื่อ **`.env`** ไว้ที่โฟลเดอร์นอกสุดของโปรเจค และใส่ค่าดังนี้:

```text
# --- API URLs ---
ACCOUNT_URL=http://127.0.0.1:8081
RESTRICTION_URL=http://127.0.0.1:8086
BATCH_URL=http://127.0.0.1:8085

# --- AWS Credentials (สำหรับเทส S3/Batch) ---
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-southeast-1

# --- Auth Secrets ---
API_CLIENT_ID=MY_LOCAL_CLIENT
API_CLIENT_SECRET=LOCAL_SECRET_PASS
```
*(หมายเหตุ: ติดต่อหัวหน้าทีมเพื่อขอค่า Access Key และ Secret ของจริง)*

---

## 4. การลองรันเทส (Verify Setup)

ลองรันคำสั่งเหล่านี้เพื่อเช็กว่าทุกอย่างถูกต้อง:

```bash
# รันเทสทั้งหมด
npx playwright test

# ดูรายงานผล (Report)
npx playwright show-report
```

---

## 🛠️ การทำงานร่วมกัน (Collaboration)
- **สร้าง Branch ใหม่เสมอ**: `git checkout -b feature/your-task-name`
- **ห้ามแก้ไขไฟล์ใน `lib/Utils.js`**: หากไม่ได้รับอนุญาต
- **อัปเดตโค้ดทุกเช้า**: `git pull origin main` เพื่อป้องกันโค้ดตีกัน (Conflict)

---
*หากพบปัญหาในการเซ็ตอัพ สามารถสอบถามได้ที่ช่องแชทกลุ่มของทีมครับ!*
