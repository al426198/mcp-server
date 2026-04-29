import { registerTableGenerators } from "./tables/index.js";
import { registerPageGenerators } from "./pages/index.js";
import { registerCodeunitGenerators } from "./codeunits/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Registra herramientas de generación de objetos en el servidor MCP.
 * @param server - Instancia del servidor MCP
 */
export const registerObjectGenerators = (server: McpServer) => {
    registerTableGenerators(server);
    registerPageGenerators(server);
    registerCodeunitGenerators(server);
};