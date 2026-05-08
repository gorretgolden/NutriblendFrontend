
const https = require('https');

function testApi() {
    const url = 'https://admin.rasmuspharmaceuticals.com/api/v1/categories/clive-dorris';
    console.log('Fetching:', url);
    
    https.get(url, {
        headers: {
            'Accept': 'application/json'
        }
    }, (res) => {
        console.log('Status:', res.statusCode);
        console.log('Content-Type:', res.headers['content-type']);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                console.log('JSON Response:', JSON.stringify(json, null, 2));
            } catch (e) {
                console.log('Not JSON. First 200 chars:', data.substring(0, 200));
            }
        });
    }).on('error', (err) => {
        console.error('Fetch error:', err);
    });
}

testApi();
