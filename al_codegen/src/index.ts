import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./handlers/tools/index.js";
import { registerResources } from "./handlers/resources/index.js";
import { registerPrompts } from "./handlers/prompts/index.js";

// == CREAR INSTANCIA DE SERVIDOR ==
const server = new McpServer({
    name: "al_codegen",
    version: "1.0.0",
});

// == REGISTRAR HERRAMIENTAS ==
registerTools(server);

// == REGISTRAR RECURSOS ==
registerResources(server);

// == REGISTRAR PROMPTS ==
registerPrompts(server);

// == INICIO DEL SERVIDOR ==
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Servidor MCP ejecutándose en stdio");
}

main().catch((error) => {
    console.error("Error fatal en el servidor:", error);
    process.exit(1);
});
