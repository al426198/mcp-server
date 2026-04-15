import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { streamObject } from "stream-json/streamers/stream-object.js";

// Metadatos de tablas existentes en el archivo ".app" 
export type ObjectMap = Record<string, Record<string, any>>;

// Nombre del fichero que contiene los símbolos dentro del .app 
const SYMBOL_FILE = "SymbolReference.json";

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
 * Lee el fichero `.app` indicado, lo descomprime en memoria y extrae el contenido del fichero
 * `SymbolReference.json`, devolviendo sus categorías.
 *
 * @param appFilePath - Ruta absoluta o relativa al fichero `.app`.
 * @returns Un diccionario cuyas claves son los nombres de las tablas 
 *          y cuyos valores son listas de los campos de cada tabla.
 * @throws Si el fichero no existe, no contiene `SymbolReference.json`
 *          o el contenido de dicho fichero no es válido.
 */
async function extractAppSymbols(appFilePath: string): Promise<ObjectMap> {
    // Recortar el fichero `.app` a partir de la cabecera ZIP (0x50 0x4B 0x03 0x04)
    const rawBuffer = fs.readFileSync(appFilePath);
    const zipOffset = rawBuffer.indexOf(Buffer.from([0x50, 0x4B, 0x03, 0x04]));
    if (zipOffset === -1) {
        throw new Error(`No se encontró la cabecera esperada en '${appFilePath}'.`);
    }
    const zip = new AdmZip(rawBuffer.subarray(zipOffset));

    // Obtener el fichero SymbolReference.json
    const symbolFile = zip.getEntry(SYMBOL_FILE);
    if (!symbolFile) {
        throw new Error(`No se encontró '${SYMBOL_FILE}' dentro de '${appFilePath}'.`);
    }

    // SymbolReference.json está codificado en UTF-8 con BOM.
    // Omitir los 3 bytes de BOM y parsear el buffer mediante streaming para evitar
    // truncaciones con ficheros grandes.
    const jsonBuffer = symbolFile.getData().subarray(3);
    const jsonStream = Readable.from(jsonBuffer)
        .pipe(streamObject.withParserAsStream());

    const json: Record<string, any> = {};
    await new Promise<void>((resolve, reject) => {
        jsonStream.on("data", ({ key, value }: { key: string; value: any }) => {
            json[key] = value;
        });
        jsonStream.on("end", resolve);
        jsonStream.on("error", reject);
    });


    if (typeof json !== "object" || json === null) {
        throw new Error(`El contenido de '${SYMBOL_FILE}' no es un objeto JSON válido.`);
    }

    // Construir el diccionario de objetos
    const result: ObjectMap = {};
    for (const category of CATEGORIES) {
        const objects: any[] = json[category] || [];
        const categoryObjects = Object.fromEntries(objects.map((obj: any) => [obj["Name"], parseObject(obj)]));
        result[category] = categoryObjects;
    }

    return result;
}


/**
 * Procesa un objeto JSON deserializado correspondiente a un objeto AL.
 * Por ahora, devuelve el objeto en sí, pero se puede acceder a cualquiera de sus propiedades.
 * @param obj - Objeto JSON
 * @returns El mismo objeto
 */
function parseObject(obj: Record<string, unknown>): Record<string, unknown> {
    return obj;
}

/**
 * Lee un fichero `.app` y extrae sus metadatos.
 * 
 * @param filePath - Ruta al fichero `.app`.
 * @returns Un Map que contiene los metadatos del fichero `.app`, organizados por categoría.
 */
export async function readMetadataFile(filePath: string): Promise<ObjectMap> {
    // Verificar que el fichero existe
    if (!fs.existsSync(filePath)) {
        throw new Error(`El fichero '${filePath}' no existe.`);
    }

    // Leer el fichero app
    try {
        return await extractAppSymbols(filePath);
    } catch (error: any) {
        throw new Error(`Error procesando el fichero '${filePath}': ${error.message}`);
    }
}

/**
 * Lee todos los ficheros `.app` de un directorio y extrae sus metadatos.
 * El directorio debería contener únicamente ficheros `.app`.
 * 
 * @param directoryPath - Ruta al directorio que contiene los ficheros `.app`.
 * @returns Un Map que combina todos los metadatos encontrados, organizados por categoría.
 */
export async function readMetadataFolder(directoryPath: string): Promise<ObjectMap> {
    // Verificar que el directorio existe
    if (!fs.existsSync(directoryPath)) {
        throw new Error(`El directorio '${directoryPath}' no existe.`);
    }

    // Leer todos los ficheros `.app` del directorio
    const files = fs.readdirSync(directoryPath);
    const appFiles = files.filter(f => f.toLowerCase().endsWith(".app"));

    // Procesar cada fichero `.app`
    const metadataList: ObjectMap[] = await Promise.all(appFiles.map(async (file) => {
        const filePath = path.join(directoryPath, file);
        try {
            // Combinar los metadatos del fichero `.app` con los metadatos existentes
            return await readMetadataFile(filePath);
        } catch (error: any) {
            throw new Error(`Error procesando el fichero '${filePath}': ${error.message}`);
        }
    }));
    return combineMetadata(metadataList);
}

/**
 * Combina varios mapas de metadatos en uno solo.
 * 
 * @param maps - Array de mapas de metadatos a combinar.
 * @returns Un mapa que contiene todos los metadatos combinados.
 */
export function combineMetadata(maps: ObjectMap[]): ObjectMap {
    const combinedMetadata: ObjectMap = {};

    for (const map of maps) {
        for (const category in map) {
            if (!combinedMetadata[category]) {
                combinedMetadata[category] = {};
            }
            Object.assign(combinedMetadata[category], map[category]);
        }
    }

    return combinedMetadata;
}

