// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
// (tuỳ chọn) nếu bạn muốn dùng system prompt từ file:
// import fs from 'fs/promises'; import path from 'path';

export const maxDuration = 30;

const systemPrompt = `
Trả lời bằng Tiếng Việt.
Bạn là một chuyên gia để đọc Smart Contract solidity, kiểm tra và phát hiện các lỗi, rủi ro, và các vấn đề liên quan đến bảo mật.
Chỉ ra các lỗi bảo mật và đưa ra tài liệu tham khảo và hướng khắc phục.
`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // (tuỳ chọn) nạp system prompt từ file txt (vd: app/prompts/llms.txt)
  // const systemPath = path.join(process.cwd(), 'app', 'prompts', 'llms.txt')
  // const systemPrompt = await fs.readFile(systemPath, 'utf-8')
  // const modelMessages = [{ role: 'system', content: systemPrompt }, ...convertToModelMessages(messages)]

  const result = streamText({
    // Bạn có thể dùng openai('gpt-4o-mini') hoặc openai.responses('gpt-4o-mini')
    model: openai("gpt-4o-mini"),

    // Nếu có system prompt: dùng modelMessages; còn không, giữ như hiện tại:
    messages: convertToModelMessages(messages),
    system: systemPrompt,

    // Bật OpenAI File Search (vector stores) qua AI SDK tools:
    tools: {
      // Tên tool PHẢI là "file_search" theo đặc tả OpenAI
      // file_search: openai.tools.fileSearch({
      //   // danh sách vector stores bạn đã upload (ví dụ từ Playground/Responses)
      //   vectorStoreIds: ["vs_68a2e171b27c819193ff253e16f92267"],
      //   // tuỳ chọn hữu ích:
      //   maxNumResults: 6, // số tài liệu lấy về
      //   // filters: { type: 'and', filters: [{ key: 'category', type: 'eq', value: 'tailor' }] },
      //   // ranking: { ranker: 'auto' },
      // }),
      // tool_assets: {
      //   description: "Get assets information",
      //   inputSchema: z.object({}),
      //   execute: async () => {
      //     console.log("tool_assets chain", chain);
      //     const data = await toolAssetsMemoryCache
      //       .getCacheWithHook(`tool_assets:${chain}`, `tool_assets:${chain}`)
      //       .then((assets) => {
      //         return assets;
      //       });
      //     return { data };
      //   },
      // },
    },

    // (tuỳ chọn) ép model dùng tool file_search ở bước đầu:
    // toolChoice: { type: 'tool', toolName: 'file_search' },

    // (tuỳ chọn) trả kèm kết quả truy xuất để bạn hiển thị nguồn ở client:
    // providerOptions: {
    //   openai: {
    //     include: ["file_search_call.results"],
    //   },
    // },
  });

  return result.toUIMessageStreamResponse();
}
