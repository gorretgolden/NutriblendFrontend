const https = require('https');

// Test orders endpoint without auth (should get 401, not 500)
const url = 'https://admin.rasmuspharmaceuticals.com/api/v1/orders';
console.log('Testing:', url);

const req = https.get(url, {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
}, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Content-Type:', res.headers['content-type']);
        console.log('Body:', data.substring(0, 500));
    });
});
req.on('error', (e) => console.error('Error:', e.message));
