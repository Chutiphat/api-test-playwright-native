## 🚀 การตั้งค่าเครื่องสำหรับทีมใหม่ (Setup)
```bash
# 1. Clone โปรเจค
git clone https://github.com/Chutiphat/api-test-playwright-native.git
cd api-test-playwright-native

# 2. ติดตั้ง Library และ Browsers
npm install
npx playwright install chromium
```
**อย่าลืมสร้างไฟล์ `.env` ตามตัวอย่างในไฟล์ README นี้ก่อนรันเทส!**

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