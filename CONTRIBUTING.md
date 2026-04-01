# 🤝 แนวทางการทำงานร่วมกัน (Team Collaboration Guide)

เพื่อให้การทำงานในโปรเจคเดียวกันเป็นไปอย่างราบรื่น ไม่แก้โค้ดทับกัน และรักษามาตรฐานคุณภาพโค้ด ขอให้ทีมงานทุกคนปฏิบัติตามแนวทางดังนี้:

---

## 🌿 1. การจัดการ Branch (Git Workflow)

เราจะใช้ระบบ **Feature Branch** โดยห้าม Push โค้ดลง `main` โดยตรง:

1. **สร้าง Branch ใหม่**: ทุกครั้งที่เริ่มงานใหม่ (เช่น เพิ่มเทสเคสใหม่)
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```
2. **Commit งาน**: เขียนข้อความ Commit ให้ชัดเจน
   ```bash
   git add .
   git commit -m "add: scenario for account creation validation"
   ```
3. **Push & Pull Request (PR)**: ส่งขึ้น Git และสร้าง PR เพื่อให้เพื่อนร่วมทีมช่วยตรวจ (Code Review)
   ```bash
   git push origin feature/your-feature-name
   ```

---

## 🛠️ 2. มาตรฐานการเขียนโค้ด (Coding Standards)

### 🚀 การแยกส่วน API Logic (Modular)
- **ห้าม** เขียน URL หรือ Path ตรงๆ ในไฟล์ `.spec.js`
- **ต้อง** สร้างไฟล์ใน `lib/api/` (หากยังไม่มี) และสร้างฟังก์ชันเพื่อเรียกใช้ API นั้นๆ
- **ตัวอย่าง**: หากทำระบบ Withdraw ให้สร้าง `lib/api/WithdrawApi.js`

### ✅ การส่งค่าต่อระหว่าง API (State Management)
- ใช้ `pmGlobals` (จาก `lib/GlobalVars.js`) เพื่อเก็บค่าที่ได้จาก API หนึ่งไปใช้ใน API ถัดไป
- **ตัวอย่าง**:
  ```javascript
  pmGlobals.set('myToken', responseBody.token);
  // ใน API ถัดไป
  const token = pmGlobals.get('myToken');
  ```

---

## ⚠️ 3. ข้อควรระวัง (Do's & Don'ts)

- **ห้ามลบ/แก้ไขไฟล์ Core**: ไฟล์ `lib/Utils.js` และ `lib/TestHelper.js` เป็นหัวใจหลักของโปรเจค หากต้องการแก้ไขต้องปรึกษาทีมก่อน
- **Update เครื่องตัวเองเสมอ**: ก่อนเริ่มงานทุกวัน ให้รัน `git pull origin main` เพื่อให้ได้โค้ดล่าสุดจากเพื่อน
- **ไฟล์ .env**: ห้ามนำขึ้น Git โดยเด็ดขาด (ตรวจสอบไฟล์ `.gitignore` เสมอ)
- **Local Config**: หากเพิ่มตัวแปรใน `.env` ใหม่ อย่าลืมแจ้งเพื่อนในทีมให้เพิ่มตามด้วย

---

## 🧪 4. การตรวจสอบก่อนส่งงาน (Definition of Done)
งานจะถือว่าเสร็จสมบูรณ์เมื่อ:
1. เทสผ่านทั้งหมดในเครื่องตัวเอง (`npx playwright test`)
2. ไม่มี Error ใน Console
3. โค้ดถูกจัดรูปแบบ (Formatting) ให้เรียบร้อย
4. มีการอัปเดตไฟล์ API หลักหากมีการเปลี่ยน Path หรือ Headers
