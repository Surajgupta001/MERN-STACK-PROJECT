import React, { useEffect, useRef } from "react";
import { BotIcon, BotMessageSquareIcon, UserIcon } from "lucide-react";
import PromptInput from "./PromptInput";

function ChatPanel({ messages = [], onSend, loading }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({
                behavior: "smooth",
            });
        }
    }, [messages, loading]);

    return (
        <div className="flex flex-col h-full min-h-0 bg-white">

            {/* Messages */}
            <div className="flex-1 min-h-0 p-4 space-y-5 overflow-y-auto hide-scrollbar">

                {/* Empty State */}
                {messages.length === 0 && !loading && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-center text-zinc-400">
                            Ask AI to modify your website
                        </p>
                    </div>
                )}

                {/* Messages */}
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className="flex items-start w-full gap-3"
                    >
                        {/* Message Icon */}
                        <div className=" flex items-center justify-center w-7 h-7 mt-0.5 rounded-md shrink-0 bg-zinc-50 border border-zinc-100">
                            {msg.role === "user" ? (
                                <UserIcon size={14} className="text-zinc-500"/>
                            ) : (
                                <BotMessageSquareIcon size={14} className="text-zinc-700" />
                            )}
                        </div>
                        
                        {/* Message Content */}
                        <div className="flex-1 min-w-0">

                            {/* Role */}
                            <p className="mb-1 text-[11px] font-medium tracking-wider uppercase text-zinc-500">
                                {msg.role === "user" ? "You" : "AI"}
                            </p>

                            {/* Content */}
                            <div className="text-[13px] leading-5 text-zinc-700 whitespace-pre-wrap whitespace-break-words">
                                {msg.content.split("_ `/").map((text, index) => (
                                    <span key={index} className={index === 0 ? "block" : "block mt-3"}>
                                        {index !== 0 && (<span className="mr-1">-`/</span>)}
                                        {text}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* AI Loading */}
                {loading && (
                    <div className="flex items-start w-full gap-3">

                        {/* Bot Icon */}
                        <div className=" flex items-center justify-center w-7 h-7 mt-0.5 rounded-md shrink-0 bg-zinc-900/5 border border-zinc-100">
                            <BotIcon size={14} className="text-zinc-700" />
                        </div>

                        {/* Loading Content */}
                        <div className="flex-1 min-w-0">
                            <p className="mb-2 text-[11px] font-medium tracking-wider uppercase text-zinc-400">AI</p>
                            <div className="dot-loader">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t shrink-0 border-zinc-200">
                <PromptInput
                    onSubmit={onSend}
                    loading={loading}
                    placeholder="Ask AI to modify your website"
                    autoFocus
                />
            </div>
        </div>
    );
}

export default ChatPanel;