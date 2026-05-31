const fs = require('fs');
let content = fs.readFileSync('src/components/NavigationMenu.tsx', 'utf8');

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

const startIdx = content.indexOf(`showToast(language === 'en' ? 'Data imported successfully!' : 'Τα δεδομένα εισήχθη`);
const endIdx = content.indexOf(`{!showResetConfirm ? (`, startIdx + 100);
if (startIdx > -1 && endIdx > -1) {
  const fixed = content.substring(0, startIdx) + replacement.substring(0, replacement.length - 24) + content.substring(endIdx);
  fs.writeFileSync('src/components/NavigationMenu.tsx', fixed);
  console.log('Fixed robustly');
} else {
  console.log('Could not find indices', startIdx, endIdx);
}
