/**
 * @module     AI Service
 * @author     Bethmi Jayamila <bethmij@gmail.com>
 * @description This file is part of the AI Damage Detection service of FleetGuard AI.
 *              Developed and trained by Bethmi Jayamila.
 * @date       2026-02-26
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

async function testBatch() {
    const testImg = path.join(__dirname, 'test-img.jpg');
    if (!fs.existsSync(testImg)) {
        // Create dummy file if missing
        fs.writeFileSync(testImg, 'dummy');
    }
    const fileBuf = fs.readFileSync(testImg);
    const boundary = '----FormBoundary' + Date.now();

    // Append 'images' twice to simulate batch of multiple photos
    const body = [
        `--${boundary}`,
        'Content-Disposition: form-data; name="images"; filename="test1.jpg"',
        'Content-Type: image/jpeg',
        '',
        fileBuf.toString('binary'),
        `--${boundary}`,
        'Content-Disposition: form-data; name="images"; filename="test2.jpg"',
        'Content-Type: image/jpeg',
        '',
        fileBuf.toString('binary'),
        `--${boundary}`,
        'Content-Disposition: form-data; name="inspection_id"',
        '',
        'batch-verify-123',
        `--${boundary}--`,
    ].join('\r\n');

    const req = http.request(
        {
            hostname: 'localhost',
            port: 5001,
            path: '/api/detect',
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': Buffer.byteLength(body, 'binary'),
            },
        },
        (res) => {
            let data = '';
            res.on('data', (c) => (data += c));
            res.on('end', () => {
                console.log("\n--- Batch Test Response ---");
                console.log(data);
                process.exit(0);
            });
        }
    );
    req.write(body, 'binary');
    req.end();
}

testBatch();
