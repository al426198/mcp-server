import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { __root } from "../../../../index.js";

import Handlebars from "handlebars";
import fs from "fs";
import path from "path";


/**
 * HU202 + HU203 + HU204: Generación de páginas en lenguaje AL
 * 
 * Registra una herramienta en el servidor MCP para generar páginas de tipo AL.
 * Para ver ejemplos, véase el resto de ficheros de este módulo.
 * 
 * @param server - Servidor MCP.
 * @param name - Nombre de la herramienta.
 * @param title - Título de la herramienta.
 * @param description - Descripción de la herramienta.
 * @param inputSchema - Esquema de entrada de la herramienta.
 * @param templatePath - Ruta de la plantilla Handlebars.
 * @param pageType - Tipo de página.
 */

export abstract class BasePageGenerator {
    // Nombre de la herramienta
    protected abstract name: string;

    // Título de la herramienta
    protected abstract title: string;

    // Descripción de la herramienta
    protected abstract description: string;

    // Esquema JSON de valdiación de entrada
    protected abstract inputSchema: any;

    // Ruta de la plantilla Handlebars
    protected abstract templatePath: string;

    // Tipo de página
    protected abstract pageType: string;

    // Propiedades por defecto (opcional)
    protected defaultProperties: Record<string, string> = {};

    public registerPageTool(server: McpServer): void {
        const config = {
            title: this.title,
            description: this.description,
            inputSchema: this.inputSchema,
        };

        server.registerTool(
            this.name,
            config,
            async (args: any): Promise<CallToolResult> => {
                try {
                    // Lectura de la plantilla Handlebars
                    const templateSource = fs.readFileSync(path.join(__root, this.templatePath), "utf-8");
                    const template = Handlebars.compile(templateSource);

                    // Añadir propiedades por defecto
                    const properties = args.properties || {};
                    properties["PageType"] = this.pageType;
                    properties["SourceTable"] = '"' + args.sourceTable + '"';

                    // Ordenar propiedades por clave alfabéticamente
                    const sortedProperties = Object.fromEntries(
                        Object.entries(properties).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                    );

                    // Generación de la página
                    return {
                        content: [
                            {
                                type: "text",
                                text: template({ ...args, properties: sortedProperties }),
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
                                text: `Error al generar la página ${args.pageType}: ${error.message}`,
                            },
                        ],
                    };
                }
            }
        );
    }
}
