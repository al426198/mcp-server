import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";

/** Metadatos de tablas existentes en el archivo ".app" */
export type ObjectMap = Map<string, Map<string, any>>;

/** Nombre del fichero que contiene los símbolos dentro del .app */
const SYMBOL_FILE = "SymbolReference.json";

/** Categorías de objetos disponibles en AL, en este orden dentro del fichero de símbolos */
const CATEGORIES = [
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
 * Lee el fichero `.app` indicado, lo descomprime en memoria y extrae el contenido del fichero
 * `SymbolReference.json`, devolviendo sus categorías.
 *
 * @param appFilePath - Ruta absoluta o relativa al fichero `.app`.
 * @returns Un diccionario cuyas claves son los nombres de las tablas 
 *          y cuyos valores son listas de los campos de cada tabla.
 * @throws Si el fichero no existe, no contiene `SymbolReference.json`
 *          o el contenido de dicho fichero no es válido.
 */
export function extractAppSymbols(appFilePath: string): ObjectMap {
    // Abrir el archivo .app (es un archivo ZIP estándar)
    const zip = new AdmZip(appFilePath);

    // Obtener el fichero SymbolReference.json
    const entry = zip.getEntry(SYMBOL_FILE);
    if (!entry) {
        throw new Error(`No se encontró '${SYMBOL_FILE}' dentro de '${appFilePath}'.`);
    }

    // Leer y procesar el JSON (debe ser un objeto JSON)
    const json = JSON.parse(zip.readAsText(entry));
    if (typeof json !== "object" || json === null) {
        throw new Error(`El contenido de '${SYMBOL_FILE}' no es un objeto JSON válido.`);
    }

    // Construir el diccionario de objetos
    const result = new Map();
    for (const category of CATEGORIES) {
        const objects: any[] = json[category] || [];
        for (const obj of objects) {
            result.set(obj["Name"], parseObject(obj));
        }
    }

    return result;
}

/**
 * Procesa un objeto JSON correspondiente a un objeto AL.
 * Por ahora, devuelve el objeto completo.
 * @param obj - Objeto JSON
 * @returns Objeto AL
 */
function parseObject(obj: any): any {
    return JSON.parse(obj);
}

/**
 * Lee todos los ficheros `.app` de un directorio y extrae sus metadatos.
 * El directorio debería contener únicamente ficheros `.app`
 * (generalmente, suele llamarse `.alpackages` dentro de la extensión).
 * 
 * @param directoryPath - Ruta al directorio que contiene los ficheros `.app`.
 * @returns Un Map que combina todos los metadatos encontrados, organizados por categoría.
 */
export function readMetadata(directoryPath: string): ObjectMap {
    const combinedMetadata: ObjectMap = new Map();

    // Verificar que el directorio existe
    if (!fs.existsSync(directoryPath)) {
        throw new Error(`El directorio '${directoryPath}' no existe.`);
    }

    // Leer todos los ficheros .app del directorio
    const files = fs.readdirSync(directoryPath);
    const appFiles = files.filter(f => f.toLowerCase().endsWith(".app"));

    // Procesar cada fichero .app
    for (const file of appFiles) {
        const filePath = path.join(directoryPath, file);
        try {
            const appMetadata = extractAppSymbols(filePath);

            // Combinar con los metadatos existentes
            for (const [category, objects] of appMetadata) {
                if (!combinedMetadata.has(category)) {
                    combinedMetadata.set(category, new Map());
                }
                const combinedCategory = combinedMetadata.get(category)!;
                for (const [objName, fields] of objects) {
                    combinedCategory.set(objName, fields);
                }
            }
        } catch (error) {
            console.error(`Error procesando '${file}':`, error);
        }
    }

    return combinedMetadata;
}

