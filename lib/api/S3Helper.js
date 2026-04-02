const { S3Client, GetObjectCommand, HeadObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");

/**
 * S3Helper - ตัวช่วยจัดการตรวจสอบและอัปโหลดไฟล์บน AWS S3
 */
class S3Helper {
    constructor() {
        this.client = new S3Client({
            region: process.env.AWS_REGION || "ap-southeast-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });
    }

    /**
     * ตรวจสอบว่าไฟล์มีอยู่ใน S3 Bucket หรือไม่
     */
    async fileExists(bucket, key) {
        try {
            await this.client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
            return true;
        } catch (err) {
            if (err.name === "NotFound") return false;
            throw err;
        }
    }

    /**
     * ดึงเนื้อหาภายในไฟล์ออกมาเป็นข้อความ (String)
     */
    async getFileContent(bucket, key) {
        try {
            const response = await this.client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
            const content = await response.Body.transformToString();
            return content;
        } catch (err) {
            console.error(`Error reading file ${key} from ${bucket}:`, err);
            throw err;
        }
    }

    /**
     * อัปโหลดไฟล์ขึ้น S3
     * @param {string} bucket ชื่อ S3 Bucket
     * @param {string} key Path หรือชื่อไฟล์ที่จะบันทึกใน S3
     * @param {string|Buffer} content เนื้อหาไฟล์ที่ต้องการอัปโหลด
     * @param {string} contentType ประเภทไฟล์ (เช่น text/plain, application/json)
     */
    async uploadFile(bucket, key, content, contentType = "text/plain") {
        try {
            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: content,
                ContentType: contentType
            });
            await this.client.send(command);
            console.log(`Successfully uploaded file to ${bucket}/${key}`);
            return true;
        } catch (err) {
            console.error(`Error uploading file to ${bucket}/${key}:`, err);
            throw err;
        }
    }
}

module.exports = S3Helper;
