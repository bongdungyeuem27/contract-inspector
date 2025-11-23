import { createMcpHandler } from "@vercel/mcp-adapter";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import fs from "fs/promises";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import path from "path";

const handler = createMcpHandler(
  (server) => {
    server.tool("get-vulnerabilities", "Get vulnerabilities", {}, async () => {
      // Read all files in the "vulnerabilities" folder as text

      const folderPath = path.join(process.cwd(), "vulnerabilities");
      const fileNames = await fs.readdir(folderPath);
      const filesContent = await Promise.all(
        fileNames.map(async (file) => {
          const filePath = path.join(folderPath, file);
          const content = await fs.readFile(filePath, "utf8");
          return { file, content };
        })
      );

      return {
        content: filesContent.map((file) => ({
          type: "text",
          text: `${file.file}: ${file.content}`,
        })),
      };
    });
  },
  // Optional: Comes from the McpServer.options
  {
    capabilities: {},
  },
  // Optional: Comes from the createMcpRouteHandler config
  {
    streamableHttpEndpoint: "/mcp",
    sseEndpoint: "/sse",
    sseMessageEndpoint: "/message",
    basePath: "/api/mcp",
  }
);

export { handler as GET, handler as POST };
