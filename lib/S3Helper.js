const { S3Client, GetObjectCommand, HeadObjectCommand, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

/**
 * S3Helper - ตัวช่วยจัดการตรวจสอบ อัปโหลด และลบไฟล์บน AWS S3
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
            if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) return false;
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
            console.log(`[S3] Uploaded: ${bucket}/${key}`);
            return true;
        } catch (err) {
            console.error(`[S3] Upload Error: ${bucket}/${key}:`, err);
            throw err;
        }
    }

    /**
     * ลบไฟล์ออกจาก S3
     * @param {string} bucket ชื่อ S3 Bucket
     * @param {string} key Path หรือชื่อไฟล์ที่จะลบ
     */
    async deleteFile(bucket, key) {
        try {
            const command = new DeleteObjectCommand({
                Bucket: bucket,
                Key: key
            });
            await this.client.send(command);
            console.log(`[S3] Deleted: ${bucket}/${key}`);
            return true;
        } catch (err) {
            // ถ้าไม่เจอไฟล์ที่จะลบ ก็ให้ถือว่าสำเร็จ (Cleanup ไปแล้ว)
            if (err.name === "NotFound") return true;
            console.error(`[S3] Delete Error: ${bucket}/${key}:`, err);
            return false;
        }
    }
}

module.exports = S3Helper;
