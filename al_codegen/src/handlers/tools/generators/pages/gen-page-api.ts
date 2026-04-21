import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { __root } from "../../../../index.js";
import { apiPageSchema } from "./json-schemas.js";

import Handlebars from "handlebars";
import fs from "fs/promises";
import path from "path";

/**
 * HU205: Generación de páginas de tipo API en lenguaje AL
 * 
 * Genera una página de tipo API en lenguaje AL.
 * 
 * @param id - ID del objeto.
 * @param name - Nombre del objeto.
 * @param sourceTable - Tabla de origen.
 * @param apiGroup - Grupo de la API.
 * @param apiPublisher - Publicador de la API.
 * @param apiVersion - Versión de la API.
 * @param entityName - Nombre de la entidad.
 * @param entitySetName - Nombre del conjunto de entidades.
 * @param odataKeyFields - Campos clave de OData.
 * @param properties - Propiedades clave-valor de la página (opcional).
 * @param repeater - Repetidor de la página.
 * 
 * @returns La página AL generada.
 * 
 * @example
 * ```json
 * {
 *   "id": 50100,
 *   "name": "Customer API Page",
 *   "sourceTable": "Customer",
 *   "apiGroup": "Sales",
 *   "apiPublisher": "MyCompany",
 *   "apiVersion": "1.0",
 *   "entityName": "Customer",
 *   "entitySetName": "Customers",
 *   "odataKeyFields": "SystemId"
 * }
 * ```
 */
export const registerGenerateApiPageTool = (server: McpServer) => {
    // Parámetros del prompt
    const name = "generate-api-page";
    const config = {
        title: "Generar página API AL",
        description: "Genera una página de tipo API en lenguaje AL.",
        inputSchema: apiPageSchema,
    }

    server.registerTool(
        name,
        config,
        async (args): Promise<CallToolResult> => {
            try {
                // Lectura de la plantilla Handlebars
                const templateSource = await fs.readFile(path.join(__root, "src/templates/page-api.hbs"), "utf-8");
                const template = Handlebars.compile(templateSource);

                // Añadir propiedades por defecto
                const properties = args.properties || {};
                properties["SourceTable"] = args.sourceTable;
                properties["PageType"] = "API";
                properties["DelayedInsert"] = "true";
                properties["APIGroup"] = args.apiGroup;
                properties["APIPublisher"] = args.apiPublisher;
                properties["APIVersion"] = args.apiVersion;
                properties["EntityName"] = args.entityName;
                properties["EntitySetName"] = args.entitySetName;
                properties["ODataKeyFields"] = args.odataKeyFields;

                // Generación de la página
                return {
                    content: [
                        {
                            type: "text",
                            text: template({ ...args, properties }),
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
                            text: `Error al generar la página API: ${error.message}`,
                        },
                    ],
                };
            }
        }
    );
};
