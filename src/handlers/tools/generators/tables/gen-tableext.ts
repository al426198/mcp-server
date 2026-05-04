import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { ROOT } from "../../../../index.js";
import { tableExtensionSchema } from "./json-schemas.js";

import Handlebars from "handlebars";
import fs from "fs";
import path from "path";

/**
 * HU206: Generación de extensiones de tabla en lenguaje AL
 * 
 * Genera una extensión de tabla en lenguaje AL.
 * 
 * - `id` - ID del objeto. Debe ser único dentro de la extensión AL actual.
 * - `name` - Nombre del objeto. Debe ser único dentro de la extensión AL actual.
 * - `target` - Nombre de la tabla base a extender. Debe existir en la extensión AL actual.
 * - `properties` - Propiedades clave-valor del objeto AL (opcional).
 * - `fields` - Campos del objeto AL a añadir o modificar (opcional).
 *  - `id` - ID del campo.
 *  - `name` - Nombre del campo.
 *  - `type` - Tipo del campo.
 *  - `length` - Longitud del campo.
 *  - `properties` - Propiedades clave-valor del campo (opcional).
 * - `fieldGroups` - Grupos de campos del objeto AL a añadir (opcional).
 *  - `type` - Tipo del grupo de campos.
 *  - `fieldNames` - Campos del grupo de campos.
 * 
 * @returns La extensión de tabla AL generada.
 * 
 * @example
 * ```json
 * {
 *  "id": 50101,
 *  "name": "Customer Extension",
 *  "target": "Customer",
 *  "properties": {
 *      "Caption": 'Cliente',
 *      "DataClassification": ToBeClassified
 *  },
 *  "fields": [
 *      {
 *          "id": 50100,
 *          "name": "Ejemplo",
 *          "type": "Text",
 *          "length": 100,
 *          "properties": {
 *              "Caption": "Campo nuevo"
 *          }
 *      },
 *      {
 *          "name": "No.",
 *          "properties": {
 *              "Caption": "N.º"
 *          }
 *      }
 *  ],
 *  "fieldGroups": [
 *      {
 *          "type": "DropDown",
 *          "fieldNames": ["Ejemplo"]
 *      }
 *   ]
 * }
 * ```
 */
export const registerGenerateTableExtensionTool = (server: McpServer) => {
    // Parámetros del prompt
    const name_ext = "generate-table-extension";
    const config_ext = {
        title: "Generar extensión de tabla AL",
        description: "Genera una extensión de tabla (tableextension) en lenguaje AL.",
        inputSchema: tableExtensionSchema,
    }

    server.registerTool(
        name_ext,
        config_ext,
        async (args): Promise<CallToolResult> => {
            try {
                // Lectura de la plantilla Handlebars
                const templateSource = fs.readFileSync(path.join(ROOT, "src/templates/tables/tableext.hbs"), "utf-8");
                const template = Handlebars.compile(templateSource);

                // Generación de la tabla
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
                            text: `Error al generar la extensión de tabla: ${error.message}`,
                        },
                    ],
                };
            }
        }
    );
};