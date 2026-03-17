export async function extractTextFromPDF(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const text = new TextDecoder('utf-8').decode(buffer);
  const cleaned = text
    .replace(/[^a-zA-Z0-9\s.,?!;:()'"-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned;
}

export function chunkText(text: string, chunkSize: number = 1000): string[] {
  const words = text.split(' ');
  const chunks: string[] = [];
  let current: string[] = [];
  let currentLength = 0;

  for (const word of words) {
    current.push(word);
    currentLength += word.length + 1;
    if (currentLength >= chunkSize) {
      chunks.push(current.join(' '));
      current = [];
      currentLength = 0;
    }
  }
  if (current.length > 0) {
    chunks.push(current.join(' '));
  }
  return chunks;
}

export function searchChunks(chunks: string[], query: string): string {
  const keywords = query.split(/\s+/).filter((w) => w.length > 3);

  if (keywords.length === 0) {
    return 'Could you please provide more specific keywords so I can search the document effectively?';
  }

  const scored = chunks.map((chunk) => {
    const lower = chunk.toLowerCase();
    const score = keywords.filter((kw) => lower.includes(kw.toLowerCase())).length;
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  if (best.score > 0) {
    return `Based on your document, I found this relevant passage:\n\n> "...${best.chunk}..."\n\n*Does this answer your question?*`;
  }

  return "I couldn't find any specific information regarding that in the uploaded document. Could you try rephrasing?";
}
