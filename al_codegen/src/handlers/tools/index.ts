import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetObjectSchemaTool } from "./get-object-schema.js";
import { registerInitMetadataTool } from "./init-metadata.js";
import { registerGenerateTableTool } from "./generators/tables/gen-table.js";
import { registerGenerateTableExtensionTool } from "./generators/tables/gen-tableext.js";
import { registerGenerateCardPageTool } from "./generators/pages/gen-page-card.js";

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
};