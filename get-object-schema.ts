import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { readMetadata } from "../../utils/metadata.js";


/**
 * HU101: Acceso al esquema de un objeto BC
 * 
 * Obtiene el esquema de un objeto de la extensión AL actual.
 * @param server - Instancia del servidor MCP
 */
export const registerGetObjectSchemaTool = (server: McpServer) => {
    // Esquema JSON de validación de argumentos
    const argsSchema = {
        name: z.string().describe("Nombre del objeto"),
    };

    // Parámetros del prompt
    const name = "get-object-schema";
    const config = {
        title: "Obtener esquema de objeto AL",
        description: "Obtiene el esquema de un objeto de la extensión AL actual",
        argsSchema: argsSchema,
    }

    server.registerTool(
        name,
        config,
        async (args): Promise<CallToolResult> => {
            return {
                content: [
                    {
                        type: "text",
                        text: "",
                    },
                ],
            };
        }
    );
};