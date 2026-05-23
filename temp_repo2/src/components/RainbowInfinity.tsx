import { Infinity as InfinityIcon } from 'lucide-react';

export function RainbowInfinity({ className = "", size = 24 }: { className?: string; size?: number | string }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop stopColor="#ef4444" offset="0%" />   {/* red-500 */}
            <stop stopColor="#f59e0b" offset="25%" />  {/* amber-500 */}
            <stop stopColor="#10b981" offset="50%" />  {/* emerald-500 */}
            <stop stopColor="#3b82f6" offset="75%" />  {/* blue-500 */}
            <stop stopColor="#a855f7" offset="100%" /> {/* purple-500 */}
          </linearGradient>
        </defs>
      </svg>
      <InfinityIcon size={size} stroke="url(#rainbow-gradient)" strokeWidth={3} />
    </div>
  );
}
