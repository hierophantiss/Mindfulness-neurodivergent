import React, { useState, useEffect } from 'react';

export function DebugOverlay() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    const addLog = (level: string, args: any[]) => {
      const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
      setLogs(prev => [...prev.slice(-9), `[${level}] ${msg}`]);
    };

    console.log = (...args) => {
      addLog('LOG', args);
      originalLog(...args);
    };
    console.warn = (...args) => {
      addLog('WARN', args);
      originalWarn(...args);
    };
    console.error = (...args) => {
      addLog('ERROR', args);
      originalError(...args);
    };

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  if (logs.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 w-full p-2 bg-black/80 text-green-400 text-xs z-[9999] pointer-events-none font-mono flex flex-col gap-1" style={{ maxHeight: '30vh', overflowY: 'auto' }}>
      {logs.map((log, i) => <div key={i}>{log}</div>)}
    </div>
  );
}
