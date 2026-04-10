import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { readMetadataFolder } from "../../utils/metadata.js";


/**
 * Obtiene los metadatos generales de BC.
 * Debe ejecutarse una vez tras iniciar el servidor.
 * 
 * @param route - Ruta al directorio que contiene los ficheros `.app`. Por defecto, la ruta es `./.alpackages` desde la raíz del proyecto.
 * 
 * @returns Un objeto JSON con los metadatos de los objetos AL
 */
export const registerInitMetadataTool = (server: McpServer) => {
    // Esquema JSON de validación de argumentos
    const argsSchema = {
        route: z.string().describe("Ruta al directorio que contiene los ficheros `.app`. Por defecto, la ruta es `./.alpackages` desde la raíz del proyecto."),
    };

    // Parámetros del prompt
    const name = "init-object-metadata";
    const config = {
        title: "Inicializar metadatos de objetos",
        description: "Obtiene los metadatos generales de los objetos de BC. Se asume que todas las extensiones AL comparten estos archivos, por lo que no debería ejecutarse más de una vez.",
        inputSchema: argsSchema,
    }

    server.registerTool(
        name,
        config,
        async (args): Promise<CallToolResult> => {
            let response: string;

            // Verificar si los metadatos ya han sido obtenidos
            if (process.env.AL_METADATA) {
                response = `Los metadatos ya existen en el entorno.`;
            } else {
                try {
                    process.env.AL_METADATA = JSON.stringify(readMetadataFolder(args.route));
                    response = `Metadatos obtenidos correctamente`;
                } catch (error) {
                    response = `Error al obtener los metadatos: ${error}`;
                }
            }

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