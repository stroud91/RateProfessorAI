import { NextResponse } from 'next/server';
import axios from 'axios';
import cheerio from 'cheerio';
import { PineconeClient } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

export async function POST(req) {
  const { url } = await req.json();

  try {
   
    const response = await axios.get(url);
    const html = response.data;

  
    const $ = cheerio.load(html);
    const professorName = $('h1').text().trim();
    const reviews = [];
    $('.Rating__RatingBody-sc-1rhvpxz-0').each((index, element) => {
      reviews.push({
        review: $(element).find('.Comments__StyledComments-dzzyvm-0').text().trim(),
        subject: $(element).find('.Course__StyledCourse-qffpzd-0').text().trim(),
        stars: $(element).find('.Rating__StyledRatingNumber-sc-1rhvpxz-1').text().trim(),
      });
    });

   
    const pinecone = new PineconeClient({ apiKey: process.env.PINECONE_API_KEY });
    const index = pinecone.Index('rag');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  
    const processedData = [];
    for (const review of reviews) {
      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: review.review,
      });
      const embedding = response.data[0].embedding;

      processedData.push({
        values: embedding,
        id: professorName,
        metadata: {
          review: review.review,
          subject: review.subject,
          stars: review.stars,
        },
      });
    }

    const upsertResponse = await index.upsert({
      vectors: processedData,
    });

    return NextResponse.json({
      success: true,
      upsertedCount: upsertResponse.upsertedCount,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
