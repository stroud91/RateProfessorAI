import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

export async function POST(req) {
  const { query, subject, minRating } = await req.json();

  // Initialize Pinecone and OpenAI
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const index = pc.index('rag').namespace('ns1');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Generate an embedding for the search query
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
    encoding_format: 'float',
  });
  const queryEmbedding = embeddingResponse.data[0].embedding;

  // Search Pinecone for relevant professors
  const searchResults = await index.query({
    topK: 10,  // Adjust as needed
    includeMetadata: true,
    vector: queryEmbedding,
  });

  // Filter the results based on the user's criteria
  const filteredResults = searchResults.matches.filter((match) => {
    const matchRating = parseFloat(match.metadata.stars);
    const matchSubject = match.metadata.subject.toLowerCase();
    return (
      (!subject || matchSubject.includes(subject.toLowerCase())) &&
      (!minRating || matchRating >= minRating)
    );
  });

  // Format the filtered results for the response
  const responseResults = filteredResults.map((match) => ({
    professor: match.id,
    review: match.metadata.review,
    subject: match.metadata.subject,
    stars: match.metadata.stars,
  }));

  return NextResponse.json({ results: responseResults });
}
