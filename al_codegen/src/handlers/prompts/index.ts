import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAssignIdPrompt } from "./assign-id.js";

/**
 * Registra peticiones (prompts) en el servidor MCP.
 * 
 * @param server - Instancia del servidor MCP
 */
export const registerPrompts = (server: McpServer) => {
    registerAssignIdPrompt(server);
};