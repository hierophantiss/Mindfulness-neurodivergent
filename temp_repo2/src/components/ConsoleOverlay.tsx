import React, { useEffect, useState } from 'react';

export default function ConsoleOverlay() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const origWarn = console.warn;
    const origError = console.error;
    const origLog = console.log;

    console.warn = (...args) => {
      setLogs(l => [...l, 'WARN: ' + args.map(a => String(a)).join(' ')].slice(-10));
      origWarn(...args);
    };
    console.error = (...args) => {
      setLogs(l => [...l, 'ERR: ' + args.map(a => String(a)).join(' ')].slice(-10));
      origError(...args);
    };
    console.log = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('Ambient')) {
        setLogs(l => [...l, 'LOG: ' + args.map(a => String(a)).join(' ')].slice(-10));
      }
      origLog(...args);
    };

    return () => {
      console.warn = origWarn;
      console.error = origError;
      console.log = origLog;
    };
  }, []);

  if (logs.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 text-green-400 font-mono text-xs z-50 pointer-events-none">
      {logs.map((L, i) => <div key={i}>{L}</div>)}
    </div>
  );
}
