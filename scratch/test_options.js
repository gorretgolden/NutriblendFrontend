
const https = require('https');

function testOptions() {
    const url = 'https://admin.rasmuspharmaceuticals.com/api/v1/products';
    console.log('Fetching OPTIONS:', url);
    
    const req = https.request(url, {
        method: 'OPTIONS',
        headers: {
            'Origin': 'https://www.rasmuspharmaceuticals.com',
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'authorization,accept,content-type'
        }
    }, (res) => {
        console.log('Status:', res.statusCode);
        console.log('Access-Control-Allow-Origin:', res.headers['access-control-allow-origin']);
        console.log('Access-Control-Allow-Methods:', res.headers['access-control-allow-methods']);
        console.log('Access-Control-Allow-Headers:', res.headers['access-control-allow-headers']);
        res.resume();
    });
    req.end();
}

testOptions();
