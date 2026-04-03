# 🤝 แนวทางการทำงานร่วมกัน (Contributing Guide)

เพื่อให้โปรเจคมีความสะอาดและ Maintain ง่าย ขอให้สมาชิกทีมปฏิบัติตามกฎดังนี้:

---

## 🌿 1. การจัดการ Git
- **Branch Strategy**: ห้าม Push ลง `main` โดยตรง ให้ใช้ `feature/your-task`
- **Commit Messages**: เขียนให้ชัดเจน เช่น `feat: add deposit api validation` หรือ `fix: update s3 path`

---

## 🛠️ 2. มาตรฐานการเขียนโค้ด (Coding Standards)

### 🚀 **การเพิ่ม API เส้นใหม่**
ห้ามเขียน URL ในไฟล์เทส ให้ทำตามลำดับนี้:
1. จดทะเบียน URL ใน `lib/GlobalVars.js`
2. สร้าง Class ใน `lib/api/` เพื่อเก็บ Path และ Method
3. เรียกใช้ Class นั้นในไฟล์เทส `.spec.js`

### ✅ **การตรวจสอบข้อมูล (Assertion)**
ใช้ฟังก์ชันจาก `lib/Utils.js` เสมอ เพื่อให้การรายงานผลเป็นมาตรฐานเดียวกัน:
```javascript
const expected = { "status": "0000", "id": "mandatory" };
await utils.TestSuccess(expected, response);
```

### 📦 **การส่งค่าข้าม API**
ใช้ `pmGlobals` เพื่อจำลองพฤติกรรม Postman:
```javascript
pmGlobals.set('accountNo', body.accountNo);
```

---

## ⚠️ 3. ข้อควรระวัง
- **ห้ามแก้ไขไฟล์ Core**: `Utils.js`, `NotifyHelper.js`, `TestHelper.js` หากต้องการแก้ต้องปรึกษาทีมก่อน
- **Update ตลอดเวลา**: รัน `git pull origin main` ทุกเช้าเพื่อป้องกัน Code Conflict
