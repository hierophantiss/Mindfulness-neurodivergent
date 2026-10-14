import React from 'react';
import { useParams } from 'react-router-dom';
import { BREATH_PATTERNS } from '../data/breathPatterns';
import PracticeBreath from './PracticeBreath';
import GenericExercise from './GenericExercise';

// /practice/breath/:id is a breathing pattern when the id is one; otherwise
// it is a breath microdose or guided exercise (e.g. rhythm-5-5).
export default function BreathRoute() {
  const { id } = useParams();
  const isPattern = !id || BREATH_PATTERNS.some(p => p.id === id);
  return isPattern ? <PracticeBreath /> : <GenericExercise />;
}
