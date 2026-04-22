import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetObjectSchemaTool } from "./get-object-schema.js";
import { registerInitMetadataTool } from "./init-metadata.js";
import { registerGenerateTableTool } from "./generators/tables/gen-table.js";
import { registerGenerateTableExtensionTool } from "./generators/tables/gen-tableext.js";
import { registerGenerateCardPageTool } from "./generators/pages/gen-page-card.js";
import { registerGenerateListPageTool } from "./generators/pages/gen-page-list.js";
import { registerGenerateApiPageTool } from "./generators/pages/gen-page-api.js";
import { registerGeneratePageExtensionTool } from "./generators/pages/gen-pageext.js";

/**
 * Registra herramientas en el servidor MCP.
 * @param server - Instancia del servidor MCP
 */
export const registerTools = (server: McpServer) => {
    registerGetObjectSchemaTool(server);
    registerInitMetadataTool(server);
    registerGenerateTableTool(server);
    registerGenerateTableExtensionTool(server);
    registerGenerateCardPageTool(server);
    registerGenerateListPageTool(server);
    registerGenerateApiPageTool(server);
    registerGeneratePageExtensionTool(server);
};