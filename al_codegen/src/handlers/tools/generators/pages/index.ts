import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGenerateCardPageTool } from "./subtypes/gen-page-card.js";
import { registerGenerateListPageTool } from "./subtypes/gen-page-list.js";
import { registerGenerateApiPageTool } from "./subtypes/gen-page-api.js";
import { registerGeneratePageExtensionTool } from "./gen-pageext.js";

/**
 * Registra herramientas de generación de páginas en el servidor MCP.
 * @param server - Instancia del servidor MCP
 */
export const registerPageGenerators = (server: McpServer) => {
    registerGenerateCardPageTool(server);
    registerGenerateListPageTool(server);
    registerGenerateApiPageTool(server);
    registerGeneratePageExtensionTool(server);
};