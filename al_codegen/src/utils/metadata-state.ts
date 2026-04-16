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
];

// Metadatos de tablas existentes
// Clave: nombre de la categoría del objeto ("Tables", "Pages", etc.)
// Valor: objeto JSON con los metadatos de cada objeto de esa categoría
export type ObjectMap = Record<string, Record<string, any>>;

// Almacena los metadatos de la extensión AL actual.
let metadata: ObjectMap = {};

/**
 * Obtiene los metadatos cargados en memoria.
 * @returns El mapa de metadatos.
 */
export function getMetadata(): ObjectMap {
    return metadata;
}

/**
 * Establece los metadatos globales.
 * @param newMetadata - El nuevo mapa de metadatos.
 */
export function setMetadata(newMetadata: ObjectMap): void {
    metadata = newMetadata;
}
