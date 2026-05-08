
const https = require('https');

function listCategories() {
    const url = 'https://admin.rasmuspharmaceuticals.com/api/v1/categories';
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
                console.log('Categories:', json.data.map(c => ({ id: c.id, name: c.name, slug: c.slug, is_active: c.is_active })));
            } catch (e) {
                console.log('Not JSON');
            }
        });
    });
}

listCategories();
