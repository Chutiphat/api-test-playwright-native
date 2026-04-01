const crypto = require('crypto');

class TestHelper {
    /**
     * สร้าง UUID และ Trace Parent สำหรับ API Headers
     * เลียนแบบการทำงานของ uuidgen และ openssl rand -hex 8 ใน Shell Script
     */
    static generateApiHeaders() {
        // สร้าง UUID v4
        const guidValue = crypto.randomUUID();
        const requestId = `${guidValue}-reqid`;
        
        // สร้าง Trace ID แบบสุ่ม 16 ตัวอักษร (8 bytes hex)
        const tracePart = crypto.randomBytes(8).toString('hex');
        const traceParent = `00-dddddd1916cad43d8448eb211c80319c-${tracePart}-01`;
        
        return { requestId, traceParent };
    }

    /**
     * ตัวอย่างฟังก์ชันอื่นๆ ที่อาจต้องใช้บ่อย เช่น การสร้างวันที่ปัจจุบันใน Format ที่ API ต้องการ
     */
    static getRequestDateTime() {
        const now = new Date();
        const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const time = now.toTimeString().split(' ')[0] + '+07:00'; // HH:mm:ss+07:00
        return { date, time };
    }
}

module.exports = TestHelper;
