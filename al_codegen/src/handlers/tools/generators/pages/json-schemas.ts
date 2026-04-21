import { z } from "zod";

/**
 * Esquemas de validación de argumentos para la generación de páginas.
 */

// Esquema de validación de campos en la página
export const fieldControlSchema = z.object({
    name: z.string().describe("Nombre del control de campo en la página. Debe ser único dentro de la página."),
    source: z.string().describe("Nombre del campo en la tabla de origen."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades clave-valor del campo."),
});

// Esquema de validación de grupos
export const groupSchema = z.object({
    name: z.string().describe("Nombre del grupo. Debe ser único dentro de la página."),
    fields: z.array(fieldControlSchema).describe("Campos dentro del grupo."),
});

// Esquema de validación de partes
export const partSchema = z.object({
    name: z.string().describe("Nombre de la parte. Debe ser único dentro de la página."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades clave-valor de la parte."),
});

// Esquema de validación de acciones
export const actionSchema = z.object({
    name: z.string().describe("Nombre de la acción. Debe ser único dentro de la página."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades clave-valor de la acción."),
    // Añadir código para el trigger OnAction en el futuro
});

// Esquema JSON de validación de argumentos de página tipo Card
export const cardPageSchema = z.object({
    id: z.number().default(50100).describe("ID del objeto. Se debe obtener mediante la herramienta 'assign-id'."),
    name: z.string().describe("Nombre del objeto. No debe existir dentro de la extensión AL actual."),
    sourceTable: z.string().describe("Nombre de la tabla de origen (propiedad 'SourceTable')."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades clave-valor de la página (opcional). 'PageType' se establece automáticamente como 'Card'."),
    groups: z.array(groupSchema).describe("Grupos de controles de la página."),
    parts: z.array(partSchema).default([]).optional().describe("Partes de la página (opcional)."),
    actions: z.array(actionSchema).default([]).optional().describe("Acciones de la página (opcional)."),
});
