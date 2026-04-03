# 🎡 การติดตั้งและตั้งค่า Jenkins (Full Guide)

คู่มือนี้จะพาคุณไปถึงจุดที่รันเทสบน Jenkins และได้กราฟ Allure สวยๆ ครับ

---

## 1. การติดตั้งปลั๊กอิน (Plugins)
ต้องติดตั้ง 2 ปลั๊กอินนี้ก่อนเริ่ม:
1. **NodeJS Plugin**: สำหรับสั่งรัน `npm install`
2. **Allure Jenkins Plugin**: สำหรับทำรายงานผล

---

## 2. การตั้งค่าระบบ (Global Tool Configuration)
1. **NodeJS**: ตั้งชื่อว่า `node20` และเลือก Install automatically (Node 20.x)
2. **Allure Report**: ตั้งชื่อว่า `allure` และเลือก Install automatically

---

## 3. การสร้าง Pipeline Job
1. สร้าง **New Item** ➔ **Pipeline**
2. เลือก **Pipeline script from SCM** ➔ **Git**
3. ใส่ Repository URL: `https://github.com/Chutiphat/api-test-playwright-native.git`
4. **Script Path**: `Jenkinsfile`

---

## 4. ฟีเจอร์เด่นบน Jenkins ของโปรเจคนี้
- **Parameters**: สามารถเลือก API ที่จะรันได้จากหน้าจอ (TEST_SCENARIO)
- **Auto Notify**: ส่งแจ้งเตือนพร้อมสรุปตัวเลขเข้า Discord อัตโนมัติ
- **Allure Dashboard**: คลิกเมนู "Allure Report" ด้านซ้ายเพื่อดูประวัติย้อนหลังและกราฟครับ
