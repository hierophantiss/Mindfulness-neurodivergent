import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { BREATH_PATTERNS } from '../data/breathPatterns';
import PracticeBreath from './PracticeBreath';
import GenericExercise from './GenericExercise';

// /practice/breath/:id is a breathing pattern when the id is one; otherwise
// it is a breath microdose or guided exercise (e.g. rhythm-5-5).
export default function BreathRoute() {
  const { id } = useParams();
  // "Delta" was removed: its sound lives on as "Sleep" in the Sanctuary.
  if (id === 'delta') return <Navigate to="/sanctuary?track=sleep-delta" replace />;
  // "Om Throat Resonance" was folded into A-U-M.
  if (id === 'om-resonance-throat') return <Navigate to="/practice/breath/aum-resonance" replace />;
  const isPattern = !id || BREATH_PATTERNS.some(p => p.id === id);
  return isPattern ? <PracticeBreath /> : <GenericExercise />;
}
