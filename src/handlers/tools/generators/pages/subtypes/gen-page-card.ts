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
 * El esquema JSON requerido es el siguiente:
 * - `id` - ID del objeto.
 * - `name` - Nombre del objeto.
 * - `sourceTable` - Tabla de origen.
 * - `properties` - Propiedades clave-valor de la página (opcional).
 * - `groups` - Grupos de controles de la página.
 *  - `name` - Nombre del grupo.
 *  - `fields` - Campos del grupo.
 *   - `name` - Nombre del campo.
 *   - `sourceField` - Campo de origen.
 * - `parts` - Partes de la página (opcional).
 *  - `name` - Nombre de la parte.
 *  - `source` - Tabla de origen de la parte.
 * - `actions` - Acciones de la página (opcional).
 * - `areas` - Áreas de la página (opcional).
 *  - `name` - Nombre del área.
 *  - `type` - Tipo del área.
 *  - `actions` - Acciones del área (opcional).
 *  - `groups` - Grupos del área (opcional).
 *   - `name` - Nombre del grupo.
 *   - `actions` - Acciones del grupo (opcional).
 * 
 * @returns La página AL generada.
 * 
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
