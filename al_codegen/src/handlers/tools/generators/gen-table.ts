import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { __root } from "../../../index.js";

import Handlebars from "handlebars";
import fs from "fs/promises";
import path from "path";

// Tipos de grupos de campos que soporta AL
const FG_TYPES = ["DropDown", "Brick"];

// Esquema de validación de campos
const fieldSchema = z.object({
    id: z.number().describe("ID del campo. Debe ser único dentro de la tabla."),
    name: z.string().describe("Nombre del campo."),
    type: z.string().describe("Tipo del campo."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades clave-valor del campo.")
});

// Esquema de validación de claves
const keySchema = z.object({
    name: z.string().describe("Nombre de la clave."),
    fieldNames: z.array(z.string()).describe("Nombres de los campos de la clave."),
    clustered: z.boolean().default(false).describe("Indica si la clave es agrupada.")
});

// Esquema de validación de grupos de campos
const fieldGroupSchema = z.object({
    type: z.enum(FG_TYPES).describe("Tipo del grupo de campos. Solo funciona DropDown."),
    fieldNames: z.array(z.string()).describe("Nombres de los campos del grupo.")
});


/**
 * HU201: Generación de tablas en lenguaje AL 
 * Genera una tabla en lenguaje AL. No soporta lógica compleja (ej. triggers).
 * 
 * @param id - ID del objeto. Debe ser único dentro de la extensión AL actual.
 * @param name - Nombre del objeto. Debe ser único dentro de la extensión AL actual.
 * @param properties - Propiedades clave-valor del objeto AL (opcional).
 * @param fields - Campos del objeto AL.
 * @param keys - Claves del objeto AL (opcional).
 * @param fieldGroups - Grupos de campos del objeto AL (opcional).
 * 
 * @returns La tabla AL generada.
 * @example
 * ```json
 * {
 *  "id": 1,
 *  "name": "Customer",
 *  "properties": {
 *      "Caption": "Cliente"
 *      "DataClassification": "ToBeClassified"
 *  },
 *  "fields": [
 *      {
 *          "id": 1,
 *          "name": "No.",
 *          "type": "Code",
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
    // Esquema JSON de validación de argumentos
    const argsSchema = {
        id: z.number().describe("ID del objeto. Debe ser único dentro de la extensión AL actual."),
        name: z.string().describe("Nombre del objeto. Debe ser único dentro de la extensión AL actual."),
        properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades clave-valor del objeto AL (opcional)."),
        fields: z.array(fieldSchema).describe("Campos del objeto AL."),
        keys: z.array(keySchema).default([]).optional().describe("Claves del objeto AL (opcional)."),
        fieldGroups: z.array(fieldGroupSchema).default([]).optional().describe("Grupos de campos del objeto AL (opcional).")
    };

    // Parámetros del prompt
    const name = "generate-table";
    const config = {
        title: "Generar tabla AL",
        description: "Genera una tabla en lenguaje AL. No soporta lógica compleja (ej. triggers)",
        inputSchema: argsSchema,
    }

    server.registerTool(
        name,
        config,
        async (args): Promise<CallToolResult> => {
            try {
                // Lectura de la plantilla Handlebars
                const templateSource = await fs.readFile(path.join(__root, "/templates/table.hbs"), "utf-8");
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