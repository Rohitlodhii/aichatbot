import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getGeminiResponse } from '@/lib/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await getGeminiResponse(input);
      const assistantMessage = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-[100vw] flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl overflow-hidden">
        <div className="flex items-center space-x-4 border-b p-4">
          <Bot className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">AI Chat Assistant</h1>
        </div>

        <ScrollArea className="h-[500px] p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 ${
                  message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    message.role === 'assistant'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.role === 'assistant'
                      ? 'bg-muted'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.2s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.4s]" />
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex flex-col space-y-2">
            {error && <div className="text-sm text-red-500">{error}</div>}
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default App;
