const fs = require('fs');
let code = fs.readFileSync('src/pages/Practice.tsx', 'utf8');

// The main cards:
code = code.replace(/<button\s+onClick=\{\(\) => setActiveCategory\('grounding'\)\}\s+className="/g, '<div\n          onClick={() => setActiveCategory(\'grounding\')}\n          role="button"\n          tabIndex={0}\n          onKeyDown={(e) => e.key === \'Enter\' && setActiveCategory(\'grounding\')}\n          className="');

code = code.replace(/<button\s+onClick=\{\(\) => setActiveCategory\('breath'\)\}\s+className="/g, '<div\n          onClick={() => setActiveCategory(\'breath\')}\n          role="button"\n          tabIndex={0}\n          onKeyDown={(e) => e.key === \'Enter\' && setActiveCategory(\'breath\')}\n          className="');

code = code.replace(/<button\s+onClick=\{\(\) => setActiveCategory\('movement'\)\}\s+className="/g, '<div\n          onClick={() => setActiveCategory(\'movement\')}\n          role="button"\n          tabIndex={0}\n          onKeyDown={(e) => e.key === \'Enter\' && setActiveCategory(\'movement\')}\n          className="');

code = code.replace(/<button\s+onClick=\{\(\) => setActiveCategory\('swaying'\)\}\s+className="/g, '<div\n          onClick={() => setActiveCategory(\'swaying\')}\n          role="button"\n          tabIndex={0}\n          onKeyDown={(e) => e.key === \'Enter\' && setActiveCategory(\'swaying\')}\n          className="');

code = code.replace(/<button\s+onClick=\{\(\) => setActiveCategory\('microdoses'\)\}\s+className="/g, '<div\n          onClick={() => setActiveCategory(\'microdoses\')}\n          role="button"\n          tabIndex={0}\n          onKeyDown={(e) => e.key === \'Enter\' && setActiveCategory(\'microdoses\')}\n          className="');

// Fix the closing tags for these specific cards. There are exactly 5 </div>s we need to use instead of </button>.
// Let's just do a careful string replace based on `</button>` matching the end of the cards that contain them.

// To make it easy, we can search for the end of the card, like:
//             </div>
//           </div>
//         </button>

code = code.replaceAll('            </div>\n          </div>\n        </button>', '            </div>\n          </div>\n        </div>');

// There are also the buttons that navigate directly:
code = code.replace(/<button\s+onClick=\{\(\) => navigate\('\/practice\/swaying'\)\}\s+className=\{cn\(/g, '<div\n              role="button" tabIndex={0}\n              onClick={() => navigate(\'/practice/swaying\')}\n              className={cn(');

code = code.replace(/<button\s+onClick=\{\(\) => navigate\('\/practice\/microdoses'\)\}\s+className=\{cn\(/g, '<div\n              role="button" tabIndex={0}\n              onClick={() => navigate(\'/practice/microdoses\')}\n              className={cn(');

// Actually, in an earlier grep, navigating to /practice/swaying had a closing tag right after it. Let's see the context:
//           <div className="grid grid-cols-1 gap-6">
//             <button
//               onClick={() => navigate('/practice/swaying')}
// ...
//             </button>
// For those, replacing <button ...> with <div ...> means we also need to replace the </button>.

fs.writeFileSync('fix_divs.cjs', code);
