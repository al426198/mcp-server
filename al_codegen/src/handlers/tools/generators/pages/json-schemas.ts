import { z } from "zod";

/**
 * Esquemas de validación de argumentos para la generación de páginas.
 */

export const pageFieldSchema = z.object({
    name: z.string().describe("Nombre del control de campo en la página."),
    sourceField: z.string().describe("Nombre del campo en la tabla de origen."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades del campo en la página."),
});

export const repeaterSchema = z.object({
    name: z.string().default("General").describe("Nombre del repetidor."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades del repetidor."),
    fields: z.array(pageFieldSchema).describe("Campos dentro del repetidor."),
});

// Esquema JSON de validación de argumentos de página tipo API
export const apiPageSchema = z.object({
    id: z.number().default(50100).describe("ID del objeto. Se debe obtener mediante la herramienta 'assign-id'."),
    name: z.string().describe("Nombre del objeto. No debe existir dentro de la extensión AL actual."),
    sourceTable: z.string().describe("Nombre de la tabla de origen de la página."),
    apiGroup: z.string().describe("Grupo de la API."),
    apiPublisher: z.string().describe("Publicador de la API."),
    apiVersion: z.string().describe("Versión de la API."),
    entityName: z.string().describe("Nombre de la entidad."),
    entitySetName: z.string().describe("Nombre del conjunto de entidades."),
    odataKeyFields: z.string().default("SystemId").describe("Campos clave de OData."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades de la página (opcional)."),
    repeater: repeaterSchema.optional().describe("Repetidor de la página (opcional)."),
});
