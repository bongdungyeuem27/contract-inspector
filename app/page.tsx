/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";

const sampleContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract VulnerableBank {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "insufficient balance");
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "withdraw failed");
        balances[msg.sender] -= amount;
    }
}
`;

const cn = (...classes: Array<string | boolean | undefined | null>) =>
  classes.filter(Boolean).join(" ");

const getMessageText = (message: UIMessage) => {
  console.log(message);
  if (!message?.parts) return "";
  return message.parts
    .map((p: any) => (p?.type === "text" ? p.text : ""))
    .join("");
};

const SpinnerIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn("h-4 w-4 animate-spin text-emerald-300", className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      d="M4 12a8 8 0 018-8"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

const ArrowUpRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn("h-4 w-4", className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 17L17 7M17 7H7M17 7V17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const markdownComponents: Components = {
  p: (props) => (
    <p className="mb-3 text-sm leading-relaxed text-slate-200">
      {props.children}
    </p>
  ),
  ul: (props) => (
    <ul className="mb-3 list-disc space-y-2 pl-5 text-sm text-slate-200">
      {props.children}
    </ul>
  ),
  ol: (props) => (
    <ol className="mb-3 list-decimal space-y-2 pl-5 text-sm text-slate-200">
      {props.children}
    </ol>
  ),
  code: (props) => (
    <code className="rounded-md bg-slate-900/70 px-1.5 py-0.5 font-mono text-xs text-emerald-200">
      {props.children}
    </code>
  ),
  pre: (props) => (
    <pre className="mb-3 overflow-x-auto rounded-xl bg-slate-900/80 p-4 text-xs text-emerald-100">
      {props.children}
    </pre>
  ),
  a: (props) => (
    <a
      className="text-sky-300 underline underline-offset-2"
      href={props.href}
      target="_blank"
      rel="noreferrer"
    >
      {props.children}
    </a>
  ),
};

export default function Home() {
  const { messages, sendMessage, status, error } = useChat();
  const [contract, setContract] = useState("");
  const [question, setQuestion] = useState("");
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const isStreaming = status === "submitted" || status === "streaming";
  const contractLines = useMemo(() => {
    if (!contract.trim()) return 0;
    return contract.trim().split(/\r?\n/).length;
  }, [contract]);
  const contractChars = contract.trim().length;

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const handleSubmit = useCallback(
    (event?: React.FormEvent) => {
      event?.preventDefault();
      if (!question.trim()) return;

      const payload = contract.trim()
        ? `Hợp đồng Solidity:\n\n${contract.trim()}\n\nCâu hỏi hoặc yêu cầu của tôi: ${question.trim()}\n\nHãy phân tích bảo mật dựa trên hợp đồng ở trên.`
        : question.trim();

      sendMessage({ text: payload });
      setQuestion("");
    },
    [contract, question],
  );

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_bottom,rgba(99,102,241,0.12),transparent_40%)] text-slate-50">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-16 pt-10 lg:flex-row">
        <section className="flex w-full flex-col gap-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-md">
            <div className="flex items-center gap-3 text-indigo-300">
              <span className="text-lg">✨</span>
              <span className="text-xs font-semibold tracking-widest uppercase text-indigo-300">
                Contract Inspector
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-white lg:text-4xl">
              Dán hợp đồng Solidity và hỏi Contract Inspector về rủi ro bảo mật
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Công cụ dùng LLMs để rà soát lỗ hổng, điểm yếu thiết kế và khuyến
              nghị cải thiện. Bạn có thể vừa gửi hợp đồng vừa đặt câu hỏi để
              truy vết từng thành phần.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 px-3 py-1">
                {contractLines} dòng
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                {contractChars} ký tự
              </span>
              <button
                type="button"
                onClick={() => setContract(sampleContract)}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/20 px-3 py-1 text-emerald-100 transition hover:border-emerald-200 hover:bg-emerald-400/30"
              >
                <span className="text-base">📎</span>
                Dán ví dụ dễ lỗi
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-1 shadow-2xl shadow-emerald-500/5">
            <div className="rounded-[26px] border border-white/5 bg-linear-to-br from-slate-900 to-slate-950 p-6">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <div className="font-medium text-slate-200">
                  Solidity Contract
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Hãy dán toàn bộ contract
                </span>
              </div>
              <textarea
                value={contract}
                onChange={(event) => setContract(event.target.value)}
                placeholder="// SPDX-License-Identifier: MIT"
                className="mt-3 h-72 w-full rounded-2xl border border-white/5 bg-slate-900/60 p-4 font-mono text-sm text-emerald-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
              />
              <p className="mt-2 text-sm text-slate-400">
                AI sẽ dùng nội dung này như bối cảnh cho mọi câu hỏi tiếp theo.
              </p>
            </div>
          </div>
        </section>

        <section className="flex w-full flex-col">
          <div className="flex flex-1 flex-col rounded-3xl border border-white/10 bg-white/5 p-1 shadow-[0_30px_120px_rgba(15,23,42,0.45)]">
            <div className="flex items-center justify-between rounded-[26px] border border-white/10 bg-slate-900/60 px-6 py-4">
              <div>
                <div className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Live Chat
                </div>
                <p className="mt-1 text-base font-semibold text-white">
                  Contract Inspector
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                  isStreaming
                    ? "bg-amber-400/20 text-amber-200"
                    : "bg-emerald-500/20 text-emerald-100",
                )}
              >
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isStreaming ? "bg-amber-300" : "bg-emerald-300",
                  )}
                />
                {isStreaming ? "Đang phân tích" : "Sẵn sàng"}
              </span>
            </div>

            <div className="mt-4 flex flex-1 flex-col rounded-[26px] border border-white/5 bg-slate-950/80">
              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                {messages.length === 0 && (
                  <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5 text-sm text-slate-200 transition duration-300">
                    👋 Xin chào! Dán hợp đồng ở khung bên trái rồi nhập câu hỏi
                    để mình kiểm tra reentrancy, thiếu kiểm soát quyền, integer
                    overflow,...
                  </div>
                )}

                {messages.map((message) => {
                  const text = getMessageText(message);
                  const isUser = message.role === "user";

                  return (
                    <div
                      key={message.id}
                      className={cn("flex gap-3", isUser && "flex-row-reverse")}
                    >
                      <div
                        className={cn(
                          "h-10 w-10 shrink-0 rounded-full border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 text-xs font-semibold uppercase tracking-wide text-white",
                          isUser && "from-indigo-600 to-indigo-500",
                        )}
                      >
                        <div className="flex h-full w-full items-center justify-center">
                          {isUser ? "You" : "AI"}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl border px-5 py-4 text-sm leading-relaxed",
                          isUser
                            ? "border-indigo-500/40 bg-indigo-500/30 text-white"
                            : "border-white/10 bg-white/5 text-slate-100",
                        )}
                      >
                        {isUser ? (
                          text
                        ) : (
                          <ReactMarkdown
                            components={markdownComponents as Components}
                          >
                            {text}
                          </ReactMarkdown>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isStreaming && (
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200">
                    <SpinnerIcon />
                    AI đang tổng hợp câu trả lời...
                  </div>
                )}
                <div ref={scrollAnchorRef} />
              </div>

              {error && (
                <div className="mx-6 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {error.message}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 border-t border-white/5 p-6"
              >
                <label
                  htmlFor="question"
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
                >
                  Câu hỏi tới AI
                </label>
                <div className="flex gap-3">
                  <input
                    id="question"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Ví dụ: Có thể rút ether quá số dư không?"
                    className="flex-1 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
                  />
                  <button
                    type="submit"
                    disabled={!question.trim() || isStreaming}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition",
                      !question.trim() || isStreaming
                        ? "cursor-not-allowed border border-white/5 bg-white/5 text-slate-400"
                        : "border border-indigo-400/60 bg-indigo-500/90 text-white hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-500",
                    )}
                  >
                    {isStreaming ? (
                      <>
                        <SpinnerIcon className="text-white" />
                        Đang gửi
                      </>
                    ) : (
                      <>
                        Gửi
                        <ArrowUpRightIcon />
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Mọi câu trả lời sẽ dùng Tiếng Việt và tập trung vào bảo mật
                  hợp đồng thông minh.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
