
const https = require('https');

function testProduct() {
    const url = 'https://admin.rasmuspharmaceuticals.com/api/v1/products/82';
    console.log('Fetching:', url);
    
    https.get(url, {
        headers: {
            'Accept': 'application/json'
        }
    }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                console.log('Product 82:', JSON.stringify(json, null, 2));
            } catch (e) {
                console.log('Not JSON. Start:', data.substring(0, 200));
            }
        });
    });
}

testProduct();
