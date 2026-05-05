import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { listPageSchema } from "../json-schemas.js";
import { BasePageGenerator } from "../gen-page.js";

// Clase que encapsula las propiedades específicas de una página de tipo List.
class ListPageGenerator extends BasePageGenerator {
    name = "generate-list-page";
    title = "Generar página AL tipo 'List'";
    description = "Genera una página de tipo List en lenguaje AL.";
    inputSchema = listPageSchema;
    pageType = "List";
    defaultProperties = { "UsageCategory": "Lists" };
}

/**
 * HU204: Generación de páginas de tipo List en lenguaje AL
 * 
 * Genera una página de tipo List en lenguaje AL.
 * 
 * El esquema JSON requerido es el siguiente:
 * - `id` - ID del objeto.
 * - `name` - Nombre del objeto.
 * - `sourceTable` - Tabla de origen.
 * - `properties` - Propiedades clave-valor de la página (opcional).
 * - `repeaterName` - Nombre del repeater.
 * - `repeaterProperties` - Propiedades del repeater (opcional).
 * - `fields` - Campos de la página.
 *      - `name` - Nombre del campo.
 *      - `sourceField` - Campo de origen.
 * - `parts` - Partes de la página (opcional).
 *      - `name` - Nombre de la parte.
 *      - `source` - Tabla de origen de la parte.
 * - `actions` - Acciones de la página (opcional).
 *      - `name` - Nombre de la acción.
 *      - `properties` - Propiedades clave-valor de la acción (opcional).
 * 
 * @example
 * ```json
 * {
 *   "id": 50100,
 *   "name": "Customer List",
 *   "sourceTable": "Customer",
 *   "properties": {
 *     "Caption": "Customer",
 *     "UsageCategory": "Administration",
 *     "ApplicationArea": "All",
 *     "CardPageId": "Customer Card"
 *   },
 *   repeater: {
 *     "name": "Customers",
 *     "fields": [
 *       {
 *         "name": "N.º",
 *         "sourceField": "No."
 *       },
 *       {
 *         "name": "Nombre",
 *         "sourceField": "Name"
 *       },
 *       {
 *         "name": "Cód. divisa",
 *         "sourceField": "Currency Code"
 *       },
 *       {
 *         "name": "Saldo (div. local)",
 *         "sourceField": "Balance (LCY)"
 *       }
 *     ]
 *   }
 * }
 */
export const registerGenerateListPageTool = (server: McpServer) => {
    new ListPageGenerator().registerPageTool(server);
};
