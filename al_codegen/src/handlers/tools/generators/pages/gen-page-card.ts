import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { __root } from "../../../../index.js";
import { cardPageSchema } from "./json-schemas.js";

import Handlebars from "handlebars";
import fs from "fs/promises";
import path from "path";

/**
 * HU202: Generación de páginas de tipo Card en lenguaje AL
 * 
 * Genera una página de tipo Card en lenguaje AL.
 * 
 * @param id - ID del objeto.
 * @param name - Nombre del objeto.
 * @param sourceTable - Tabla de origen.
 * @param properties - Propiedades clave-valor de la página (opcional).
 * @param groups - Grupos de controles de la página.
 * @param actions - Acciones de la página (opcional).
 * 
 * @returns La página AL generada.
 * @example
 * ```json
 * {
 *   "id": 50100,
 *   "name": "Cliente",
 *   "sourceTable": "Customer",
 *   "properties": {
 *     "ApplicationArea": "All",
 *     "Caption": "Ficha Cliente",
 *     "UsageCategory": "None"
 *   },
 *   "groups": [
 *     {
 *       "name": "General",
 *       "fields": [
 *         {
 *           "name": "Nº Cliente",
 *           "source": "No."
 *         },
 *         {
 *           "name": "Nombre",
 *           "source": "Name"
 *         }
 *       ]
 *     }
 *   ],
 *   "parts": [
 *     {
 *       "name": "Foto",
 *       "source": "Customer Picture"
 *     }
 *   ],
 *   "actions": [
 *     {
 *       "name": "New",
 *       "properties": {
 *         "Caption": "'Nuevo pedido'",
 *         "Image": "NewDocument"
 *       }
 *     }
 *   ]
 * }
 * ```
 */
export const registerGenerateCardPageTool = (server: McpServer) => {
    // Parámetros del prompt
    const name = "generate-card-page";
    const config = {
        title: "Generar página AL tipo 'Card'",
        description: "Genera una página de tipo Card en lenguaje AL.",
        inputSchema: cardPageSchema,
    }

    server.registerTool(
        name,
        config,
        async (args): Promise<CallToolResult> => {
            try {
                // Lectura de la plantilla Handlebars
                const templateSource = await fs.readFile(path.join(__root, "src/templates/pages/page-card.hbs"), "utf-8");
                const template = Handlebars.compile(templateSource);

                // Añadir propiedades por defecto
                const properties = args.properties || {};
                properties["PageType"] = "Card";
                properties["SourceTable"] = args.sourceTable;

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
                            text: `Error al generar la página: ${error.message}`,
                        },
                    ],
                };
            }
        }
    );
};
