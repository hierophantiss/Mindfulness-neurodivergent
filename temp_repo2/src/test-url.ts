import https from 'https';

https.get('https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Cat%20face/3D/cat_face_3d.png', (res) => {
  console.log(`STATUS: ${res.statusCode}`);
}).on('error', (e) => {
  console.error(`ERROR: ${e.message}`);
});
