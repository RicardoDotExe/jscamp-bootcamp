import * as z from 'zod'

const jobSchema = z.object({
    titulo: z.string({
        error: 'El título es obligatorio'
    })
        .min(1, 'El título no puede estar vacío')
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
        .optional()
        .default(''),

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
            .optional()
            .default([])
    })
        .optional()
        .default({}),

    content: z.object({})
        .passthrough()
        .optional()
        .default({})
})

export function validateJob (input) {
    return jobSchema.safeParse(input)
}

export function validatePartialJob (input) {
    return jobSchema.partial().safeParse(input)
}