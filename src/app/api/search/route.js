import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

export async function POST(req) {
  const { query, subject, minRating } = await req.json();


  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const index = pc.index('rag').namespace('ns1');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
    encoding_format: 'float',
  });
  const queryEmbedding = embeddingResponse.data[0].embedding;

  const searchResults = await index.query({
    topK: 10, 
    includeMetadata: true,
    vector: queryEmbedding,
  });


  const filteredResults = searchResults.matches.filter((match) => {
    const matchRating = parseFloat(match.metadata.stars);
    const matchSubject = match.metadata.subject.toLowerCase();
    return (
      (!subject || matchSubject.includes(subject.toLowerCase())) &&
      (!minRating || matchRating >= minRating)
    );
  });


  const responseResults = filteredResults.map((match) => ({
    professor: match.id,
    review: match.metadata.review,
    subject: match.metadata.subject,
    stars: match.metadata.stars,
  }));

  return NextResponse.json({ results: responseResults });
}
