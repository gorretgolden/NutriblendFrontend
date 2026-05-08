
const https = require('https');

function testProducts() {
    const url = 'https://admin.rasmuspharmaceuticals.com/api/v1/products';
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
                console.log('Products:', json.data.length, 'items');
            } catch (e) {
                console.log('Not JSON. Start:', data.substring(0, 500));
            }
        });
    }).on('error', (err) => {
        console.error('Fetch error:', err);
    });
}

testProducts();
