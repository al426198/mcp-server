import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * HU102: Obtención dinámica de ID
 * 
 * Asigna y devuelve el siguiente ID disponible para un tipo de objeto dentro de una extensión AL
 * @param type - Tipo de objeto (ej. table, page, report, codeunit, etc.)
 * @param path - Ruta absoluta a la carpeta raíz de la extensión AL (debe contener el archivo "app.json")
 * @example
 * type: "table",
 * path: "C:/Users/.../Mi proyecto/src/Tables"
*/
export const registerAssignIdPrompt = (server: McpServer) => {
    const promptSchema = {
        type: z.string().describe("Tipo de objeto (ej. table, page, report, codeunit, etc.)"),
        path: z.string().describe("Ruta absoluta a la carpeta raíz de la extensión AL (debe contener el archivo \"app.json\")"),
    };

    server.registerPrompt(
        "assign_id",
        {
            title: "Obtención dinámica de ID",
            description: "Asigna y devuelve el siguiente ID disponible para un tipo de objeto dentro de una extensión AL",
            argsSchema: promptSchema,
        },
        async (args) => ({
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Asigna un ID para el tipo de objeto "${args.type}" en la extensión ubicada en "${args.path}".`,
                    },
                },
            ],
        })
    );
}
