#!/usr/bin/env node
import 'dotenv/config';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./handlers/tools/index.js";
import { registerResources } from "./handlers/resources/index.js";
import { registerPrompts } from "./handlers/prompts/index.js";
import { fileURLToPath } from 'url';
import { registerTablePartials } from "./templates/tables/partials/index.js";
import { registerPagePartials } from "./templates/pages/partials/index.js";
import { registerCodeunitPartials } from "./templates/codeunits/partials/index.js";
import path from 'path';

// Ruta raíz del proyecto actual
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** 
 * Tipos de objetos disponibles en AL
 * Para el proyecto solo serán considerados 'table', 'page' y 'codeunit', 
 * y los tipos extensión 'tableextension' y 'pageextension'
 */
export const TYPES = [
    "Table",
    "Page",
    "Codeunit",
    "Report",
    "XmlPort",
    "Query",
    "Enum",
    "TableExtension",
    "PageExtension",
    "ReportExtension",
    "EnumExtension"
]

async function main() {
    // Crear instancia del servidor
    const server = new McpServer({
        name: "al_codegen",
        version: "1.0.0",
    });

    // Comprobar que se ha especificado la ruta al directorio raíz del proyecto.
    if (!process.env.AL_PROJECT_PATH) {
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
    registerCodeunitPartials();

    // Iniciar servidor
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Servidor MCP ejecutándose en stdio");
}

main().catch((error) => {
    console.error("Error fatal en el servidor:", error);
    process.exit(1);
});
