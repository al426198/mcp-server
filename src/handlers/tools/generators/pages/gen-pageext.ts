import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { ROOT } from "../../../../index.js";
import { pageExtensionSchema } from "./json-schemas.js";

import Handlebars from "handlebars";
import fs from "fs";
import path from "path";

/**
 * HU207: Generación de extensiones de página en lenguaje AL
 *
 * Genera una extensión de página (pageextension) en lenguaje AL.
 *
 * - `id` - ID del objeto. Debe obtenerse con la herramienta 'assign-id'.
 * - `name` - Nombre del objeto de extensión.
 * - `target` - Nombre de la página base a extender.
 * - `layoutChanges` - Lista de bloques de cambio en el layout (opcional).
 *  - `operation` - Tipo de operación a realizar.
 *  - `anchor` - Pivote de la operación.
 *  - `changes` - Cambios a realizar. Solo permitido en operaciones "add*" (addfirst, addlast, addafter, addbefore).
 *  - `properties` - Propiedades clave-valor del elemento pivote (opcional). Solo permitido en operaciones "modify".
 *  - `control` - Nombre del elemento a mover. Solo permitido en operaciones "move*" (movefirst, movelast, moveafter, movebefore).
 * - `actionChanges` - Lista de bloques de cambio en las acciones (opcional).
 *  - `operation` - Operación a realizar.
 *  - `anchor` - Pivote de la operación.
 *  - `changes` - Cambios a realizar. Solo permitido en operaciones "add*" (addfirst, addlast, addafter, addbefore).
 *  - `properties` - Propiedades clave-valor del elemento pivote (opcional). Solo permitido en operaciones "modify".
 *  - `control` - Nombre del elemento a mover. Solo permitido en operaciones "move*" (movefirst, movelast, moveafter, movebefore).
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
                const templateSource = fs.readFileSync(path.join(ROOT, "src/templates/pages/pageext.hbs"), "utf-8");
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
