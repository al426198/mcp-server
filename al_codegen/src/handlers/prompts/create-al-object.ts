import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fs from "fs";

/** 
 * Tipos de objetos disponibles en AL
 * Para el proyecto solo serán considerados 'table', 'page' y 'codeunit', 
 * y los tipos extensión 'tableextension' y 'pageextension'
 */
const TYPES = [
    "table",
    "page",
    "codeunit",
    "report",
    "xmlport",
    "query",
    "enum",
    "tableextension",
    "pageextension",
    "reportextension",
    "enumextension"
]

// Ruta del fichero de configuración de la extensión AL
const CONFIG_PATH = process.env.AL_PROJECT_PATH + "/app.json";

// Ruta del fichero de metadatos de la extensión AL
const { publisher, name, version } = getAppInfo();
const METADATA_PATH = process.env.AL_PROJECT_PATH + `/${publisher}_${name}_${version}.app`;

/**
 * #SP1: Generación de objetos AL.
 * 
 * Genera una petición para obtener el siguiente ID disponible para un tipo de objeto dentro de una extensión AL
 * según los siguientes pasos:
 * - Inicializa los metadatos de la extensión AL.
 * - Comprueba que no exista un objeto con el mismo nombre.
 * - Obtiene el siguiente ID disponible para el tipo de objeto.
 * - Genera el objeto AL con el nombre e ID proporcionados. El usuario puede añadir una descripción textual del objeto.
 * 
 * @param name - Nombre del objeto. Debe ser único dentro de la extensión AL actual.
 * @param type - Tipo de objeto.
 * @param description - Descripción textual del objeto.
 * 
 * @returns El objeto AL generado.
*/
export const registerCreateNewObjectPrompt = (server: McpServer) => {
    // Esquema JSON de validación de argumentos
    const promptSchema = {
        name: z.string().describe("Nombre del objeto."),
        target: z.string().optional().describe("Nombre del objeto base a extender (obligatorio si el objeto es una extensión)."),
        type: z.enum(TYPES).describe("Tipo de objeto."),
        description: z.string().optional().describe(
            "Descripción textual del objeto. Se pueden incluir campos, controles, acciones, etc. a generar, o bien se puede explicar qué función debe cumplir el objeto AL."
        ),
    };

    // Parámetros del prompt
    const name = "create-new-object";
    const config = {
        title: "Generación de nuevo objeto AL",
        description: "Permite generar un nuevo objeto AL con el nombre e ID proporcionados. Se puede añadir una descripción textual del objeto para generar un objeto AL más detallado.",
        argsSchema: promptSchema,
    }

    // Registro del prompt
    server.registerPrompt(
        name,
        config,
        async (args) => {
            if (args.type.includes("extension") && !args.target) {
                throw new Error("Un objeto base es obligatorio para extensiones. Proporciona el nombre del objeto base a extender.");
            }
            return {
                messages: [
                    {
                        role: "assistant",
                        content: {
                            type: "text",
                            text: `Inicializa los metadatos de la extensión ubicados en el fichero "${METADATA_PATH}" mediante la herramienta 'init-extension-metadata'.`,
                        },
                    },
                    {
                        role: "assistant",
                        content: {
                            type: "text",
                            text: `Comprueba que no exista un objeto con el nombre "${args.name}" en la categoría "${args.type}" en los metadatos de la extensión mediante la herramienta 'get-object-schema'.`,
                        },
                    },
                    {
                        role: "assistant",
                        content: {
                            type: "text",
                            text: `Si el objeto es una extensión (${args.type} sigue el patrón "*extension"), comprueba que el objeto base "${args.target}" existe mediante la herramienta 'get-object-schema'.`,
                        },
                    },
                    {
                        role: "assistant",
                        content: {
                            type: "text",
                            text: `Si ha ido todo bien en los pasos anteriores, proporciona el siguiente ID disponible para el tipo de objeto "${args.type}". En caso contrario, devuelve un mensaje de error`,
                        },
                    },
                    {
                        role: "assistant",
                        content: {
                            type: "text",
                            text: `Genera un objeto AL de tipo "${args.type}" con el nombre "${args.name}" y el ID obtenido en el paso anterior. A continuación se muestra la descripción del objeto:\n${args.description ? `\n${args.description}` : ""}`,
                        },
                    },
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: `Si todo ha ido bien, devuelve el objeto generado. Si no, indica el error obtenido.`,
                        },
                    },
                ],
            };
        });
}

/**
 * Helper para leer la información de la extensión AL desde el fichero de configuración `app.json`
 * @returns Un objeto con publisher, name y version
 * @throws Si no se encuentra el fichero de configuración de la extensión AL
 */
function getAppInfo() {
    if (!fs.existsSync(CONFIG_PATH)) {
        throw new Error("No se ha encontrado el fichero de configuración de la extensión AL en la ruta: " + CONFIG_PATH);
    }
    const appJson = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    return {
        publisher: appJson.publisher,
        name: appJson.name,
        version: appJson.version
    };
}