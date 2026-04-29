import 'dotenv/config';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./handlers/tools/index.js";
import { registerResources } from "./handlers/resources/index.js";
import { registerPrompts } from "./handlers/prompts/index.js";
import { fileURLToPath } from 'url';
import { registerTablePartials } from "./templates/tables/partials/index.js";
import { registerPagePartials } from "./templates/pages/partials/index.js";
import path from 'path';
import fs from 'fs';

// Ruta raíz del proyecto
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Ruta al directorio raíz del proyecto AL
const PROJECT_PATH = process.env.AL_PROJECT_PATH;

// Ruta al directorio donde se almacenan los ficheros `.app` de las extensiones base.
export const BASE_METADATA_PATH = path.join(PROJECT_PATH!, ".alpackages");

// Ruta al fichero de metadatos de la extensión AL
const appJson = JSON.parse(fs.readFileSync(path.join(PROJECT_PATH!, "app.json"), "utf8"));
export const APP_METADATA_PATH = path.join(PROJECT_PATH!, `${appJson.publisher}_${appJson.name}_${appJson.version}.app`);

async function main() {
    // Crear instancia del servidor
    const server = new McpServer({
        name: "al_codegen",
        version: "1.0.0",
    });

    // Comprobar que se ha especificado la ruta al directorio raíz del proyecto.
    if (!PROJECT_PATH) {
        console.error("Error: No se ha especificado la ruta al directorio raíz del proyecto.");
        process.exit(1);
    }

    // Registrar componentes
    registerTools(server);
    registerResources(server);
    registerPrompts(server);

    // Registrar parciales de Handlebars
    registerTablePartials();
    registerPagePartials();

    // Iniciar servidor
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Servidor MCP ejecutándose en stdio");
}

main().catch((error) => {
    console.error("Error fatal en el servidor:", error);
    process.exit(1);
});
