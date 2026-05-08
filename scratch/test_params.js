
const https = require('https');

function testProductsWithParams() {
    const url = 'https://admin.rasmuspharmaceuticals.com/api/v1/products?page=1&per_page=24&sort=created_at';
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
                console.log('JSON:', json.data.data.length, 'items');
            } catch (e) {
                console.log('Not JSON. Start:', data.substring(0, 500));
            }
        });
    });
}

testProductsWithParams();
