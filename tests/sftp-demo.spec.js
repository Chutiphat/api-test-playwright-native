const { test, expect } = require('@playwright/test');
const SftpHelper = require('../lib/SftpHelper');

/**
 * 🎬 Scenario: SFTP File Operations
 * Tests uploading and verifying files on a remote SFTP server.
 */
test.describe('SFTP File Operations @sftp', () => {
    const sftp = new SftpHelper();
    const remotePath = `/tmp/test_upload_${Date.now()}.txt`;

    // 🧹 Cleanup after test
    test.afterEach(async () => {
        await sftp.deleteFile(remotePath);
    });

    test('Should upload a file to SFTP successfully', async () => {
        const content = 'id,name,status\n1,TestUser,Active';

        await test.step('1. Upload file to remote server', async () => {
            const success = await sftp.uploadFile(content, remotePath);
            expect(success).toBe(true);
        });

        await test.step('2. Verify file exists in directory listing', async () => {
            const list = await sftp.listFiles('/tmp');
            const fileExists = list.some(f => remotePath.endsWith(f.name));
            expect(fileExists).toBe(true);
        });
    });
});
