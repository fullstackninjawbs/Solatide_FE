fetch('http://localhost:5001/api/admin/product/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ images: [{ url: 'test_image', alt: 'test' }] })
}).then(res => res.json()).then(console.log);
