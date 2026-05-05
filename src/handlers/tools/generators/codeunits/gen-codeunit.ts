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
 * Genera una codeunit en lenguaje AL.
 *
 * El esquema JSON requerido es el siguiente:
 *   - `id` - ID del objeto.
 *   - `name` - Nombre del objeto.
 *   - `properties` - Propiedades clave-valor de la codeunit (opcional).
 *   - `procedures` - Lista de procedimientos de la codeunit (opcional).
 *      - `name` - Nombre del procedimiento.
 *      - `access` - Acceso del procedimiento.
 *      - `parameters` - Parámetros del procedimiento.
 *      - `returnType` - Tipo de retorno del procedimiento.
 *      - `variables` - Variables del procedimiento.
 *      - `body` - Cuerpo del procedimiento.
 *
 * @example
 * ```json
 * {
 *   "id": 50100,
 *   "name": "Ejemplo",
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
        description: "Genera una codeunit en lenguaje AL.",
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

                // Ordenamos los procedimientos alfabéticamente
                args.properties = Object.fromEntries(Object.entries(args.properties || {}).sort());

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
