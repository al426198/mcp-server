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
    // Añadir descripción para trigger "OnAction" en un futuro
});

// Esquema de validación de grupos de campos
export const fieldGroupSchema = z.object({
    name: z.string().describe("Nombre del grupo de campos. Debe ser único dentro de la página."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades del grupo (opcional)."),
    fields: z.array(pageFieldSchema).default([]).optional().describe("Campos dentro del grupo (opcional)."),
});

// Esquema de validación de grupos de acciones
export const actionGroupSchema = z.object({
    name: z.string().describe("Nombre del grupo de acciones. Debe ser único dentro de la página."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades del grupo de acciones (opcional)."),
    actions: z.array(pageActionSchema).default([]).optional().describe("Acciones dentro del grupo (opcional)."),
});

// Esquema de validación de repetidores
export const repeaterSchema = z.object({
    name: z.string().default("General").describe("Nombre del repetidor."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades del repetidor."),
    fields: z.array(pageFieldSchema).describe("Campos dentro del repetidor."),
});

// Esquema base JSON de validación de argumentos de página
export const basePageSchema = z.object({
    id: z.number().default(50100).describe("ID del objeto. Se debe obtener mediante la herramienta 'assign-id'."),
    name: z.string().describe("Nombre del objeto. No debe existir dentro de la extensión AL actual."),
    sourceTable: z.string().describe("Nombre de la tabla de origen."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades opcionales de la página. No incluye 'PageType' ni 'SourceTable'."),
});

// Esquema JSON de validación de argumentos de página tipo Card
export const cardPageSchema = basePageSchema.extend({
    groups: z.array(fieldGroupSchema).default([]).optional().describe("Grupos de controles de la página (opcional)."),
    parts: z.array(pagePartSchema).default([]).optional().describe("Partes de la página (opcional) para el área 'FactBoxes'."),
    actions: z.array(pageActionSchema).default([]).optional().describe("Acciones de la página (opcional).")
});

// Esquema JSON de validación de argumentos de página tipo List
export const listPageSchema = basePageSchema.extend({
    repeater: repeaterSchema.optional().describe("Repetidor de la página (opcional)."),
    parts: z.array(pagePartSchema).default([]).optional().describe("Partes de la página (opcional) para el área 'FactBoxes'."),
    actions: z.array(pageActionSchema).default([]).optional().describe("Acciones de la página (opcional)."),
});

// Esquema JSON de validación de argumentos de página tipo API
export const apiPageSchema = basePageSchema.extend({
    apiGroup: z.string().describe("Grupo de la API."),
    apiPublisher: z.string().describe("Publicador de la API."),
    apiVersion: z.string().describe("Versión de la API."),
    entityName: z.string().describe("Nombre de la entidad."),
    entitySetName: z.string().describe("Nombre del conjunto de entidades."),
    odataKeyFields: z.string().default("SystemId").describe("Campos clave de OData."),
    repeater: repeaterSchema.optional().describe("Repetidor de la página (opcional)."),
});

// Operaciones válidas dentro de layout y actions de una extensión de página
const PAGE_EXTENSION_OPERATIONS = [
    "addfirst", "addlast", "addafter", "addbefore",
    "modify",
    "movefirst", "movelast", "moveafter", "movebefore"
] as const;

export const changeSchema = z.object({
    operation: z.enum(PAGE_EXTENSION_OPERATIONS).describe("Tipo de operación. Usa 'add*' para añadir controles/acciones, 'modify' para cambiar propiedades, 'move*' para mover controles/acciones."),
    anchor: z.string().describe("Nombre del control/acción o categoría pivote."),
});

// Esquema de validación de un bloque de cambio en el layout de una extensión de página
export const layoutChangeSchema = changeSchema.extend({
    control: z.discriminatedUnion("type", [
        pageFieldSchema.extend({ type: z.literal("field") }),
        pagePartSchema.extend({ type: z.literal("part") }),
    ]).optional().describe("Control a añadir o modificar. Solo aplica a operaciones add* y modify."),
});

// Esquema de validación de un bloque de cambio en las actions de una extensión de página
export const actionChangeSchema = changeSchema.extend({
    actions: z.array(z.union([actionGroupSchema, pageActionSchema])).optional().describe("Acciones o grupos de acciones a añadir o modificar."),
});

// Esquema JSON de validación de argumentos de extensión de página
export const pageExtensionSchema = basePageSchema.extend({
    target: z.string().describe("Nombre de la página base a extender. Debe existir dentro de la extensión AL actual."),
    layout: z.array(layoutChangeSchema).default([]).optional().describe("Lista de bloques de cambio en el layout de la página (opcional)."),
    actions: z.array(actionChangeSchema).default([]).optional().describe("Lista de bloques de cambio en las acciones de la página (opcional)."),
});
