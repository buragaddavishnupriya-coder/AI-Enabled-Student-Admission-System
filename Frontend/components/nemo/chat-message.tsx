"use client";

import { SRGECIcon } from "../logo-srgec";
import { Button } from "@/components/ui/button";
import { Loader } from "./loader";
import { ToolCard } from "./tool-card";
import { Markdown } from "./markdown";
import type { ToolStatus } from "./types";

interface ChatMessageProps {
  type: "user" | "ai";
  content: string;
  isWaitingForResponse?: boolean;
  isStreaming?: boolean;
  toolStatus?: ToolStatus;
  followUpQuestions?: string[];
  onFollowUpClick?: (question: string) => void;
  onRegenerate?: () => void;
}

export function ChatMessage({
  type,
  content,
  isWaitingForResponse,
  isStreaming,
  toolStatus,
  followUpQuestions,
  onFollowUpClick,
  onRegenerate,
}: ChatMessageProps) {
  if (type === "user") {
    return (
      <div className="flex justify-end gap-3 message-enter">
        <div className="bg-[#0B2545] text-white rounded-2xl rounded-tr-xs px-5 py-3 max-w-md shadow-xs text-sm">
          <p className="leading-relaxed">{content}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#C5A059] flex items-center justify-center flex-shrink-0 text-[#0B2545] font-black text-xs shadow-xs">
          U
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 message-enter">
      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-xs border border-gray-200">
        <SRGECIcon
          className={`w-6 h-6 ${
            isWaitingForResponse || isStreaming ? "animate-pulse" : ""
          }`}
        />
      </div>
      <div className="flex-1 space-y-3">
        {toolStatus && (
          <ToolCard
            icon={toolStatus.icon}
            message={toolStatus.message}
            state={toolStatus.state}
          />
        )}

        {content && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl rounded-tl-xs px-5 py-4 shadow-xs border border-gray-200 text-sm">
              <div className="text-gray-800 leading-relaxed">
                <Markdown content={content} />
                {isStreaming && (
                  <div className="inline-block ml-2 align-middle">
                    <Loader variant="typing" size="sm" />
                  </div>
                )}
              </div>
            </div>

            {!isStreaming &&
              followUpQuestions &&
              followUpQuestions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {followUpQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="bg-white border-gray-200 text-gray-700 hover:border-[#0B2545] hover:text-[#0B2545] rounded-full px-4 py-1.5 h-auto text-xs font-semibold shadow-xs transition-colors"
                      onClick={() => onFollowUpClick?.(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
