import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { saveFile } from "../../utils/save-file.js";
import { z } from "zod";
import { TYPES } from "../../index.js";

/**
 * Herramienta MCP para guardar el contenido de un objeto AL en un fichero.
 *
 * Busca recursivamente en `<AL_PROJECT_PATH>/src` un directorio con el nombre
 * del tipo pluralizado (p. ej. "tables", "pages"). Si no existe, lo crea bajo
 * `/src`. El fichero resultante tendrá el nombre `<name>.al`.
 *
 * - `type` - Tipo de objeto AL (p. ej. "Table", "Page").
 * - `name` - Nombre del objeto AL, que también será el nombre del fichero.
 * - `content` - Contenido AL a escribir en el fichero.
 *
 * @returns La ruta absoluta al fichero creado.
 */
export const registerSaveAlFileTool = (server: McpServer) => {
    const name = "save-al-file";
    const config = {
        title: "Guardar fichero AL",
        description:
            "Guarda el contenido de un objeto AL generado en un fichero `.al` dentro del proyecto. " +
            "Si no existe un directorio estándar para el tipo de objeto, lo crea. Devuelve la ruta absoluta al fichero creado.",
        inputSchema: {
            type: z.enum(TYPES).describe("Tipo de objeto AL."),
            name: z.string().describe("Nombre del objeto AL (sin extensión)."),
            content: z.string().describe("Contenido AL a guardar en el fichero."),
        },
    };

    server.registerTool(
        name,
        config,
        async (args): Promise<CallToolResult> => {
            const projectPath = process.env.AL_PROJECT_PATH;

            if (!projectPath) {
                return {
                    isError: true,
                    content: [
                        {
                            type: "text",
                            text: "Error: La variable de entorno AL_PROJECT_PATH no está definida.",
                        },
                    ],
                };
            }

            try {
                const filePath = saveFile(projectPath, args.type, args.name, args.content);
                return {
                    content: [
                        {
                            type: "text",
                            text: `Fichero guardado correctamente en: ${filePath}`,
                        },
                    ],
                };
            } catch (error: any) {
                return {
                    isError: true,
                    content: [
                        {
                            type: "text",
                            text: `Error al guardar el fichero: ${error.message}`,
                        },
                    ],
                };
            }
        }
    );
};
