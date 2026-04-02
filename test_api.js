const fetch = require('node-fetch');

async function test() {
  const res = await fetch('http://127.0.0.1:8000/api/v1/products?category_slug=mens-sexual-health');
  const text = await res.text();
  console.log('Status:', res.status);
  try {
    const json = JSON.parse(text);
    console.log('Success:', json.success);
    console.log('Data length:', json.data.length || json.data.data.length);
  } catch(e) {
    console.log('Response body:', text);
  }
}
test();
