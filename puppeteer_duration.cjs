const puppeteer = require('puppeteer');
const express = require('express');

const app = express();
app.use(express.static('public'));
const server = app.listen(3002, async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const fs = require('fs');
  const files = fs.readdirSync('public').filter(f => f.endsWith('.mp4'));
  
  for (const file of files) {
    try {
      await page.goto(`http://localhost:3002`);
      const res = await page.evaluate(async (vidSrc) => {
        return new Promise((resolve) => {
          const video = document.createElement('video');
          video.src = vidSrc;
          video.onloadedmetadata = () => resolve(video.duration);
          video.onerror = (e) => resolve('error: ' + video.error.code + ' ' + video.error.message);
        });
      }, file);
      console.log(`${file}: ${res}s`);
    } catch(e) {
      console.log(`${file}: puppeteer error`);
    }
  }
  
  await browser.close();
  server.close();
});
