import { ChatRequest, ChatResponse, QuizParseResponse, Message } from '../types';

class ApiProvider {
  private async fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async chat(message: string, history: Message[] = [], context: string = ''): Promise<string> {
    const data = await this.fetchJson<ChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history, context } as ChatRequest),
    });
    return data.reply;
  }

  async uploadAndParseQuiz(file: File, preset: 'marker' | 'delimiter' | 'ai'): Promise<QuizParseResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('preset', preset);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const apiProvider = new ApiProvider();
