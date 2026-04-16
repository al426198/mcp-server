import { ObjectMap } from "./metadata-helpers.js";

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
