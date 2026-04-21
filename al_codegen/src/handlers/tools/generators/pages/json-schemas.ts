import { z } from "zod";

/**
 * Esquemas de validación de argumentos para la generación de páginas.
 */

// Esquema de validación de campos en la página
export const pageFieldSchema = z.object({
    name: z.string().describe("Nombre del control de campo en la página."),
    sourceField: z.string().describe("Nombre del campo en la tabla de origen."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades del campo en la página."),
});

// Esquema de validación de repetidores
export const repeaterSchema = z.object({
    name: z.string().default("General").describe("Nombre del repetidor."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades del repetidor."),
    fields: z.array(pageFieldSchema).describe("Campos dentro del repetidor."),
});

// Esquema de validación de partes
export const pagePartSchema = z.object({
    name: z.string().describe("Nombre de la parte."),
    source: z.string().describe("Nombre de la página o tabla de origen de la parte."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades de la parte."),
});

// Esquema de validación de acciones
export const pageActionSchema = z.object({
    name: z.string().describe("Nombre de la acción."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades de la acción."),
});

// Esquema JSON de validación de argumentos de página tipo List
export const listPageSchema = z.object({
    id: z.number().default(50100).describe("ID del objeto. Se debe obtener mediante la herramienta 'assign-id'."),
    name: z.string().describe("Nombre del objeto. No debe existir dentro de la extensión AL actual."),
    sourceTable: z.string().describe("Nombre de la tabla de origen de la página. Debe existir dentro de la extensión AL actual."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades de la página (opcional)."),
    repeater: repeaterSchema,
    actions: z.array(pageActionSchema).default([]).optional().describe("Acciones de la página (opcional)."),
});
