import * as z from 'zod'

const jobSchema = z.object({
    titulo: z.string({
        error: 'El título es obligatorio'
    })
        /* .min(1, 'El título no puede estar vacío') */
        // Colocamos un mínimo de 3 caracteres para el título
        .min(3, 'El título debe tener al menos 3 caracteres')
        .max(100, 'El título no puede superar los 100 caracteres'),

    empresa: z.string({
        error: 'La empresa es obligatoria'
    })
        .min(1, 'La empresa no puede estar vacía')
        .max(100, 'La empresa no puede superar los 100 caracteres'),

    ubicacion: z.string({
        error: 'La ubicación es obligatoria'
    })
        .min(1, 'La ubicación no puede estar vacía')
        .max(100, 'La ubicación no puede superar los 100 caracteres'),

    descripcion: z.string()
        .max(2000, 'La descripción no puede superar los 2000 caracteres')
        /* .optional()
        .default('') */
        // Sin default: en PATCH inyectaría campos no enviados y sobrescribiría datos. Los modelos ya aplican sus propios valores por defecto
        .optional(),

    data: z.object({
        nivel: z.string()
            .min(1, 'El nivel no puede estar vacío')
            .optional(),

        modalidad: z.string()
            .min(1, 'La modalidad no puede estar vacía')
            .optional(),

        technology: z.array(
            z.string().min(1, 'La tecnología no puede estar vacía')
        )
            /* .optional()
            .default([]) */
            // Sin default para no inyectar campos no enviados en PATCH
            .optional()
    })
        /* .optional()
        .default({}) */
        .optional(),

    content: z.object({})
        .passthrough()
        /* .optional()
        .default({}) */
        .optional()
})

export function validateJob (input) {
    return jobSchema.safeParse(input)
}

export function validatePartialJob (input) {
    return jobSchema.partial().safeParse(input)
}