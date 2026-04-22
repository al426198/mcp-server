import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiPageSchema } from "./json-schemas.js";
import { BasePageGenerator } from "./gen-page.js";

// Clase que encapsula las propiedades específicas de una página de tipo API.
class ApiPageGenerator extends BasePageGenerator {
    name = "generate-api-page";
    title = "Generar página AL tipo 'API'";
    description = "Genera una página de tipo API en lenguaje AL.";
    inputSchema = apiPageSchema;
    pageType = "API";
    defaultProperties = { "DelayedInsert": "true" };
}

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
    new ApiPageGenerator().registerPageTool(server);
};