import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";
import { collectObjects } from "./helper.js";

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
 * @returns Un diccionario cuyas claves son los nombres de las categorías y sus objetos.
 */
async function extractAppSymbols(appFilePath: string): Promise<ObjectMap> {
    // Recortar el fichero `.app` a partir de la cabecera ZIP (0x50 0x4B 0x03 0x04)
    const rawBuffer = fs.readFileSync(appFilePath);
    const zipOffset = rawBuffer.indexOf(Buffer.from([0x50, 0x4B, 0x03, 0x04]));
    if (zipOffset === -1) {
        throw new Error(`No se encontró la cabecera ZIP en '${appFilePath}'.`);
    }

    // Localizar el fichero de símbolos
    const zip = new AdmZip(rawBuffer.subarray(zipOffset));
    const symbolEntry = zip.getEntry(SYMBOL_FILE);
    if (!symbolEntry) {
        throw new Error(`No se encontró '${SYMBOL_FILE}' dentro de '${appFilePath}'.`);
    }

    // Procesar el archivo JSON evitando el BOM UTF-8 (3 bytes)
    let json: any;
    try {
        json = JSON.parse(symbolEntry.getData().subarray(3).toString("utf8"));
    } catch (error: any) {
        throw new Error(`El contenido de '${SYMBOL_FILE}' no es un objeto válido: ${error.message}`);
    }

    // Recolectar objetos del fichero JSON
    return collectObjects(json);
}

/**
 * Lee un fichero `.app` y devuelve sus metadatos.
 * 
 * @param filePath - Ruta al fichero `.app`.
 */
export async function readMetadataFile(filePath: string): Promise<ObjectMap> {
    // Verificar que el fichero existe
    if (!fs.existsSync(filePath)) {
        throw new Error(`El fichero '${filePath}' no existe.`);
    }

    // Procesar fichero `.app`
    return await extractAppSymbols(filePath);
}

/**
 * Lee todos los ficheros `.app` de un directorio.
 * 
 * @param directoryPath - Ruta al directorio.
 */
export async function readMetadataFolder(directoryPath: string): Promise<ObjectMap> {
    // Verificar que el directorio existe
    if (!fs.existsSync(directoryPath)) {
        throw new Error(`El directorio '${directoryPath}' no existe.`);
    }

    // Obtener ficheros `.app` del directorio
    const files = fs.readdirSync(directoryPath);
    const appFiles = files.filter(f => f.toLowerCase().endsWith(".app"));

    // Procesar ficheros `.app`
    const metadataList: ObjectMap[] = await Promise.all(appFiles.map(async (file) => {
        try {
            return await readMetadataFile(path.join(directoryPath, file));
        } catch (error: any) {
            console.error(`Error al leer el fichero ${file}: ${error.message}`);
            throw error;
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
