import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerObjectGenerators } from "./generators/index.js";
import { registerSaveAlFileTool } from "./save-al-file.js";

/**
 * Registra herramientas en el servidor MCP.
 * @param server - Instancia del servidor MCP
 */
export const registerTools = (server: McpServer) => {
    registerObjectGenerators(server);
    registerSaveAlFileTool(server);
};