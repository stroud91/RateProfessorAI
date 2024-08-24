import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import Sentiment from 'sentiment';

export async function POST(req) {
  const { professorName } = await req.json();


  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const index = pc.index('rag').namespace('ns1');
  const sentiment = new Sentiment();

  const searchResults = await index.query({
    filter: {
      'metadata.professor': professorName,
    },
    topK: 100,
    includeMetadata: true,
  });


  const sentimentResults = searchResults.matches.map((match) => {
    const sentimentScore = sentiment.analyze(match.metadata.review).score;
    return {
      date: match.metadata.date,  
      sentiment: sentimentScore,
    };
  });


  const groupedByMonth = sentimentResults.reduce((acc, cur) => {
    const month = new Date(cur.date).toISOString().substr(0, 7);
    if (!acc[month]) acc[month] = [];
    acc[month].push(cur.sentiment);
    return acc;
  }, {});

  const trendData = Object.keys(groupedByMonth).map((month) => ({
    month,
    avgSentiment: groupedByMonth[month].reduce((a, b) => a + b, 0) / groupedByMonth[month].length,
  }));

  return NextResponse.json({ trendData });
}
