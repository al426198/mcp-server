import fs from "fs";
import path from "path";

/**
 * Guarda el contenido de un objeto AL en un fichero `.al`.
 * Crea un directorio estándar para el tipo de objeto si no existe.
 *
 * @param projectPath - Ruta raíz del proyecto AL.
 * @param type - Tipo de objeto AL.
 * @param name - Nombre del objeto AL.
 * @param content - Contenido AL a escribir en el fichero.
 * @returns La ruta absoluta al fichero creado.
 * @throws Si no se puede crear el directorio o escribir el fichero.
 */
export function saveFile(projectPath: string, type: string, name: string, content: string): string {
    // Crear directorio si no existe
    const targetDir = path.join(projectPath, "src", `${type}s`);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
    }

    // Guardar el fichero AL
    const filePath = path.join(targetDir, `${name}.${type}.al`);
    fs.writeFileSync(filePath, content, "utf-8");
    return filePath;
}
