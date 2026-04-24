import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { __root } from "../../../../index.js";
import { pageExtensionSchema } from "./json-schemas.js";

import Handlebars from "handlebars";
import fs from "fs";
import path from "path";

/**
 * HU207: Generación de extensiones de página en lenguaje AL
 *
 * Genera una extensión de página (pageextension) en lenguaje AL.
 *
 * @param id      - ID del objeto. Debe obtenerse con la herramienta 'assign-id'.
 * @param name    - Nombre del objeto de extensión.
 * @param target  - Nombre de la página base a extender.
 * @param layout  - Lista de bloques de cambio en el layout (opcional).
 * @param actions - Lista de bloques de cambio en las acciones (opcional).
 *
 * @returns La extensión de página AL generada.
 *
 * @example
 * ```json
 * {
 *   "id": 50101,
 *   "name": "MyExtension",
 *   "target": "340 Declaration Lines",
 *   "layoutChanges": [
 *     {
 *       "operation": "addafter",
 *       "anchor": "Customer/Vendor No.",
 *       "changes": [
 *         {
 *           "name": "Campo nuevo",
 *           "sourceField": "Campo nuevo",
 *           "properties": { "Caption": "'Campo nuevo'" }
 *         }
 *       ]
 *     },
 *     {
 *       "operation": "modify",
 *       "anchor": "EC %",
 *       "properties": { "Caption": "'EC %'" }
 *     },
 *     {
 *       "operation": "moveafter",
 *       "anchor": "Customer/Vendor No.",
 *       "control": "Campo nuevo"
 *     }
 *   ],
 *   "actionChanges": [
 *     {
 *       "operation": "addlast",
 *       "anchor": "Processing",
 *       "changes": [
 *         {
 *           "name": "MyGroup",
 *           "properties": {
 *             "Caption": "'Mi grupo'"
 *           },
 *           "actions": [
 *             {
 *               "name": "MyAction",
 *               "properties": {
 *                 "Caption": "'Mi acción'",
 *                 "Image": "NewDocument",
 *                 "ApplicationArea": "All"
 *               }
 *             }
 *           ]
 *         }
 *       ]
 *     },
 *     {
 *       "operation": "modify",
 *       "anchor": "MyAction",
 *       "properties": {
 *           "Visible": "false"
 *       }
 *     },
 *     {
 *       "operation": "moveafter",
 *       "anchor": "MyGroup",
 *       "target": "MyAction"
 *     }
 *   ]
 * }
 * ```
 */
export const registerGeneratePageExtensionTool = (server: McpServer) => {
    const toolName = "generate-page-extension";
    const config = {
        title: "Generar extensión de página AL",
        description: "Genera una extensión de página (pageextension)en lenguaje AL.",
        inputSchema: pageExtensionSchema,
    };

    server.registerTool(
        toolName,
        config,
        async (args: any): Promise<CallToolResult> => {
            try {
                // Lectura de la plantilla Handlebars
                const templateSource = fs.readFileSync(path.join(__root, "src/templates/pages/pageext.hbs"), "utf-8");
                const template = Handlebars.compile(templateSource);

                // Generación de la extensión de página
                return {
                    content: [
                        {
                            type: "text",
                            text: template(args),
                        },
                    ],
                };
            }

            catch (error: any) {
                return {
                    isError: true,
                    content: [
                        {
                            type: "text",
                            text: `Error al generar la extensión de página: ${error.message}`,
                        },
                    ],
                };
            }
        }
    );
};
