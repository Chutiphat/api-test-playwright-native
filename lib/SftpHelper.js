const Client = require('ssh2-sftp-client');

/**
 * SftpHelper - Utility class for SFTP operations.
 * Supports connecting via Password or Private Key.
 */
class SftpHelper {
    constructor() {
        this.sftp = new Client();
        this.config = {
            host: process.env.SFTP_HOST,
            port: parseInt(process.env.SFTP_PORT || '22'),
            username: process.env.SFTP_USER,
            password: process.env.SFTP_PASSWORD,
            // If using Private Key, uncomment and set path in .env
            // privateKey: process.env.SFTP_PRIVATE_KEY_PATH ? require('fs').readFileSync(process.env.SFTP_PRIVATE_KEY_PATH) : undefined
        };
    }

    /**
     * Uploads content to a remote SFTP path.
     * @param {string|Buffer} content - The file content.
     * @param {string} remotePath - The full path on the SFTP server.
     */
    async uploadFile(content, remotePath) {
        try {
            await this.sftp.connect(this.config);
            console.log(`[SFTP] Uploading file to: ${remotePath}`);
            await this.sftp.put(Buffer.from(content), remotePath);
            console.log(`[SFTP] Successfully uploaded.`);
            return true;
        } catch (err) {
            console.error(`[SFTP] Upload Error at ${remotePath}:`, err.message);
            throw err;
        } finally {
            await this.sftp.end();
        }
    }

    /**
     * Deletes a file from the SFTP server.
     * @param {string} remotePath 
     */
    async deleteFile(remotePath) {
        try {
            await this.sftp.connect(this.config);
            console.log(`[SFTP] Deleting file: ${remotePath}`);
            await this.sftp.delete(remotePath);
            return true;
        } catch (err) {
            console.error(`[SFTP] Delete Error at ${remotePath}:`, err.message);
            return false;
        } finally {
            await this.sftp.end();
        }
    }

    /**
     * Lists files in a remote directory.
     * @param {string} remoteDir 
     */
    async listFiles(remoteDir) {
        try {
            await this.sftp.connect(this.config);
            return await this.sftp.list(remoteDir);
        } catch (err) {
            console.error(`[SFTP] List Error at ${remoteDir}:`, err.message);
            throw err;
        } finally {
            await this.sftp.end();
        }
    }
}

module.exports = SftpHelper;
