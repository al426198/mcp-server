import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { listPageSchema } from "./json-schemas.js";
import { BasePageGenerator } from "./gen-page.js";

// Clase que encapsula las propiedades específicas de una página de tipo List.
class ListPageGenerator extends BasePageGenerator {
    name = "generate-list-page";
    title = "Generar página AL tipo 'List'";
    description = "Genera una página de tipo List en lenguaje AL.";
    inputSchema = listPageSchema;
    templatePath = "src/templates/pages/page-list.hbs";
    pageType = "List";
    defaultProperties = { "UsageCategory": "Lists" };
}

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
    "id": 50100,
    "name": "Customer List",
    "sourceTable": "Customer",
    "properties": {
        "Caption": "Customer",
        "UsageCategory": "Administration",
        "ApplicationArea": "All",
        "CardPageId": "Customer Card"
    },
    repeater: {
        "name": "Customers",
        "fields": [
            {
                "name": "N.º",
                "sourceField": "No."
            },
            {
                "name": "Nombre",
                "sourceField": "Name"
            },
            {
                "name": "Cód. divisa",
                "sourceField": "Currency Code"
            },
            {
                "name": "Saldo (div. local)",
                "sourceField": "Balance (LCY)"
            }
        ]
    }
}
 */
export const registerGenerateListPageTool = (server: McpServer) => {
    new ListPageGenerator().registerPageTool(server);
};
