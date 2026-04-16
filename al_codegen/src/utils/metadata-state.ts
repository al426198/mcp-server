// Categorías de objetos disponibles en AL existentes en el fichero de símbolos 
export const CATEGORIES = [
    "Tables",
    "Codeunits",
    "Pages",
    "TableExtensions",
    "Reports",
    "XmlPorts",
    "Queries",
    "ControlAddIns",
    "EnumTypes",
    "DotNetPackages",
    "Interfaces",
    "PermissionSets",
    "PermissionSetExtensions",
    "ReportExtensions",
    "InternalsVisibleToModules"
] as const;

// Tipo de las categorías de objetos AL
export type Category = typeof CATEGORIES[keyof typeof CATEGORIES];

/**
 * Metadatos de tablas existentes
 * 
 * - Clave: nombre de la categoría del objeto ("Tables", "Pages", etc.). Debe pertenecer a CATEGORIES.
 * - Valor: objeto JSON con los metadatos de cada objeto de esa categoría
 */
export type ObjectMap = Map<Category, Record<string, any>>;

/**
 * Almacena los metadatos de la extensión AL actual.
 */
let metadata: ObjectMap;

/**
 * Obtiene los metadatos cargados en memoria.
 * @returns El mapa de metadatos.
 */
export function getMetadata(): ObjectMap {
    return metadata || new Map<Category, Record<string, any>>();
}

/**
 * Establece los metadatos globales.
 * @param newMetadata - El nuevo mapa de metadatos.
 */
export function setMetadata(newMetadata: ObjectMap): void {
    metadata = newMetadata;
}
