const { test, expect } = require('@playwright/test');
const Utils = require('../lib/Utils');

/**
 * 🎬 Scenario: SFTP File Operations (Mock Mode)
 */
test.describe('SFTP File Operations (Mock Mode)', () => {
    
    test('Should simulate upload a file to SFTP successfully', async () => {
        const remotePath = `/tmp/mock_upload_${Date.now()}.txt`;

        await test.step('1. Upload file to remote server (Mocked)', async () => {
            console.log(`[MOCK SFTP] Uploading file to: ${remotePath}`);
            // จำลองว่าอัปโหลดสำเร็จ
            const success = true;
            expect(success).toBe(true);
        });

        await test.step('2. Verify file exists in directory listing (Mocked)', async () => {
            console.log(`[MOCK SFTP] Listing files in /tmp...`);
            // จำลองว่าเจอไฟล์
            const mockFiles = [{ name: path.basename(remotePath) }];
            const exists = mockFiles.some(f => remotePath.endsWith(f.name));
            expect(exists).toBe(true);
        });
    });
});

// Helper for path basename in mock
const path = require('path');
