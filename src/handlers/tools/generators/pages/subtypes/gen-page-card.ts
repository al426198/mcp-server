import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { cardPageSchema } from "../json-schemas.js";
import { BasePageGenerator } from "../gen-page.js";

class CardPageGenerator extends BasePageGenerator {
    name = "generate-card-page";
    title = "Generar página AL tipo 'Card'";
    description = "Genera una página de tipo Card en lenguaje AL.";
    inputSchema = cardPageSchema;
    pageType = "Card";
    defaultProperties = { "UsageCategory": "None" };
}

/**
 * HU202: Generación de páginas de tipo Card en lenguaje AL
 * 
 * Genera una página de tipo Card en lenguaje AL.
 * 
 * - `id` - ID del objeto.
 * - `name` - Nombre del objeto.
 * - `sourceTable` - Tabla de origen.
 * - `properties` - Propiedades clave-valor de la página (opcional).
 * - `groups` - Grupos de controles de la página.
 * - `actions` - Acciones de la página (opcional).
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
 *     "Caption": "Ficha Cliente"
 *   },
 *   "groups": [
 *     {
 *       "name": "General",
 *       "fields": [
 *         {
 *           "name": "Nº Cliente",
 *           "sourceField": "No."
 *         },
 *         {
 *           "name": "Nombre",
 *           "sourceField": "Name"
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
 *   "areas": [
 *     {
 *       "name": "Processing",
 *       "type": "area",
 *       "actions": [
 *        {
 *           "name": "New",
 *           "properties": {
 *             "Caption": "'Nuevo pedido'",
 *             "Image": "NewDocument"
 *           }
 *         }
 *       ],
 *      "groups": [
 *       {
 *           "name": "RelatedInformation",
 *           "actions": [
 *            {
 *               "name": "New",
 *               "properties": {
 *                 "Caption": "'Nuevo pedido'",
 *                 "Image": "NewDocument"
 *               }
 *             }
 *           ]
 *         }
 *      ]
 *     }
 *   ]
 * }
 * ```
 */
export const registerGenerateCardPageTool = (server: McpServer) => {
    new CardPageGenerator().registerPageTool(server);
};
