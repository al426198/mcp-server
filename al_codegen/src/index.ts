import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./handlers/tools/index.js";
import { registerResources } from "./handlers/resources/index.js";
import { registerPrompts } from "./handlers/prompts/index.js";
import { fileURLToPath } from 'url';
import { readMetadataFolder } from "./utils/metadata.js";
import path from 'path';

// Obtiene la ruta raíz del proyecto. Útil para trabajar con rutas absolutas.
export const __root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Crear instancia del servidor
const server = new McpServer({
    name: "al_codegen",
    version: "1.0.0",
});

// Obtener metadatos de la extensión base (carpeta `.alpackages`).
// La ruta al proyecto debe estar definida en el cliente.
const PROJECT_PATH = process.env.PROJECT_PATH || "";
process.env.AL_METADATA = JSON.stringify(readMetadataFolder(path.join(PROJECT_PATH, ".alpackages")));

// Registrar herramientas
registerTools(server);

// Registrar recursos
registerResources(server);

// Registrar prompts
registerPrompts(server);

// Iniciar servidor
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Servidor MCP ejecutándose en stdio");
}

main().catch((error) => {
    console.error("Error fatal en el servidor:", error);
    process.exit(1);
});
