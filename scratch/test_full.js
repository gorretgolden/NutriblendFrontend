
const https = require('https');

function testFullBody() {
    const url = 'https://admin.rasmuspharmaceuticals.com/api/v1/products';
    console.log('Fetching:', url);
    
    https.get(url, {
        headers: {
            'Accept': 'application/json'
        }
    }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            console.log('Length:', data.length);
            console.log('Last 100 chars:', data.substring(data.length - 100));
            try {
                JSON.parse(data);
                console.log('Valid JSON');
            } catch (e) {
                console.log('Invalid JSON:', e.message);
            }
        });
    });
}

testFullBody();
