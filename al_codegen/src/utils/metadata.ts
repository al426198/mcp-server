import AdmZip from "adm-zip";


/** Metadatos de tablas existentes en el archivo ".app" */
export type TableMap = Map<string, string[]>;

/** Nombre del fichero que contiene los símbolos dentro del .app */
const SYMBOL_FILE = "SymbolReference.json";

/**
 * Lee el fichero `.app` indicado, lo descomprime en memoria y extrae el contenido del fichero
 * `SymbolReference.json`, devolviendo sus categorías como un objeto `TableMap`.
 *
 * @param appFilePath - Ruta absoluta o relativa al fichero `.app`.
 * @returns Un diccionario cuyas claves son los nombres de las tablas 
 *          y cuyos valores son listas de los campos de cada tabla.
 * @throws Si el fichero no existe, no es un fichero válido o no contiene `SymbolReference.json`.
 */
export function extractAppSymbols(appFilePath: string): TableMap {

    // Abrir el archivo .app (es un archivo ZIP estándar)
    const zip = new AdmZip(appFilePath);
    const entry = zip.getEntry(SYMBOL_FILE);
    if (!entry) {
        throw new Error(
            `No se encontró '${SYMBOL_FILE}' dentro de '${appFilePath}'.`
        );
    }

    // Leer y parsear el JSON (debe ser un objeto JSON)
    const json = JSON.parse(zip.readAsText(entry));
    if (typeof json !== "object" || json === null) {
        throw new Error(`El contenido de '${SYMBOL_FILE}' no es un objeto JSON válido.`);
    }

    /*
    // Construir el diccionario de objetos
    const result: TableMap = new Map();
    const tableObjects: any[] = json["Tables"] || [];
    for (const obj of tableObjects) {
        result.set(obj["Name"], parseTable(obj));
    }
    */
    return json;
}
/*
// Helper para obtener los campos de una tabla
function parseTable(json: any): string[] {
    const fields: string[] = [];
    for (const field of json["Fields"] || []) {
        fields.push(field["Name"]);
    }
    return fields;
}
*/
