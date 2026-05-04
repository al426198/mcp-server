import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGenerateTableTool } from "./gen-table.js";
import { registerGenerateTableExtensionTool } from "./gen-tableext.js";

/**
 * Registra herramientas de generación de tablas en el servidor MCP.
 * @param server - Instancia del servidor MCP
 */
export const registerTableGenerators = (server: McpServer) => {
    registerGenerateTableTool(server);
    registerGenerateTableExtensionTool(server);
};