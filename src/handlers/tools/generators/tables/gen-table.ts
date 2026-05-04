import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { ROOT } from "../../../../index.js";
import { tableSchema } from "./json-schemas.js";

import Handlebars from "handlebars";
import fs from "fs";
import path from "path";

/**
 * HU201: Generación de tablas en lenguaje AL
 * 
 * Genera una tabla en lenguaje AL. No soporta lógica compleja (ej. triggers).
 * Se deben comprobar las referencias a objetos AL externos antes de empezar a generar código.
 * 
 * @param id - ID del objeto.
 * @param name - Nombre del objeto.
 * @param properties - Propiedades clave-valor del objeto AL (opcional).
 * @param fields - Campos del objeto AL.
 * @param keys - Claves del objeto AL (opcional).
 * @param fieldGroups - Grupos de campos del objeto AL (opcional).
 * 
 * @returns La tabla AL generada.
 * @example
 * ```json
 * {
 *  "id": 50101,
 *  "name": "Customer",
 *  "properties": {
 *      "Caption": 'Cliente',
 *      "DataClassification": ToBeClassified
 *  },
 *  "fields": [
 *      {
 *          "id": 1,
 *          "name": "No.",
 *          "type": "Code",
 *          "length": 20,
 *          "properties": {
 *              "Caption": "N.º"
 *          }
 *      }
 *  ],
 *  "keys": [
 *      {
 *          "name": "Primary Key",
 *          "fieldNames": ["No."],
 *          "clustered": true
 *      }
 *  ],
 *  "fieldGroups": [
 *      {
 *          "type": "DropDown",
 *          "fieldNames": ["No."]
 *      }
 *  ]
 * }
 * ```
 */
export const registerGenerateTableTool = (server: McpServer) => {
    // Parámetros del prompt
    const name = "generate-table";
    const config = {
        title: "Generar tabla AL",
        description: "Genera una tabla en lenguaje AL.",
        inputSchema: tableSchema,
    }

    server.registerTool(
        name,
        config,
        async (args): Promise<CallToolResult> => {
            try {
                // Lectura de la plantilla Handlebars
                const templateSource = fs.readFileSync(path.join(ROOT, "src/templates/tables/table.hbs"), "utf-8");
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
                            text: `Error al generar la tabla: ${error.message}`,
                        },
                    ],
                };
            }
        }
    );
};