import React, { useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { CHAPTERS_DATA } from '../data/chapters';
import { D as courseEL } from '../data/course-el';
import { D as courseEN } from '../data/course-en';

export default function PrintWorkbook() {
  const { language } = useLanguage();
  const theory = CHAPTERS_DATA[language];
  const course = language === 'el' ? courseEL : courseEN;

  useEffect(() => {
    // Wait for fonts to load before printing
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white text-black min-h-screen font-serif" style={{ backgroundColor: 'white', color: 'black' }}>
      
      {/* Cover Page */}
      <div className="h-screen flex flex-col justify-center items-center text-center p-8 break-after-page">
        <h1 className="text-5xl font-bold mb-4">
          {language === 'el' ? 'Εγχειρίδιο Παρουσίας' : 'Manual of Presence'}
        </h1>
        <h2 className="text-2xl text-gray-600 mb-12">
          {language === 'el' ? 'Awareness Gateway • Πρακτικός Οδηγός' : 'Awareness Gateway • Practical Guide'}
        </h2>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          {language === 'el' 
            ? 'Αυτό το βιβλίο συγκεντρώνει όλη τη θεωρία και το πρόγραμμα των 10 εβδομάδων για εκτύπωση και προσωπική μελέτη.' 
            : 'This workbook compiles all the theory and the 10-week program for printing and personal study.'}
        </p>
      </div>

      <div className="max-w-4xl mx-auto p-8 lg:p-12">
        {/* Theory Section */}
        <div className="break-after-page">
          <h2 className="text-4xl font-bold border-b-2 border-black pb-4 mb-8">
            {language === 'el' ? 'Μέρος 1ο: Οι 4 Άξονες' : 'Part 1: The 4 Axes'}
          </h2>
          {theory.map((chapter) => (
            <div key={chapter.num} className="mb-12 break-inside-avoid">
              <h3 className="text-3xl font-bold mb-2">{chapter.num}. {chapter.title}</h3>
              <p className="text-xl text-gray-600 italic mb-6">{chapter.sub}</p>
              
              {chapter.theorySections?.map((section, idx) => (
                <div key={idx} className="mb-6">
                  <h4 className="text-xl font-bold mb-3">{section.title}</h4>
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="mb-3 leading-relaxed text-gray-800">{p}</p>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Practical Course Section */}
        <div>
          <h2 className="text-4xl font-bold border-b-2 border-black pb-4 mb-8 break-before-page">
            {language === 'el' ? 'Μέρος 2ο: Το Πρόγραμμα' : 'Part 2: The Program'}
          </h2>
          
          {Object.entries(course).map(([weekNum, weekData]: [string, any]) => (
            <div key={weekNum} className="mb-16 break-before-page">
              <h3 className="text-3xl font-bold mb-8 text-center bg-gray-100 p-4 rounded-lg">
                {language === 'el' ? 'Εβδομάδα' : 'Week'} {weekNum}: {weekData.title}
              </h3>

              {weekData.days.map((day: any, idx: number) => (
                <div key={idx} className="mb-12 border-2 border-gray-200 rounded-xl p-6 break-inside-avoid shadow-sm">
                  <div className="flex justify-between items-end border-b pb-4 mb-6">
                    <h4 className="text-2xl font-bold">
                      {language === 'el' ? 'Ημέρα' : 'Day'} {idx + 1}: {day.title}
                    </h4>
                    <span className="text-sm text-gray-500 font-mono">
                      {day.dur} | {day.where}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Lesson and Breathing */}
                    <div>
                      <div className="mb-6">
                        <h5 className="font-bold text-gray-500 uppercase tracking-wider text-sm mb-2">
                          {language === 'el' ? 'Θεωρια' : 'Theory'}
                        </h5>
                        <div 
                          className="prose prose-sm text-gray-800 leading-relaxed" 
                          dangerouslySetInnerHTML={{ __html: day.lesson }} 
                        />
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-bold text-blue-900 uppercase tracking-wider text-sm mb-2">
                          {language === 'el' ? 'Αναπνοη' : 'Breathing'}
                        </h5>
                        <div 
                          className="prose prose-sm text-blue-800" 
                          dangerouslySetInnerHTML={{ __html: day.breathing }} 
                        />
                      </div>
                    </div>

                    {/* Right Column: Exercise and Reflection */}
                    <div>
                      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-6 font-sans">
                        <h5 className="font-bold text-gray-900 mb-3 text-lg flex items-center">
                          <span className="mr-2">📝</span> {day.exercise.title}
                        </h5>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                          {day.exercise.steps.map((step: string, sIdx: number) => (
                            <li key={sIdx}>{step}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                        <h5 className="font-bold text-green-900 uppercase tracking-wider text-sm mb-2">
                          {language === 'el' ? 'Αναστοχασμος / Insight' : 'Reflection / Insight'}
                        </h5>
                        <p className="font-medium text-green-800 italic mb-3">"{day.reflection}"</p>
                        <p className="text-sm text-green-700">{day.insight}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
