import { NextResponse } from 'next/server';
import { PineconeClient } from '@pinecone-database/pinecone';
import fetch from 'node-fetch';

const systemPrompt = `
You are a rate my professor agent to help students find classes, that takes in user questions and answers them.
For every user question, the top 3 professors that match the user question are returned.
Use them to answer the question if needed.
`;

export async function POST(req) {
  try {
    const data = await req.json();
    const userMessage = data[data.length - 1].content;

    // Initialize Pinecone
    const pinecone = new PineconeClient({
      apiKey: process.env.PINECONE_API_KEY,
    });
    const index = pinecone.Index('rag');

    // Step 1: Generate an embedding for the user query using OpenAI's Embedding API
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: userMessage,
      }),
    });

    if (!embeddingResponse.ok) {
      throw new Error(`Failed to generate embedding. Status: ${embeddingResponse.status}`);
    }

    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData.data[0].embedding;

    // Step 2: Query Pinecone with the generated embedding
    const results = await index.query({
      topK: 5,
      includeMetadata: true,
      vector: embedding,
    });

    // Format the Pinecone results into a response string
    let resultString = '';
    results.matches.forEach((match) => {
      resultString += `
      Returned Results:
      Professor: ${match.id}
      Review: ${match.metadata.review}
      Subject: ${match.metadata.subject}
      Stars: ${match.metadata.stars}
      \n\n`;
    });

    // Step 3: Combine the original user message with the Pinecone results
    const lastMessage = data[data.length - 1];
    const lastMessageContent = lastMessage.content + resultString;
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

    // Step 4: Send a chat completion request to OpenAI
    const completionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...lastDataWithoutLastMessage,
          { role: 'user', content: lastMessageContent },
        ],
        max_tokens: 300,
        stream: true,
      }),
    });

    if (!completionResponse.ok) {
      throw new Error(`Failed to fetch response from OpenAI. Status: ${completionResponse.status}`);
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completionResponse.body) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const text = encoder.encode(content);
              controller.enqueue(text);
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error('Error processing chat request:', error);
    return new NextResponse('Error processing request.', { status: 500 });
  }
}
