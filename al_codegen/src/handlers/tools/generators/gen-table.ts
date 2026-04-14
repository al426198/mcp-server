import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import Handlebars from "handlebars";
import fs from "fs/promises";
import { __root } from "../../../index.js";
import path from "path";


// Esquema de validación de campos
const fieldSchema = z.object({
    id: z.number().describe("ID del campo. Debe ser único dentro de la tabla."),
    name: z.string().describe("Nombre del campo."),
    type: z.string().describe("Tipo del campo."),
    properties: z.record(z.string(), z.string()).optional().describe("Propiedades clave-valor del campo.")
});

// Esquema de validación de claves
const keySchema = z.object({
    name: z.string().describe("Nombre de la clave."),
    fieldNames: z.array(z.string()).describe("Nombres de los campos de la clave."),
    clustered: z.boolean().default(false).describe("Indica si la clave es agrupada.")
});

// Esquema de validación de grupos de campos
const fieldGroupSchema = z.object({
    name: z.string().describe("Nombre del grupo de campos."),
    fieldNames: z.array(z.string()).describe("Nombres de los campos del grupo.")
});


/**
 * HU201: Generación de tablas en lenguaje AL 
 * Genera una tabla en lenguaje AL. No soporta lógica compleja (ej. triggers).
 * 
 * @param id - ID del objeto. Debe ser único dentro de la extensión AL actual.
 * @param name - Nombre del objeto. Debe ser único dentro de la extensión AL actual.
 * @param properties - Propiedades clave-valor del objeto AL.
 * @param fields - Campos del objeto AL.
 * @param keys - Claves del objeto AL.
 * @param fieldGroups - Grupos de campos del objeto AL.
 * 
 * @returns La tabla AL generada.
 * @example
 * ```json
 * {
 *  "id": 1,
 *  "name": "Customer",
 *  "properties": {
 *      "Caption": "Customer"
 *  },
 *  "fields": [
 *      {
 *          "id": 1,
 *          "name": "No.",
 *          "type": "Code",
 *          "properties": {
 *              "Caption": "No."
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
 *          "name": "General",
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
        properties: z.record(z.string(), z.string()).optional().describe("Propiedades clave-valor del objeto AL."),
        fields: z.array(fieldSchema).describe("Campos del objeto AL."),
        keys: z.array(keySchema).describe("Claves del objeto AL."),
        fieldGroups: z.array(fieldGroupSchema).describe("Grupos de campos del objeto AL.")
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
            // Transform properties from record to array of {key, value} for the template
            const transformProperties = (props?: Record<string, string>) => {
                if (!props) return [];
                return Object.entries(props).map(([key, value]) => ({ key, value }));
            };

            const data = {
                ...args,
                properties: transformProperties(args.properties as Record<string, string>),
                fields: (args.fields as any[]).map(f => ({
                    ...f,
                    properties: transformProperties(f.properties)
                })),
                fieldGroups: args.fieldGroups // Asegurar que coincide con la plantilla
            };

            try {
                // Lectura de la plantilla
                const templatePath = path.join(__root, "/templates/table.hbs");
                const templateSource = await fs.readFile(templatePath, "utf-8");
                const template = Handlebars.compile(templateSource);

                const result = template(data);

                return {
                    content: [
                        {
                            type: "text",
                            text: result,
                        },
                    ],
                };
            } catch (error: any) {
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