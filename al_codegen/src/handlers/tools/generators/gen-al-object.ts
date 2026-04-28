import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { ROOT } from "../../../index.js";
import { z } from "zod";

import Handlebars from "handlebars";
import fs from "fs";
import path from "path";

const baseObjectSchema = z.object({
    id: z.number().default(50100).describe("ID del objeto. Se debe obtener mediante la herramienta 'assign-id'."),
    name: z.string().describe("Nombre del objeto. No debe existir dentro de la extensión AL actual."),
    type: z.string().describe("Tipo de objeto AL (Table, Page, PageExtension, etc.)."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades del objeto AL (opcional)."),
    schema: z.any().describe("Esquema del objeto AL.")
});

/**
 * Obtiene la ruta de la plantilla Handlebars según el tipo de objeto.
 * 
 * @param type - Tipo de objeto AL.
 * @param name - Nombre del objeto.
 * @returns Ruta relativa al fichero .hbs.
 */
const getRoute = (type: string, name: string): string => {
    const lowerType = type.toLowerCase();
    switch (lowerType) {
        case "table":
            return "/tables/table.hbs";
        case "tableextension":
            return "/tables/tableextension.hbs";
        case "page":
            return "/pages/page.hbs";
        case "pageextension":
            return "/pages/pageextension.hbs";
        default:
            return `/${lowerType}s/${lowerType}.hbs`;
    }
}


/**
 * Generación de objetos AL
 * 
 * Genera un objeto AL según los parámetros proporcionados.
 * Dentro de la carpeta `generators` se encuentran los helpers para generar cada tipo de objeto.
 * 
 * @param id - ID del objeto.
 * @param name - Nombre del objeto.
 * @param type - Tipo de objeto.
 * @param schema - Esquema del objeto.
 * 
 */
export const registerGenerateObjectTool = (server: McpServer) => {
    // Parámetros del prompt
    const name = "generate-object";
    const config = {
        title: "Generar objeto AL",
        description: "Genera un objeto en lenguaje AL.",
        inputSchema: baseObjectSchema,
    }

    server.registerTool(
        name,
        config,
        async (args): Promise<CallToolResult> => {
            try {
                // Preprocesado

                // Ordenar propiedades por clave alfabéticamente
                const sortedProperties = Object.fromEntries(
                    Object.entries(args.properties!).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                );

                // Lectura de la plantilla Handlebars
                const templateSource = fs.readFileSync(path.join(ROOT, getRoute(args.type, args.name)), "utf-8");
                const template = Handlebars.compile(templateSource);

                // Generación del objeto AL
                const result = template(args);

                // Guardado del fichero resultante
                const dirPath = path.resolve(`${process.env.AL_PROJECT_PATH}/src/app/`, `${args.type}s`);
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                }
                fs.writeFileSync(`${dirPath}/${args.name}.al`, result, "utf8");

                return {
                    content: [
                        {
                            type: "text",
                            text: `Objeto AL generado con éxito: \n ${result}`,
                        },
                    ],
                };
            }

            catch (error: any) {
                return {
                    isError: true,
                    content: [
                        {
                            type: "text",
                            text: `Error al generar el objeto ${args.name} de tipo ${args.type}: ${error.message}`,
                        },
                    ],
                };
            }
        }
    );
};