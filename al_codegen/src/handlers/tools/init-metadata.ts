import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { readMetadata, combineMetadata } from "../../utils/metadata.js";

/**
 * Obtiene los metadatos de la extensión AL base.
 * 
 * @param route - Ruta al directorio que contiene los ficheros `.app`. Por defecto, la ruta es `./.alpackages` desde la raíz del proyecto.
 * 
 * @returns Un mensaje de confirmación indicando si los metadatos han sido obtenidos correctamente o si ya existen, o un mensaje de error si se ha producido un error.
 */
export const registerInitMetadataTool = (server: McpServer) => {
    // Esquema JSON de validación de argumentos
    const argsSchema = {
        app_route: z.string().describe("Ruta absoluta al fichero `.app` de la extensión AL. El nombre debería ser: `<publisher>_<name>_<version>.app` desde la raíz del proyecto."),
    };

    // Parámetros del prompt
    const name = "init-object-metadata";
    const config = {
        title: "Inicializar metadatos de la extensión AL",
        description: "Obtiene los metadatos de la extensión AL. Sobreescribe los datos de la extensión AL anterior, si hubiera.",
        inputSchema: argsSchema,
    }

    server.registerTool(
        name,
        config,
        async (args): Promise<CallToolResult> => {
            let hasError = false;
            let response = "";

            try {
                // Combinar con los metadatos de la extensión actual
                const metadata = combineMetadata([JSON.parse(process.env.AL_METADATA || "{}"), readMetadata(args.app_route)]);

                // Guardar en el entorno
                process.env.AL_METADATA = JSON.stringify(metadata, null, 2);

                // Respuesta del servidor
                response = "Metadatos leídos exitosamente";
            }
            catch (error: any) {
                hasError = true;
                response = `Error al obtener los metadatos: ${error.message}`;
            }

            return {
                isError: hasError,
                content: [
                    {
                        type: "text",
                        text: "Metadatos leídos exitosamente",
                        annotations: {
                            audience: ["assistant"]                 // Solo visible para el agente
                        }
                    },
                ],
            };
        }
    );
};