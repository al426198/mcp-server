import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { __root } from "../../../../index.js";
import { listPageSchema } from "./json-schemas.js";

import Handlebars from "handlebars";
import fs from "fs/promises";
import path from "path";

/**
 * HU204: Generación de páginas de tipo List en lenguaje AL
 * 
 * Genera una página de tipo List en lenguaje AL.
 * 
 * @param id - ID del objeto.
 * @param name - Nombre del objeto.
 * @param properties - Propiedades clave-valor de la página (opcional).
 * @param repeaterName - Nombre del repeater.
 * @param repeaterProperties - Propiedades del repeater (opcional).
 * @param fields - Campos de la página.
 * @param parts - Partes de la página (opcional).
 * @param actions - Acciones de la página (opcional).
 * 
 * @returns La página AL generada.
 * @example
 * ```json
 * {
    id: 50100,
    name: "Customer List",
    sourceTable: "Customer",
    properties: {
        "Caption": "Customer",
        "UsageCategory": "Administration",
        "ApplicationArea": "All",
        "CardPageId": "Customer Card"
    },
    repeater: {
        name: "Customers",
        fields: [
            {
                name: "N.º",
                sourceField: "No."
            },
            {
                name: "Nombre",
                sourceField: "Name"
            },
            {
                name: "Cód. divisa",
                sourceField: "Currency Code"
            },
            {
                name: "Saldo (div. local)",
                sourceField: "Balance (LCY)"
            }
        ]
    }
}
 */
export const registerGenerateListPageTool = (server: McpServer) => {
    // Parámetros del prompt
    const name = "generate-list-page";
    const config = {
        title: "Generar página List AL",
        description: "Genera una página de tipo List en lenguaje AL.",
        inputSchema: listPageSchema,
    }

    server.registerTool(
        name,
        config,
        async (args): Promise<CallToolResult> => {
            try {
                // Lectura de la plantilla Handlebars
                const templateSource = await fs.readFile(path.join(__root, "src/templates/page-list.hbs"), "utf-8");
                const template = Handlebars.compile(templateSource);

                // Añadir propiedades por defecto
                const properties = args.properties || {};
                properties["PageType"] = "List";
                properties["SourceTable"] = args.sourceTable;

                // Generación de la página
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
                            text: `Error al generar la página List: ${error.message}`,
                        },
                    ],
                };
            }
        }
    );
};
