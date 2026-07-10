import { companionArticleIndex, AxisType, CompanionArticle } from '../data/companionArticleIndex';

export interface SuggestionOptions {
  axis?: AxisType | null;
  query?: string;
  language: 'en' | 'el';
  max?: number;
}

export function suggestArticles(options: SuggestionOptions): CompanionArticle[] {
  const { axis, query, language, max = 3 } = options;
  
  let candidates = [...companionArticleIndex];
  
  const lowerQuery = query ? query.toLowerCase() : '';
  
  // Simple keyword matching
  const stopWords = ['i', 'want', 'to', 'read', 'article', 'articles', 'suggest', 'me', 'about', 
                     'what', 'how', 'where', 'can', 'learn', 'study',
                     'θέλω', 'να', 'διαβάσω', 'άρθρο', 'άρθρα', 'πρότεινε', 'προτείνε', 'μου', 'για', 'ένα', 
                     'τι', 'πως', 'που', 'μπορώ', 'μάθω', 'δω'];
  
  const keywords = lowerQuery
    .replace(/[^\w\s\u0370-\u03ff\u1f00-\u1fff]/g, '') // strip punctuation keeping greek
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.includes(w));
  
  candidates.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    
    if (axis) {
      if (a.axis === axis) scoreA += 10;
      if (b.axis === axis) scoreB += 10;
    }
    
    if (keywords.length > 0) {
      const textA = (a.title[language] + ' ' + a.summary[language]).toLowerCase();
      const textB = (b.title[language] + ' ' + b.summary[language]).toLowerCase();
      
      keywords.forEach(kw => {
        if (textA.includes(kw)) scoreA += 5;
        if (textB.includes(kw)) scoreB += 5;
      });
    }
    
    // Fallback to deterministic sorting if scores are equal
    if (scoreA !== scoreB) {
      return scoreB - scoreA; // highest score first
    }
    return a.id.localeCompare(b.id);
  });
  
  return candidates.slice(0, max);
}
