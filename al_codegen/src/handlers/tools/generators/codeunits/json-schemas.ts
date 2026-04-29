import { z } from "zod";

/**
 * Esquemas de validación de argumentos para la generación de codeunits.
 */

const ACCESS_MODIFIERS = [
    "",
    "local",
    "internal",
    "protected"
];

// Esquema de validación de parámetros de procedimiento
export const procedureParameterSchema = z.object({
    name: z.string().describe("Nombre del parámetro."),
    type: z.string().describe("Tipo del parámetro."),
    length: z.number().optional().describe("Longitud máxima del tipo. Solo se aplica a parámetros de tipo Code o Text."),
    isVar: z.boolean().default(false).describe("Indica si el parámetro se pasa por referencia (var)."),
});

// Esquema de validación de variables locales de un procedimiento
export const procedureVariableSchema = z.object({
    name: z.string().describe("Nombre de la variable local."),
    type: z.string().describe("Tipo de la variable local."),
    length: z.number().optional().describe("Longitud máxima del tipo. Solo se aplica a variables de tipo Code o Text."),
});

// Esquema de validación de un procedimiento
export const procedureSchema = z.object({
    name: z.string().describe("Nombre del procedimiento. Debe ser único dentro de la codeunit."),
    access: z.enum(ACCESS_MODIFIERS).default("").describe(
        "Modificador de acceso. Vacío para público, 'local' limita el acceso a la codeunit, 'internal' al módulo, 'protected' a la jerarquía."
    ),
    parameters: z.array(procedureParameterSchema).default([]).optional().describe("Lista de parámetros del procedimiento (opcional)."),
    returnType: z.string().optional().describe("Tipo de retorno del procedimiento (opcional). Omitir si el procedimiento no retorna ningún valor."),
    variables: z.array(procedureVariableSchema).default([]).optional().describe("Variables locales del procedimiento (opcional)."),
    body: z.string().optional().describe("Código del cuerpo del procedimiento (opcional). Utiliza '\\n' como salto de línea y '\\t' como tabulación."),
});

// Esquema JSON de validación de argumentos de codeunit
export const codeunitSchema = z.object({
    id: z.number().default(50100).describe("ID del objeto. Se debe obtener mediante la herramienta 'assign-id'."),
    name: z.string().describe("Nombre del objeto. No debe existir dentro de la extensión AL actual."),
    properties: z.record(z.string(), z.string()).default({}).optional().describe("Propiedades clave-valor de la codeunit (opcional)."),
    procedures: z.array(procedureSchema).default([]).optional().describe("Lista de procedimientos de la codeunit (opcional).")
});
