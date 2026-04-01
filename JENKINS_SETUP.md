# 🎡 การติดตั้งและตั้งค่า Jenkins (macOS)

คู่มือการติดตั้ง Jenkins บนเครื่อง macOS เพื่อใช้รัน API Test Automation แบบอัตโนมัติ

---

## 1. ติดตั้ง Java
Jenkins พัฒนาด้วย Java จึงจำเป็นต้องติดตั้ง Java Development Kit (JDK) ก่อน:
```bash
brew install openjdk@17
```
*(หากยังไม่มี Homebrew ให้ติดตั้งก่อนที่ [brew.sh](https://brew.sh))*

---

## 2. ติดตั้ง Jenkins LTS
ติดตั้ง Jenkins เวอร์ชันที่เสถียรที่สุดผ่าน Homebrew:
```bash
brew install jenkins-lts
```

---

## 3. เริ่มต้นใช้งาน Jenkins
สั่งให้ Jenkins เริ่มทำงานเป็น Service (จะรันอัตโนมัติทุกครั้งที่เปิดเครื่อง):
```bash
brew services start jenkins-lts
```
*เริ่มต้น Jenkins จะรันที่พอร์ต **8080** (http://localhost:8080)*

---

## 4. การตั้งค่าครั้งแรก (Unlock Jenkins)
1. เปิด Browser ไปที่: [http://localhost:8080](http://localhost:8080)
2. เมื่อหน้าจอถามหา Password ให้กลับไปที่ Terminal แล้วรันคำสั่ง:
   ```bash
   cat ~/.jenkins/secrets/initialAdminPassword
   ```
3. Copy รหัสที่ได้ไปวางในช่องบน Browser แล้วกด **Continue**

---

## 5. ติดตั้ง Plugins และสร้าง User
1. เลือก **"Install suggested plugins"** และรอจนกว่าจะโหลดเสร็จ
2. สร้าง **Admin User**: ตั้ง Username และ Password สำหรับใช้งาน
3. กด **Save and Finish** เพื่อเข้าสู่หน้าหลัก

---

## 6. ติดตั้ง Plugins สำหรับ Playwright (สำคัญ! ⚠️)
เพื่อให้รันคำสั่ง npm และแสดงผล Report ได้ ต้องติดตั้งปลั๊กอินเพิ่ม:
1. ไปที่ **Manage Jenkins** ➔ **Plugins** ➔ **Available plugins**
2. ค้นหาและติดตั้ง:
   *   **NodeJS**: สำหรับรันคำสั่ง `npm`
   *   **HTML Publisher**: สำหรับแสดงผลเทส `playwright-report`
3. กด **Install without restart**

---

## 7. ตั้งค่า NodeJS ใน Jenkins
1. ไปที่ **Manage Jenkins** ➔ **Tools**
2. เลื่อนไปที่หัวข้อ **NodeJS** ➔ กด **Add NodeJS**
3. ตั้งชื่อว่า `node20`
4. ติ๊กถูกที่ **Install automatically** และเลือกเวอร์ชันล่าสุด (Node 20.x หรือ 22.x)
5. กด **Save**

---

## 🚀 ขั้นตอนสุดท้าย: สร้าง Job เพื่อรันเทส
1. ที่หน้า Dashboard กด **New Item**
2. ตั้งชื่อโปรเจค เลือก **Pipeline** แล้วกด **OK**
3. เลื่อนไปที่ส่วน **Pipeline** ➔ เลือก **Pipeline script from SCM**
4. **SCM**: เลือก **Git**
5. **Repository URL**: `https://github.com/Chutiphat/api-test-playwright-native.git`
6. กด **Save** และลองกด **Build Now**
