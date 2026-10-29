"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChatHeader } from "./chat-header";
import { EmptyState } from "./empty-state";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";
import { ScrollButton } from "./scroll-button";
import { streamChatResponse } from "@/lib/agent-client";
import { useStickToBottom } from "@/lib/use-stick-to-bottom";
import type { Message, ToolStatus } from "./types";
import { Button } from "@/components/ui/button";

export interface FormContext {
  firstName: string;
  lastName: string;
  email: string;
  cellPhone: string;
  homePhone?: string;
  headquarters: string;
  programType: string;
}

interface NemoChatInterfaceProps {
  onClose?: () => void;
  initialContext?: FormContext;
}

const QUICK_SUGGESTIONS = [
  "What is the AP EAPCET code for SRGEC?",
  "Which B.Tech branches are available?",
  "Tell me about the Fee Structure & JVD Scholarship",
  "What are the required admission documents?",
  "I want to speak with an admissions advisor",
];

export function NemoChatInterface({
  onClose,
  initialContext,
}: NemoChatInterfaceProps) {
  const [sessionId, setSessionId] = useState<string>("");
  const phoneNumber = initialContext?.cellPhone ?? "anonymous";

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [hasPrePopulated, setHasPrePopulated] = useState(false);

  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentTool, setCurrentTool] = useState<ToolStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollBottomRef = useRef<HTMLDivElement>(null);

  const { isAtBottom, scrollToBottom } = useStickToBottom({
    scrollContainerRef,
    scrollBottomRef,
    threshold: 50,
  });

  useEffect(() => {
    if (!sessionId) {
      setSessionId(crypto.randomUUID());
    }
  }, []);

  const handleSendMessage = useCallback(
    async (messageOverride?: string, isSystemMessage: boolean = false) => {
      const messageToSend = messageOverride || inputValue;
      if (!messageToSend.trim()) return;

      if (!sessionId) {
        console.warn("Session not initialized yet, please wait...");
        return;
      }

      if (!isSystemMessage) {
        const userMsg: Message = {
          id: crypto.randomUUID(),
          type: "user",
          content: messageToSend,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, userMsg]);
      }
      setInputValue("");

      setIsWaitingForResponse(true);
      setCurrentStreamingMessage("");
      setIsStreaming(false);
      setCurrentTool(null);
      setError(null);

      try {
        for await (const event of streamChatResponse({
          message: messageToSend,
          sessionId,
          phoneNumber,
        })) {
          if (event.type === "tool_status") {
            setIsWaitingForResponse(false);
            setCurrentTool({
              icon: event.icon!,
              message: event.message!,
              state: "running",
            });
          } else if (event.type === "response") {
            setIsWaitingForResponse(false);
            setIsStreaming(true);
            setCurrentStreamingMessage((prev) => prev + event.content!);
          } else if (event.type === "final") {
            setIsStreaming(false);
            setIsWaitingForResponse(false);

            if (currentTool) {
              setCurrentTool({ ...currentTool, state: "completed" });
            }

            const aiMsg: Message = {
              id: crypto.randomUUID(),
              type: "ai",
              content: event.content!,
              timestamp: Date.now(),
              toolStatus: currentTool
                ? { ...currentTool, state: "completed" }
                : undefined,
            };
            setMessages((prev) => [...prev, aiMsg]);

            setCurrentStreamingMessage("");
            setCurrentTool(null);
          } else if (event.type === "error") {
            setIsWaitingForResponse(false);
            setIsStreaming(false);
            setError(event.message!);
            console.error("Chat error:", event.message);
          }
        }
      } catch (err) {
        console.error("Error in chat stream:", err);
        setIsWaitingForResponse(false);
        setIsStreaming(false);
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    },
    [inputValue, sessionId, phoneNumber, currentTool]
  );

  useEffect(() => {
    if (initialContext && !hasPrePopulated && sessionId) {
      const campusLabel = "Gudlavalleru Campus (SRGEC)";
      const systemMessage = `This is a system generated message. A new student has submitted an inquiry form for Seshadri Rao Gudlavalleru Engineering College (SRGEC):
- Name: ${initialContext.firstName} ${initialContext.lastName}
- Email: ${initialContext.email}
- Phone: ${initialContext.cellPhone}
- Campus Interest: ${campusLabel}
- Program Type: ${initialContext.programType}
- Data Authorization: Approved

Please welcome this prospective student warmly to Seshadri Rao Gudlavalleru Engineering College, mention our AP EAPCET code GECW, and answer any questions they have.`;

      setHasPrePopulated(true);

      setTimeout(() => {
        handleSendMessage(systemMessage, true);
      }, 100);
    }
  }, [initialContext, hasPrePopulated, sessionId, handleSendMessage]);

  useEffect(() => {
    if (isAtBottom) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [messages, currentStreamingMessage, isAtBottom, scrollToBottom]);

  const handleSuggestionClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[90vh] max-h-[820px] scale-enter font-sans">
      <ChatHeader onClose={onClose} />

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-6 py-6 md:px-8 relative bg-slate-50/50"
      >
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.length === 0 && !isWaitingForResponse && !isStreaming && (
            <div className="space-y-6">
              <EmptyState />
              <div className="max-w-xl mx-auto">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block text-center mb-3">
                  Quick Questions for Nemo
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {QUICK_SUGGESTIONS.map((q, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(q)}
                      className="bg-white hover:bg-slate-100 hover:border-[#0B2545] hover:text-[#0B2545] border-gray-250 text-gray-700 text-xs rounded-full px-4 py-1.5 h-auto transition-colors"
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Render all messages */}
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              type={message.type}
              content={message.content}
              toolStatus={message.toolStatus}
            />
          ))}

          {/* Render streaming message */}
          {(isWaitingForResponse || isStreaming || currentStreamingMessage) && (
            <ChatMessage
              type="ai"
              content={currentStreamingMessage}
              isWaitingForResponse={isWaitingForResponse}
              isStreaming={isStreaming}
              toolStatus={currentTool || undefined}
            />
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs">
              <strong>Notice:</strong> {error}
            </div>
          )}

          <div ref={scrollBottomRef} />
        </div>

        <ScrollButton isAtBottom={isAtBottom} scrollToBottom={scrollToBottom} />
      </div>

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={() => handleSendMessage()}
      />
    </div>
  );
}
