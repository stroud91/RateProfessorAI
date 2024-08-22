import { NextResponse } from 'next/server';
import axios from 'axios';
import cheerio from 'cheerio';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

export async function POST(req) {
  const { url } = await req.json();

  // Fetch the professor page
  const response = await axios.get(url);
  const html = response.data;

  // Use Cheerio to parse the HTML and extract relevant data
  const $ = cheerio.load(html);
  const professorName = $('h1').text().trim();  // Example: Extract the professor's name
  const reviews = [];
  $('.Rating__RatingBody-sc-1rhvpxz-0').each((index, element) => {
    reviews.push({
      review: $(element).find('.Comments__StyledComments-dzzyvm-0').text().trim(),
      subject: $(element).find('.Course__StyledCourse-qffpzd-0').text().trim(),
      stars: $(element).find('.Rating__StyledRatingNumber-sc-1rhvpxz-1').text().trim(),
    });
  });

  // Initialize Pinecone and OpenAI
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const index = pc.index('rag').namespace('ns1');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Generate embeddings for each review
  const processedData = [];
  for (const review of reviews) {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: review.review,
      encoding_format: 'float',
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

  // Insert the embeddings into the Pinecone index
  const upsertResponse = await index.upsert({
    vectors: processedData,
    namespace: 'ns1',
  });

  return NextResponse.json({
    success: true,
    upsertedCount: upsertResponse.upsertedCount,
  });
}
