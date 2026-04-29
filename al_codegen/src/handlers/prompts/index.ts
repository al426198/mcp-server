import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCreateNewObjectPrompt } from "./create-al-object.js";

/**
 * Registra peticiones (prompts) en el servidor MCP.
 * 
 * @param server - Instancia del servidor MCP
 */
export const registerPrompts = (server: McpServer) => {
    registerCreateNewObjectPrompt(server);
};