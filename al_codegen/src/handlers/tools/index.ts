import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetObjectSchemaTool } from "./get-object-schema.js";

/**
 * Registra herramientas en el servidor MCP.
 * @param server - Instancia del servidor MCP
 */
export const registerTools = (server: McpServer) => {
    registerGetObjectSchemaTool(server);
};