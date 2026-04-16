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

/**
 * Recorre `node` (y todos sus Namespaces anidados) de forma recursiva y
 * acumula los objetos de Tables y Pages en `result`.
 *
 * La clave del Map es `"<Kind>:<Name>"`, por ejemplo `"Table:Customer"`.
 * Si existiera colisión de nombres (mismo nombre en distintos namespaces),
 * se puede cambiar la clave por `"<Kind>:<Id>"` o incluir la ruta completa.
 */
export function collectObjects(node: any, result: Record<string, any> = {}): Record<string, any> {
    for (const cat of CATEGORIES) {
        if (Array.isArray(node[cat])) {
            for (const obj of node[cat]) {
                result[obj.Name] = obj;
            }
        }
    }

    // Descender recursivamente en los Namespaces hijos
    if (Array.isArray(node.Namespaces)) {
        for (const child of node.Namespaces) {
            collectObjects(child, result);
        }
    }

    return result;
}
