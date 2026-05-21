import React, { useState, useEffect } from 'react';

export function DebugOverlay() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    const addLog = (level: string, args: any[]) => {
      const msg = args.map(a => {
        if (a instanceof Error) {
          return `${a.name}: ${a.message}`;
        }
        if (a && typeof a === 'object') {
          if ('message' in a && 'name' in a) {
            return `${(a as any).name}: ${(a as any).message}`;
          }
          try {
            return JSON.stringify(a);
          } catch (e) {
            return String(a);
          }
        }
        return String(a);
      }).join(' ');
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
    <div className="fixed top-0 left-0 w-full p-2 bg-black/50 text-emerald-400 text-[10px] z-[9999] pointer-events-none font-mono flex flex-col gap-1" style={{ maxHeight: '20vh', overflowY: 'auto' }}>
      {logs.map((log, i) => <div key={i}>{log}</div>)}
    </div>
  );
}