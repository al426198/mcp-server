import { CATEGORIES } from "./metadata-state.js";

/**
 * Recorre `node` (y todos sus Namespaces anidados) de forma recursiva y
 * acumula los objetos en `result`.
 * 
 * @param node - Nodo del árbol de metadatos.
 * @param result - Diccionario donde se almacenan los objetos.
 * @returns Diccionario con los objetos recolectados.
 */
export function collectObjects(node: any, result: Record<string, Record<string, any>>): Record<string, Record<string, any>> {
    for (const cat of CATEGORIES) {
        if (Array.isArray(node[cat])) {
            result[cat] ||= {};
            for (const obj of node[cat]) {
                result[cat][obj.Name] = obj;
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
