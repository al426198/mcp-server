import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getMetadata } from "../../utils/metadata-state.js";
import { CATEGORIES } from "../../utils/metadata-state.js";


/**
 * HU101: Acceso al esquema de un objeto BC
 * 
 * Obtiene el esquema de un objeto de la extensión AL actual.
 * Se asume que los metadatos de la extensión base ya están inicializados.
 * 
 * @param category  - Categoría del objeto AL
 * @param name      - Nombre del objeto AL
 * 
 * @returns Un objeto JSON con el esquema del objeto AL o un mensaje de error si no existe.
 * 
 * @example
 * ```json
 * {
 *  "category": "Tables",
 *  "name": "Customer",
 *  "route": "C:/Users/.../Default Publisher_Ejemplo_1.0.0.0.app"
 * }
 * ``` 
 */
export const registerGetObjectSchemaTool = (server: McpServer) => {
    // Esquema JSON de validación de argumentos
    const argsSchema = {
        category: z.enum(CATEGORIES).describe("Categoría del objeto AL"),
        name: z.string().describe("Nombre del objeto AL")
    };

    // Parámetros del prompt
    const name = "get-object-schema";
    const config = {
        title: "Obtener esquema de objeto AL",
        description: "Obtiene el esquema de un objeto de la extensión AL actual. Se asume que los metadatos de la extensión AL ya están inicializados.",
        inputSchema: argsSchema,
    }

    server.registerTool(
        name,
        config,
        async (args): Promise<CallToolResult> => {
            // Obtener metadatos en memoria
            const envMetadata = getMetadata();

            // Buscar el objeto en los metadatos
            const entry = envMetadata[args.category]?.[args.name];
            const found = entry !== undefined;

            // Si no se encuentra el objeto, devolver un mensaje de error
            const response = found ? JSON.stringify(entry, null, 2) : `Objeto ${args.name} no encontrado en la categoría ${args.category}`;

            // Respuesta del servidor
            return {
                isError: !found,
                content: [
                    {
                        type: "text",
                        text: response,
                        annotations: {
                            audience: ["assistant"]         // Solo visible para el agente
                        }
                    },
                ],
            };
        }
    );
};