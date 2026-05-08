import { z } from "zod";

/**
 * Esquemas de validación de argumentos para la generación de tablas y extensiones de tablas.
 */

// Tipos de grupos de campos que soporta AL. 'Brick' no es sintáticamente incorrecto, pero funciona solo para páginas.
const FG_TYPES = ["DropDown", "Brick"];

// Esquema de validación de campos
export const fieldSchema = z.object({
    id: z.number().describe("ID del campo. Debe ser único dentro de la tabla."),
    name: z.string().describe("Nombre del campo. Debe ser único dentro de la tabla."),
    type: z.string().describe("Tipo de dato del campo."),
    length: z.number().optional().describe("Longitud del campo. Solo se aplica a campos de tipo `Code` o `Text`."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades clave-valor del campo."),
});

// Esquema de validación de claves
export const keySchema = z.object({
    name: z.string().default("PK").describe("Nombre de la clave. Debe ser único dentro de la tabla."),
    fieldNames: z.array(z.string()).describe("Nombres de los campos de la clave."),
    clustered: z.boolean().default(false).describe("Indica si la clave es agrupada.")
});

// Esquema de validación de grupos de campos
export const fieldGroupSchema = z.object({
    type: z.enum(FG_TYPES).describe("Tipo del grupo de campos. En tablas, solo funciona DropDown."),
    fieldNames: z.array(z.string()).describe("Nombres de los campos a añadir al grupo.")
});

// Esquema de validación de campos modificados
export const fieldModifySchema = z.object({
    name: z.string().describe("Nombre del campo a modificar."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades del campo a modificar."),
});

// Esquema JSON de validación de argumentos de tabla
export const tableSchema = z.object({
    id: z.number().default(50100).describe("ID del objeto. Debe haber sido asignado previamente mediante AL Object ID Ninja."),
    name: z.string().describe("Nombre del objeto. No debe existir dentro de la extensión AL actual."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades del objeto AL (opcional)."),
    fields: z.array(fieldSchema).describe("Campos del objeto AL."),
    keys: z.array(keySchema).default([]).optional().describe("Claves del objeto AL (opcional)."),
    fieldGroups: z.array(fieldGroupSchema).default([]).optional().describe("Grupos de campos del objeto AL (opcional).")
    // Añadir esquemas para triggers en un futuro
});

// Esquema JSON de validación de argumentos de extensión de tabla
export const tableExtensionSchema = tableSchema.extend({
    target: z.string().describe("Nombre de la tabla base a extender. Debe existir en la extensión AL actual."),
    fields: z.array(z.union([fieldSchema, fieldModifySchema])).default([]).optional().describe("Campos del objeto AL a añadir o modificar (opcional)."),
});
