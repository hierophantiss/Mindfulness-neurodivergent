require('ts-node').register();
const { BREATH_PATTERNS } = require('./src/data/breathPatterns');
const found = BREATH_PATTERNS.find(p => p.id === 'sos-breath');
console.log(found ? 'FOUND' : 'NOT FOUND');
