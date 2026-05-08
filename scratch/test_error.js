
const https = require('https');

function testError() {
    const url = 'https://admin.rasmuspharmaceuticals.com/api/v1/non-existent';
    console.log('Fetching:', url);
    
    https.get(url, {
        headers: {
            'Accept': 'application/json'
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

testError();
