
const https = require('https');

function testWithAuth() {
    const url = 'https://admin.rasmuspharmaceuticals.com/api/v1/products';
    console.log('Fetching:', url);
    
    https.get(url, {
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer 1234567890'
        }
    }, (res) => {
        console.log('Status:', res.statusCode);
        console.log('Content-Type:', res.headers['content-type']);
        
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                console.log('JSON:', JSON.stringify(json, null, 2));
            } catch (e) {
                console.log('Not JSON. Start:', data.substring(0, 500));
            }
        });
    });
}

testWithAuth();
