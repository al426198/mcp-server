import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// == CREAR INSTANCIA DE SERVIDOR ==
const server = new McpServer({
    name: "al_codegen",
    version: "1.0.0",
});

// == REGISTRAR HERRAMIENTAS ==
/* server.registerTool(
    "tool_name",
    {
        description: ...,
        inputSchema: {
            ...,
        },
    },
    async ({ state }) => {
        // ...
    }
); */

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
