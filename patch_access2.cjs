const fs = require('fs');
let file = 'src/hooks/useAccessibility.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
`  const toggleReduceMotion = () => {
    setReduceMotion(prev => {
      const next = !prev;
      localStorage.setItem('n_mindfulness_reduce_motion', String(next));
      return next;
    });
  };

  return (`,
`  const toggleReduceMotion = () => {
    setReduceMotion(prev => {
      const next = !prev;
      localStorage.setItem('n_mindfulness_reduce_motion', String(next));
      return next;
    });
  };

  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reduceMotion]);

  return (`
);
fs.writeFileSync(file, content);
