import { NextResponse } from 'next/server';
import { PineconeClient } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

export async function POST(req) {
  const { query, subject, minRating } = await req.json();

  try {
  
    const pinecone = new PineconeClient({ apiKey: process.env.PINECONE_API_KEY });
    const index = pinecone.Index('rag');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query,
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
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
