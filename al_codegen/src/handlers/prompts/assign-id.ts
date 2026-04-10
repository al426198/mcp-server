import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Tipos de objetos disponibles en AL
const TYPES = [
    "table",
    "page",
    "report",
    "codeunit",
    "xmlport",
    "query",
    "enum",
    "tableextension",
    "pageextension",
]

/**
 * HU102: Obtención dinámica de ID
 * 
 * Asigna y devuelve el siguiente ID disponible para un tipo de objeto dentro de una extensión AL
 * @param type - Tipo de objeto (ej. table, page, report, codeunit, etc.)
 * @param path - Ruta absoluta a la carpeta raíz de la extensión AL (debe contener el archivo "app.json").
 *               Suele llamarse "src".
 * @example
 * type: "table",
 * path: "C:/Users/.../<NOMBRE_PROYECTO>/src"
*/
export const registerAssignIdPrompt = (server: McpServer) => {
    // Esquema JSON de validación de argumentos
    const promptSchema = {
        type: z.enum(TYPES).describe("Tipo de objeto (ej. table, page, report, codeunit, etc.)"),
        path: z.string().describe("Ruta absoluta a la carpeta raíz de la extensión AL (debe contener el archivo \"app.json\")"),
    };

    // Parámetros del prompt
    const name = "assign-id";
    const config = {
        title: "Obtención dinámica de ID",
        description: "Asigna y devuelve el siguiente ID disponible para un tipo de objeto dentro de una extensión AL",
        argsSchema: promptSchema,
    }

    // Registro del prompt
    server.registerPrompt(name, config, async (args) => ({
        messages: [
            {
                role: "user",
                content: {
                    type: "text",
                    text: `Asigna un ID para el tipo de objeto "${args.type}" en la extensión ubicada en "${args.path}".`,
                },
            },
        ],
    }));
}
