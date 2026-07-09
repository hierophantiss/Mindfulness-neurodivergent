import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { Axis } from '../data/types';
import { X } from 'lucide-react';
import { MeditatorFigure } from './MeditatorFigure';

export interface FourfoldAxisHeroProps {
  activeAxis?: Axis | 'focus' | null;
}

export const FourfoldAxisHero: React.FC<FourfoldAxisHeroProps> = ({ activeAxis = null }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const ariaLabel = language === 'el' ? 'Ο Τετραπλός Άξονας' : 'The Fourfold Axis';

  const [hoveredAxis, setHoveredAxis] = useState<Axis | 'focus' | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const currentAxis = hoveredAxis || activeAxis;

  const axisLabels: Record<string, { en: string; el: string }> = {
    body: { en: 'Gravity • Earth', el: 'Βαρύτητα • Γη' },
    breath: { en: 'Breath • Air', el: 'Αναπνοή • Αέρας' },
    attention: { en: 'Attention • Fire', el: 'Προσοχή • Φωτιά' },
    focus: { en: 'Attention • Fire', el: 'Προσοχή • Φωτιά' },
    space: { en: 'Space • Infinity', el: 'Χώρος • Άπειρο' }
  };

  const tokens = {
    body: '#d4b37f',
    breath: '#7ca7d6',
    attention: '#e89e6f',
    space: '#a78bfa'
  };

  // Read reduce-motion preference
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const checkMotion = () => {
      const stored = localStorage.getItem('n_mindfulness_reduce_motion');
      if (stored !== null) {
        setReduceMotion(stored === 'true');
        return;
      }
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReduceMotion(mediaQuery.matches);
    };
    checkMotion();
    window.addEventListener('storage', checkMotion);
    return () => window.removeEventListener('storage', checkMotion);
  }, []);

  const isSpaceActive = currentAxis === 'space';

  const getOpacity = (axisName: string) => {
    if (!currentAxis) return 0.45;
    return currentAxis === axisName ? 1 : 0.18;
  };

  const getAttentionOpacity = () => {
    if (!currentAxis) return 0.45;
    return (currentAxis === 'focus' || currentAxis === 'attention') ? 1 : 0.18;
  };

  const handleAxisClick = (axis: Axis) => {
    navigate(`/practice?axis=${axis}`);
  };

  return (
    <MeditatorFigure 
      showAxisSymbols="all"
      animationMode="idle"
      withEarth={true}
      hoveredAxis={hoveredAxis}
      activeAxis={activeAxis}
      onAxisHover={setHoveredAxis}
      onAxisClick={handleAxisClick}
    />
  );
};
