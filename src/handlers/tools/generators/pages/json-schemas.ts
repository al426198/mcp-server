import { z } from "zod";

/**
 * Esquemas de validación de argumentos para la generación de páginas.
 */

// Esquema de validación de campos
export const pageFieldSchema = z.object({
    name: z.string().describe("Nombre del control de campo."),
    sourceField: z.string().describe("Nombre del campo en la tabla de origen (propiedad 'SourceTable')."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades del control de campo (opcional)."),
});

// Esquema de validación de partes
export const pagePartSchema = z.object({
    name: z.string().describe("Nombre de la parte."),
    source: z.string().describe("Nombre de la página o tabla de origen de la parte."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades de la parte (opcional)."),
});

// Esquema de validación de acciones
export const pageActionSchema = z.object({
    name: z.string().describe("Nombre de la acción."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades de la acción."),
    // Añadir descripción para trigger "OnAction" en un futuro
});

// Esquema de validación de grupos de campos
export const fieldGroupSchema = z.object({
    name: z.string().default("General").describe("Nombre del grupo de campos. Debe ser único dentro de la página."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades del grupo de campos (opcional)."),
    fields: z.array(pageFieldSchema).default([]).optional().describe("Campos dentro del grupo de campos (opcional)."),
});

// Esquema de validación de repetidores
export const repeaterSchema = z.object({
    name: z.string().default("General").describe("Nombre del repetidor. Debe ser único dentro de la página."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades del repetidor (opcional)."),
    fields: z.array(pageFieldSchema).default([]).optional().describe("Campos dentro del repetidor (opcional)."),
});

// Esquema de validación de grupos de acciones anidados (por defecto tipo 'group')
const actionGroupSchema: z.ZodType<any> = z.lazy(() => z.object({
    name: z.string().describe("Nombre del grupo de acciones. Debe ser único dentro de la página."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades del grupo de acciones (opcional)."),
    actions: z.array(pageActionSchema).default([]).optional().describe("Acciones dentro del grupo de acciones (opcional)."),
    groups: z.array(actionGroupSchema).default([]).optional().describe("Grupos de acciones dentro del grupo de acciones (opcional)."),
    type: z.literal("group").default("group").describe("Tipo de contenedor de acciones, solo puede ser 'group'."),
}));

// Esquema de validación de áreas de acciones
export const actionAreaSchema = z.object({
    name: z.string().default("Processing").describe("Nombre del grupo o área de acciones. Debe ser único dentro de la página."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades del grupo o área de acciones (opcional)."),
    actions: z.array(pageActionSchema).default([]).optional().describe("Acciones dentro del grupo o área de acciones (opcional)."),
    groups: z.array(actionGroupSchema).default([]).optional().describe("Grupos de acciones dentro del área o grupo de acciones (opcional)."),
    type: z.literal("area").default("area").describe("El primer nivel dentro de una jerarquía de acciones debe ser 'area'"),
});

// Esquema base JSON de validación de argumentos de página
export const basePageSchema = z.object({
    id: z.number().default(50100).describe("ID del objeto. Debe haber sido asignado previamente mediante AL Object ID Ninja."),
    name: z.string().describe("Nombre del objeto. No debe existir dentro de la extensión AL actual."),
    sourceTable: z.string().describe("Nombre de la tabla de origen."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades opcionales de la página. No incluye 'PageType' ni 'SourceTable'."),
});

// Esquema JSON de validación de argumentos de página tipo Card
export const cardPageSchema = basePageSchema.extend({
    groups: z.array(fieldGroupSchema).default([]).optional().describe("Grupos de controles de la página (opcional)."),
    parts: z.array(pagePartSchema).default([]).optional().describe("Partes de la página (opcional) para el área 'FactBoxes'."),
    areas: z.array(actionAreaSchema).default([]).optional().describe("Acciones de la página (opcional).")
});

// Esquema JSON de validación de argumentos de página tipo List
export const listPageSchema = basePageSchema.extend({
    repeater: repeaterSchema.optional().describe("Repetidor de la página (opcional)."),
    parts: z.array(pagePartSchema).default([]).optional().describe("Partes de la página (opcional) para el área 'FactBoxes'."),
    areas: z.array(actionAreaSchema).default([]).optional().describe("Acciones de la página (opcional)."),
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
    "addfirst",
    "addlast",
    "addafter",
    "addbefore",
    "modify",
    "movefirst",
    "movelast",
    "moveafter",
    "movebefore"
];

export const baseChangeSchema = z.object({
    operation: z.enum(PAGE_EXTENSION_OPERATIONS).describe("Tipo de operación. Se usa 'add*' para añadir controles/grupos/acciones, 'modify' para cambiar propiedades, 'move*' para mover controles/acciones."),
    anchor: z.string().describe("Nombre del control/grupo/acción pivote. Debe existir en el objeto extendido."),
});

// Esquemas de validación de cambios en una extensión de página
export const addChangeSchema = baseChangeSchema.extend({
    changes: z.array(z.union([
        pageFieldSchema.extend({ type: z.literal("field").default("field") }),
        fieldGroupSchema.extend({ type: z.literal("group").default("group") }),
        pageActionSchema.extend({ type: z.literal("action").default("action") }),
        actionGroupSchema
    ])).default([]).optional().describe("Controles/Grupos de campos/acciones a añadir (opcional)."),
});

export const modifyChangeSchema = baseChangeSchema.extend({
    properties: z.record(z.string(), z.string()).describe("Propiedades del control/acción a modificar."),
});

export const moveChangeSchema = baseChangeSchema.extend({
    target: z.string().describe("Control/Acción a mover. Debe existir en el objeto extendido."),
});

// Esquema JSON de validación de argumentos de extensión de página
export const pageExtensionSchema = basePageSchema.omit({ sourceTable: true }).extend({
    target: z.string().describe("Nombre de la página base a extender. Debe existir dentro de la extensión AL actual."),
    layoutChanges: z.array(z.union([modifyChangeSchema, moveChangeSchema, addChangeSchema])).default([]).optional().describe("Lista de bloques de cambio en el layout de la página (opcional)."),
    actionChanges: z.array(z.union([modifyChangeSchema, moveChangeSchema, addChangeSchema])).default([]).optional().describe("Lista de bloques de cambio en las acciones de la página (opcional)."),
});