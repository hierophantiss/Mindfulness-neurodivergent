/** A term of the method, as the book's glossary gives it. */
export interface GlossaryTerm {
  /** Its anchor on the Glossary page (#…). */
  id: string;
  term: string;
  /** Where it first appears, as the book writes it ("Κεφ. 3", "Introduction"). */
  where: string;
  /** The chapters named there, to link to. */
  chapters: number[];
  definition: string;
}

export interface Glossary {
  /** The book's line above the terms. */
  intro: string;
  terms: GlossaryTerm[];
}
