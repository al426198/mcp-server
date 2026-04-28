import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGenerateObjectTool } from "./generators/gen-al-object.js";

/**
 * Registra herramientas en el servidor MCP.
 * @param server - Instancia del servidor MCP
 */
export const registerTools = (server: McpServer) => {
    registerGenerateObjectTool(server);
};