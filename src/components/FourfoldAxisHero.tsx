import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { MeditatorFigure } from './MeditatorFigure';

/**
 * The home page's picture: the meditator of the book cover with the four axes
 * (gravity, breath, attention, space). A picture, not a menu: nothing in it
 * takes you anywhere. Its one movement is the breath circle, at 5-5.
 */
export const FourfoldAxisHero: React.FC = () => {
  const { language } = useLanguage();
  return (
    <MeditatorFigure
      showAxisSymbols="all"
      animationMode="idle"
      withEarth
      label={language === 'en'
        ? 'The Fourfold Axis: Body, Breath, Attention, Space'
        : 'Ο Τετραπλός Άξονας: Σώμα, Αναπνοή, Προσοχή, Χώρος'}
    />
  );
};
