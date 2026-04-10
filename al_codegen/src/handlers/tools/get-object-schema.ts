import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { readMetadata, CATEGORIES } from "../../utils/metadata.js";


/**
 * HU101: Acceso al esquema de un objeto BC
 * 
 * Obtiene el esquema de un objeto de la extensión AL actual.
 * @param category  - Categoría del objeto AL
 * @param name      - Nombre del objeto AL
 * @param route     - Ruta absoluta al fichero `.app` de la extensión AL. 
 *                    El nombre debería ser: `<publisher>_<name>_<version>.app` desde la raíz del proyecto.
 * 
 * @returns Un objeto JSON con el esquema del objeto AL
 */
export const registerGetObjectSchemaTool = (server: McpServer) => {
    // Esquema JSON de validación de argumentos
    const argsSchema = {
        category: z.enum(CATEGORIES).describe("Categoría del objeto AL"),
        name: z.string().describe("Nombre del objeto AL"),
        route: z.string().describe("Ruta absoluta al fichero `.app` de la extensión AL. El nombre debería ser: `<publisher>_<name>_<version>.app` desde la raíz del proyecto."),
    };

    // Parámetros del prompt
    const name = "get-object-schema";
    const config = {
        title: "Obtener esquema de objeto AL",
        description: "Obtiene el esquema de un objeto de la extensión AL actual",
        inputSchema: argsSchema,
    }

    server.registerTool(
        name,
        config,
        async (args): Promise<CallToolResult> => {
            // Obtener metadatos del entorno
            // Deberían combinarse a posteriori con los metadatos de la extensión AL
            // const metadata = JSON.parse(process.env.AL_METADATA || "{}");

            // Leer metadatos de la extensión AL
            const metadata = readMetadata(args.route);

            // Buscar el objeto en los metadatos
            const entry = metadata[args.category][args.name];

            // Si no se encuentra el objeto, devolver un mensaje de error
            const response = entry === undefined ? `Objeto ${args.name} no encontrado en la categoría ${args.category}` : JSON.stringify(entry, null, 2);

            // Respuesta del servidor
            return {
                content: [
                    {
                        type: "text",
                        text: response,
                    },
                ],
            };
        }
    );
};