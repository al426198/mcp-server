import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { ROOT } from "../../../../index.js";
import { codeunitSchema } from "./json-schemas.js";

import Handlebars from "handlebars";
import fs from "fs";
import path from "path";

/**
 * HU205: Generación de codeunits en lenguaje AL
 *
 * Genera una codeunit en lenguaje AL. Soporta procedimientos con parámetros,
 * variables locales, tipo de retorno y modificadores de acceso, así como el
 * trigger OnRun.
 *
 * No soporta lógica compleja (ej. triggers de procedimiento).
 * Se deben comprobar las referencias a objetos AL externos antes de generar código.
 *
 * @param id - ID del objeto.
 * @param name - Nombre del objeto.
 * @param properties - Propiedades clave-valor de la codeunit (opcional).
 * @param procedures - Lista de procedimientos de la codeunit (opcional).
 * @param onRun - Líneas del cuerpo del trigger OnRun (opcional).
 *
 * @returns La codeunit AL generada.
 * @example
 * ```json
 * {
 *   "id": 50100,
 *   "name": "My Codeunit",
 *   "properties": {
 *     "SingleInstance": "true"
 *   },
 *   "procedures": [
 *     {
 *       "name": "DoSomething",
 *       "access": "local",
 *       "parameters": [
 *         { "name": "CustomerNo", "type": "Code", "length": 20 },
 *         { "name": "Amount", "type": "Decimal", "isVar": true }
 *       ],
 *       "returnType": "Boolean",
 *       "variables": [
 *         { "name": "Customer", "type": "Record \"Customer\"" }
 *       ],
 *       "body": "if not Customer.Get(CustomerNo) then\n\texit(false);\n\texit(true);"
 *     }
 *   ]
 * }
 * ```
 */
export const registerGenerateCodeunitTool = (server: McpServer) => {
    const name = "generate-codeunit";
    const config = {
        title: "Generar codeunit AL",
        description: "Genera una codeunit en lenguaje AL con sus procedimientos y trigger OnRun.",
        inputSchema: codeunitSchema,
    };

    server.registerTool(
        name,
        config,
        async (args): Promise<CallToolResult> => {
            try {
                // Lectura de la plantilla Handlebars
                const templateSource = fs.readFileSync(path.join(ROOT, "src/templates/codeunits/codeunit.hbs"), "utf-8");
                const template = Handlebars.compile(templateSource);

                // Generación de la codeunit
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
                            text: `Error al generar la codeunit: ${error.message}`,
                        },
                    ],
                };
            }
        }
    );
};
