/**
 * Esquemas de validación de argumentos para la generación de tablas y extensiones de tablas.
 */

// Tipos de grupos de campos que soporta AL
const FG_TYPES = ["DropDown", "Brick"];

// Esquema de validación de campos (nuevos o modificados)
export const fieldSchema = z.object({
    id: z.number().optional().describe("ID del campo. Requerido si es un campo nuevo (no usar si se modifica)."),
    name: z.string().describe("Nombre del campo."),
    type: z.string().optional().describe("Tipo del campo. Requerido si es un campo nuevo."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades clave-valor del campo."),
});

// Esquema de validación de claves
export const keySchema = z.object({
    name: z.string().describe("Nombre de la clave."),
    fieldNames: z.array(z.string()).describe("Nombres de los campos de la clave."),
    clustered: z.boolean().default(false).describe("Indica si la clave es agrupada.")
});

// Esquema de validación de grupos de campos
export const fieldGroupSchema = z.object({
    type: z.enum(FG_TYPES).describe("Tipo del grupo de campos. Solo funciona DropDown."),
    fieldNames: z.array(z.string()).describe("Nombres de los campos a añadir (addlast) al grupo.")
});

// Esquema de validación de campos modificados
export const fieldModifySchema = z.object({
    name: z.string().describe("Nombre del campo."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades clave-valor del campo."),
});

// Esquema JSON de validación de argumentos de tabla
export const tableSchema = {
    id: z.number().describe("ID del objeto. Se debe obtener mediante AL ID Object Ninja para garantizar la concurrencia."),
    name: z.string().describe("Nombre del objeto. Debe ser único dentro de la extensión AL actual."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades clave-valor del objeto AL (opcional)."),
    fields: z.array(fieldSchema).describe("Campos del objeto AL."),
    keys: z.array(keySchema).default([]).optional().describe("Claves del objeto AL (opcional)."),
    fieldGroups: z.array(fieldGroupSchema).default([]).optional().describe("Grupos de campos del objeto AL (opcional).")
};

// Esquema JSON de validación de argumentos de extensión de tabla
export const tableExtensionSchema = {
    ...tableSchema,
    target: z.string().describe("Nombre de la tabla base a extender. Debe existir en la extensión AL actual."),
    fields: z.array(fieldSchema).default([]).optional().describe("Campos del objeto AL a añadir (opcional)."),
    modifyFields: z.array(fieldModifySchema).default([]).optional().describe("Campos a modificar (opcional).")
};

import { z } from "zod";