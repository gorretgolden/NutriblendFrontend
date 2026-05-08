
const https = require('https');

function testRedirect() {
    const url = 'https://admin.rasmuspharmaceuticals.com/api/v1/products';
    console.log('Fetching:', url);
    
    const req = https.get(url, {
        headers: {
            'Accept': 'application/json'
        },
        followRedirect: false
    }, (res) => {
        console.log('Status:', res.statusCode);
        console.log('Location:', res.headers.location);
        console.log('Content-Type:', res.headers['content-type']);
        res.resume();
    });
}

testRedirect();
