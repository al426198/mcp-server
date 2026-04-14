import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { readMetadataFolder, readMetadata, combineMetadata } from "../../utils/metadata.js";

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
        base_route: z.string().describe("Ruta al directorio que contiene los ficheros `.app`. Por defecto, la ruta es `./.alpackages` desde la raíz del proyecto."),
        app_route: z.string().describe("Ruta absoluta al fichero `.app` de la extensión AL. El nombre debería ser: `<publisher>_<name>_<version>.app` desde la raíz del proyecto."),
    };

    // Parámetros del prompt
    const name = "init-object-metadata";
    const config = {
        title: "Inicializar metadatos de la extensión base",
        description: "Obtiene los metadatos de la extensión AL base.",
        inputSchema: argsSchema,
    }

    server.registerTool(
        name,
        config,
        async (args): Promise<CallToolResult> => {
            // Obtener metadatos de la extensión base. Si no existen, leerlos de la carpeta `.alpackages`.
            let envMetadata = process.env.AL_METADATA ? JSON.parse(process.env.AL_METADATA) : readMetadataFolder(args.base_route);

            // Combinar con los metadatos de la extensión actual
            const metadata = combineMetadata([envMetadata, readMetadata(args.app_route)]);

            // Guardar los metadatos en el entorno
            process.env.AL_METADATA = JSON.stringify(metadata);

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(metadata, null, 2),
                        annotations: {
                            audience: ["assistant"]                 // Solo visible para el agente
                        }
                    },
                ],
            };
        }
    );
};