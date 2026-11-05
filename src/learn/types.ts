export type LearnCard = {
  name: string;
  oneLiner: string;
  intuition: string;
  realWorld: string[];
  whenToUse: string;
  whenNotTo: string;
  complexity: {
    best: string;
    avg: string;
    worst: string;
    space: string;
    stable?: string;
    optimal?: string;
    complete?: string;
  };
  watchFor: string;
  predictQuestion: { question: string; options: string[]; answer: string; why: string };
  misconception: { myth: string; correction: string };
};
