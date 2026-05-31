const fs = require('fs');
let content = fs.readFileSync('src/components/NavigationMenu.tsx', 'utf8');
const search = `                                  showToast(language === 'en' ? 'Data imported successfully!' : 'Τα δεδομένα εισήχθη                    <div className=\"w-full h-px bg-white/5 my-1\"></div>\n\n                    <div className=\"transition-all duration-300\">\n                      {!showResetConfirm ? (                   window.location.href = '#/onboarding';\n                         window.location.reload();\n                       }}\n                       className=\"px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors\"\n                     >\n                       {language === 'en' ? 'Update' : 'Αλλαγή'}\n                      </button>\n                    </div>\n\n                    <div className=\"w-full h-px bg-white/5 my-1\"></div>\n\n                    <div className=\"transition-all duration-300\">\n                      {!showResetConfirm ? (`.replace(/\\r/g, '');


const replacement = `                                  showToast(language === 'en' ? 'Data imported successfully!' : 'Τα δεδομένα εισήχθησαν!');
                                  setTimeout(() => window.location.reload(), 1500);
                                } catch(err) {
                                  showToast(language === 'en' ? 'Invalid backup file' : 'Άκυρο αρχείο αντιγράφου');
                                }
                              };
                              reader.readAsText(file);
                            }} 
                          />
                        </label>
                      </div>
                   </div>
                 </div>

                    <div className="w-full h-px bg-white/5 my-1"></div>

                    <div className="transition-all duration-300">
                      {!showResetConfirm ? (`.replace(/\\r/g, '');

content = content.replace(/\\r/g, '');
if(content.includes(search)) {
  fs.writeFileSync('src/components/NavigationMenu.tsx', content.replace(search, replacement));
  console.log('Fixed exactly');
} else {
  // Let's do a more robust string manipulation
  const startIdx = content.indexOf(`showToast(language === 'en' ? 'Data imported successfully!' : 'Τα δεδομένα εισήχθη`);
  const endIdx = content.indexOf(`{!showResetConfirm ? (`, startIdx + 100);
  if (startIdx > -1 && endIdx > -1) {
    const fixed = content.substring(0, startIdx) + replacement.substring(0, replacement.length - 28) + content.substring(endIdx);
    fs.writeFileSync('src/components/NavigationMenu.tsx', fixed);
    console.log('Fixed robustly');
  } else {
    console.log('Could not find indices', startIdx, endIdx);
  }
}
