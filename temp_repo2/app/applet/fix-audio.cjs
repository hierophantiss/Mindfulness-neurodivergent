const fs = require('fs');
let code = fs.readFileSync('src/contexts/AudioContext.tsx', 'utf8');

const correctGetAbsoluteUrl = `  const getAbsoluteUrl = (src: string) => {
    if (!src) return '';
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      return src;
    }
    let origin = '';
    try {
      if (window.location.origin && window.location.origin !== 'null') {
        origin = window.location.origin;
      } else {
        const url = new URL(window.location.href);
        if (url.protocol.startsWith('http')) {
          origin = url.protocol + '//' + url.host;
        }
      }
    } catch (e) {
      console.warn('[Central Audio Engine] Safe origin resolution failed', e);
    }
    if (origin) {
      const sep = src.startsWith('/') ? '' : '/';
      return \`\${origin}\${sep}\${src}\`;
    }
    return src;
  };`;

// Find and replace the stubbed getAbsoluteUrl
code = code.replace(/const getAbsoluteUrl = [^;]+;/, correctGetAbsoluteUrl);

// Remove the crossOrigin requirement which causes CORS failure on same-origin without headers
code = code.replace(/audio\.crossOrigin = 'anonymous';/g, '');

fs.writeFileSync('src/contexts/AudioContext.tsx', code);
