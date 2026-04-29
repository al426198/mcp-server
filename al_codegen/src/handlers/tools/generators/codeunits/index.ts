import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGenerateCodeunitTool } from "./gen-codeunit.js";

/**
 * Registra herramientas de generación de codeunits en el servidor MCP.
 * @param server - Instancia del servidor MCP
 */
export const registerCodeunitGenerators = (server: McpServer) => {
    registerGenerateCodeunitTool(server);
};
