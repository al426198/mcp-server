import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { readMetadataFile, combineMetadata } from "../../utils/metadata-helpers.js";
import { getMetadata, setMetadata } from "../../utils/metadata-state.js";

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
    const name = "init-extension-metadata";
    const config = {
        title: "Inicializar metadatos de la extensión AL actual",
        description: "Inicializa los metadatos de la extensión AL actual. Se asume que los metadatos de la extensión base ya están inicializados.",
        inputSchema: argsSchema,
    }

    server.registerTool(
        name,
        config,
        async (args): Promise<CallToolResult> => {
            let hasError = false;
            let response = "";

            // Combinar metadatos de la extensión actual con los de la extensión base
            try {
                setMetadata(combineMetadata([getMetadata(), await readMetadataFile(args.app_route)]));
                response = "Metadatos leídos exitosamente";
            }
            catch (error: any) {
                hasError = true;
                response = `Error al obtener los metadatos: ${error.message}`;
            }

            // Respuesta del servidor
            return {
                isError: hasError,
                content: [
                    {
                        type: "text",
                        text: response,
                        annotations: {
                            audience: ["assistant"]                 // Solo visible para el agente
                        }
                    },
                ],
            };
        }
    );
};