import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/** 
 * Tipos de objetos disponibles en AL
 * Para el proyecto solo serán considerados 'table', 'page' y 'codeunit', 
 * y los tipos extensión 'tableextension' y 'pageextension'
 */
export const TYPES = [
    "Table",
    "Page",
    "Codeunit",
    "Report",
    "XmlPort",
    "Query",
    "Enum",
    "TableExtension",
    "PageExtension",
    "ReportExtension",
    "EnumExtension"
]

/**
 * #SP1: Generación de objetos AL.
 * 
 * Genera una petición para obtener el siguiente ID disponible para un tipo de objeto dentro de una extensión AL
 * según los siguientes pasos:
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
        name: z.string().describe("Nombre del objeto"),
        target: z.string().optional().describe("Nombre del objeto base a extender (opcional)"),
        type: z.enum(TYPES).describe("Tipo de objeto ('Table', 'TableExtension', 'Page', etc.)"),
        description: z.string().optional().describe("Descripción textual del objeto")
    };

    // Parámetros del prompt
    const name = "create-new-object";
    const config = {
        title: "Generación de nuevo objeto AL",
        description: "Permite generar un nuevo objeto AL con el nombre e ID proporcionados.\n\nEn la descripción, se pueden incluir campos, controles, acciones, etc. a generar, o bien se puede explicar qué función debe cumplir el objeto AL.",
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
                            text: `Agrega el proyecto AL mediante la herramienta 'al_addproject' si no lo tienes agregado.`,
                            annotations: {
                                audience: ["assistant"]
                            }
                        },
                    },
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: `Comprueba que no exista un objeto con el nombre "${args.name}" en la categoría "${args.type}" en los metadatos de la extensión existente en ${process.env.AL_PROJECT_PATH}.`,
                            annotations: {
                                audience: ["assistant"]
                            }
                        },
                    },
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: `Si "${args.type}" es 'Page', comprueba si existe la tabla asociada a "${args.name}" en la categoría "Tables".`,
                            annotations: {
                                audience: ["assistant"]
                            }
                        },
                    },
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: `Si el objeto es una extensión (${args.type} sigue el patrón "*extension"), comprueba que el objeto base "${args.target}" existe.`,
                            annotations: {
                                audience: ["assistant"]
                            }
                        },
                    },
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: `Si ha ido todo bien en los pasos anteriores, proporciona el siguiente ID disponible para el tipo de objeto "${args.type}". En caso contrario, devuelve un mensaje de error.`,
                            annotations: {
                                audience: ["assistant"]
                            }
                        },
                    },
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: `Genera un objeto AL de tipo "${args.type}" con el nombre "${args.name}" y el ID obtenido en el paso anterior. A continuación se muestra la descripción del objeto:\n${args.description ? `\n${args.description}` : ""}.`,
                            annotations: {
                                audience: ["assistant"]
                            }
                        },
                    },
                    {
                        role: "assistant",
                        content: {
                            type: "text",
                            text: `Compila el proyecto mediante la herramienta 'al_compile'. Si hay algún error, corrígelo y vuelve a compilar el código. 
                            En caso de no poder solucionarlo, indica el error obtenido.`,
                            annotations: {
                                audience: ["assistant"]
                            }
                        },
                    },
                    {
                        role: "assistant",
                        content: {
                            type: "text",
                            text: `Si todo ha ido bien, devuelve el objeto generado. En caso contrario, explica el error obtenido.`,
                            annotations: {
                                audience: ["user"]
                            }
                        },
                    },
                ],
            };
        }
    );
}