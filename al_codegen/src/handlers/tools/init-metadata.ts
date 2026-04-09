import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { readMetadata } from "../../utils/metadata.js";


/**
 * Obtiene los metadatos generales de BC.
 * Debe ejecutarse una vez tras iniciar el servidor.
 * @param server - Instancia del servidor MCP
 */
export const registerInitMetadataTool = (server: McpServer) => {
    // Esquema JSON de validación de argumentos
    const argsSchema = {
        ruta: z.string().describe("Ruta al directorio que contiene los ficheros .app"),
    };

    // Parámetros del prompt
    const name = "init-metadata";
    const config = {
        title: "Obtener esquema de objeto AL",
        description: "Obtiene el esquema de un objeto de la extensión AL actual",
        argsSchema: argsSchema,
    }

    server.registerTool(
        name,
        config,
        async (args): Promise<CallToolResult> => {
            try {
                const metadata = readMetadata(args.name);
                return {
                    content: {
                        kind: "text",
                        text: JSON.stringify(metadata, null, 2),
                    },
                };
            } catch (error) {
                return {
                    content: {
                        kind: "text",
                        text: `Error: ${error}`,
                    },
                };
            }
        }
    );
};