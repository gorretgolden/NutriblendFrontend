
const https = require('https');

function testBrowserLike() {
    const url = 'https://admin.rasmuspharmaceuticals.com/api/v1/products';
    console.log('Fetching:', url);
    
    https.get(url, {
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        }
    }, (res) => {
        console.log('Status:', res.statusCode);
        console.log('Content-Type:', res.headers['content-type']);
        
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                console.log('JSON:', json.data.length, 'items');
            } catch (e) {
                console.log('Not JSON. Start:', data.substring(0, 500));
            }
        });
    });
}

testBrowserLike();
