export function parseDSL(dslText: string) {
  const lines = dslText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  let title = '';
  let subject = '';
  let duration = '';
  let totalMarks = 0;
  
  const sections: any[] = [];
  let currentSection: any = null;

  for (const line of lines) {
    if (line.startsWith('PAPER_TITLE:')) {
      title = line.replace('PAPER_TITLE:', '').trim();
    } else if (line.startsWith('SUBJECT:')) {
      subject = line.replace('SUBJECT:', '').trim();
    } else if (line.startsWith('DURATION:')) {
      duration = line.replace('DURATION:', '').trim();
    } else if (line.startsWith('TOTAL_MARKS:')) {
      totalMarks = parseInt(line.replace('TOTAL_MARKS:', '').trim(), 10);
    } else if (line.startsWith('SECTION:')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: `Section ${line.replace('SECTION:', '').trim()}`,
        instruction: '',
        questions: []
      };
    } else if (line.startsWith('INSTRUCTION:')) {
      if (currentSection) {
        currentSection.instruction = line.replace('INSTRUCTION:', '').trim();
      }
    } else if (line.match(/^Q\d+\s*\|/i)) {
      // e.g. Q1 | easy | 2 | Text
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 4 && currentSection) {
        const qNumStr = parts[0].replace(/[^0-9]/g, '');
        const difficultyStr = parts[1].toLowerCase();
        
        // ensure valid difficulty
        const difficulty = ['easy', 'medium', 'hard'].includes(difficultyStr) ? difficultyStr : 'medium';
        const marks = parseInt(parts[2], 10) || 1;
        const text = parts.slice(3).join(' | ');

        currentSection.questions.push({
          questionNumber: parseInt(qNumStr, 10) || currentSection.questions.length + 1,
          difficulty,
          marks,
          text
        });
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  if (!title || !subject || sections.length === 0) {
    throw new Error('Failed to parse DSL: missing required fields or sections');
  }

  return {
    title,
    subject,
    duration: duration || '2 Hours',
    totalMarks: totalMarks || 0,
    sections
  };
}
