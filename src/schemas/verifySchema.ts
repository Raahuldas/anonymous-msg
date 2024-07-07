import {z} from 'zod';

const verifySchema = z.object({
    code: z.string().length(6,"verification code must contain 6 digits")
})

export default verifySchema;