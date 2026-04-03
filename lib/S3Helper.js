const { S3Client, GetObjectCommand, HeadObjectCommand, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

/**
 * S3Helper - Utility class for AWS S3 operations (Upload, Check, Read, Delete).
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
     * Checks if a file exists in the S3 bucket.
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
     * Reads file content as a string.
     */
    async getFileContent(bucket, key) {
        try {
            const response = await this.client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
            return await response.Body.transformToString();
        } catch (err) {
            console.error(`[S3] Error reading file ${key} from ${bucket}:`, err.message);
            throw err;
        }
    }

    /**
     * Uploads content to S3.
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
            console.log(`[S3] Successfully uploaded: ${bucket}/${key}`);
            return true;
        } catch (err) {
            console.error(`[S3] Upload error for ${bucket}/${key}:`, err.message);
            throw err;
        }
    }

    /**
     * Deletes a file from S3.
     */
    async deleteFile(bucket, key) {
        try {
            await this.client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
            console.log(`[S3] Successfully deleted: ${bucket}/${key}`);
            return true;
        } catch (err) {
            if (err.name === "NotFound") return true;
            console.error(`[S3] Delete error for ${bucket}/${key}:`, err.message);
            return false;
        }
    }
}

module.exports = S3Helper;
