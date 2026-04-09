import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { readMetadata } from "../../utils/metadata.js";


/**
 * Obtiene los metadatos generales de BC.
 * Debe ejecutarse una vez tras iniciar el servidor.
 * 
 * @param route - Ruta al directorio que contiene los ficheros .app
 */
export const registerInitMetadataTool = (server: McpServer) => {
    // Esquema JSON de validación de argumentos
    const argsSchema = {
        route: z.string().describe("Ruta al directorio que contiene los ficheros .app"),
    };

    // Parámetros del prompt
    const name = "init-metadata";
    const config = {
        title: "Inicializar metadatos",
        description: "Obtiene los metadatos generales de BC. Se asume que todas las extensiones de BC comparten estos archivos.",
        inputSchema: argsSchema,
    }

    server.registerTool(
        name,
        config,
        async (args): Promise<CallToolResult> => {
            try {
                const metadata = readMetadata(args.route);
                return {
                    content: [
                        {
                            type: "text",
                            text: `Metadatos obtenidos correctamente`,
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error: ${error}`,
                        },
                    ],
                };
            }
        }
    );
};