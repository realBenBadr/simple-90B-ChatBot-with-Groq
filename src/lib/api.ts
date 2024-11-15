import { createParser } from 'eventsource-parser';

const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function streamCompletion(messages: { role: string; content: string; }[]) {
  if (!import.meta.env.VITE_GROQ_API_KEY) {
    throw new APIError('API key is not configured. Please add VITE_GROQ_API_KEY to your environment variables.');
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: "llama-3.2-90b-text-preview",
        temperature: 0.7,
        max_tokens: 4096,
        stream: true,
      }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Error data:', errorData);
      throw new APIError(
        errorData?.error?.message || `Request failed with status ${response.status}`,
        response.status,
        errorData?.error?.code
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new APIError('Response body is not available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    return {
      async *[Symbol.asyncIterator]() {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices[0]?.delta?.content;
                  if (content) {
                    yield content;
                  }
                } catch (e) {
                  console.error('Error parsing chunk:', e);
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      }
    };
  } catch (error) {
    console.error('Stream completion error:', error);
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500
    );
  }
}