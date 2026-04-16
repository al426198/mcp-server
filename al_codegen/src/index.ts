import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./handlers/tools/index.js";
import { registerResources } from "./handlers/resources/index.js";
import { registerPrompts } from "./handlers/prompts/index.js";
import { fileURLToPath } from 'url';
import { readMetadataFolder } from "./utils/metadata-helpers.js";
import { setMetadata } from "./utils/metadata-state.js";
import path from 'path';
import 'dotenv/config';

// Obtiene la ruta raíz del proyecto. Útil para trabajar con rutas absolutas.
export const __root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Crear instancia del servidor
const server = new McpServer({
    name: "al_codegen",
    version: "1.0.0",
});

// Ruta al directorio raíz del proyecto
const PROJECT_PATH = process.env.AL_PROJECT_PATH;

async function main() {
    // Comprobar que se ha especificado la ruta al directorio raíz del proyecto.
    if (!PROJECT_PATH) {
        console.error("Error: No se ha especificado la ruta al directorio raíz del proyecto.");
        process.exit(1);
    }

    // Obtener metadatos de la extensión base (carpeta `.alpackages`).
    try {
        setMetadata(await readMetadataFolder(path.join(PROJECT_PATH, ".alpackages")));
    } catch (error: any) {
        console.error("Error al cargar metadatos:", error.message);
        process.exit(1);
    }

    // Registrar componentes
    registerTools(server);
    registerResources(server);
    registerPrompts(server);

    // Iniciar servidor
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Servidor MCP ejecutándose en stdio");
}

main().catch((error) => {
    console.error("Error fatal en el servidor:", error);
    process.exit(1);
});
