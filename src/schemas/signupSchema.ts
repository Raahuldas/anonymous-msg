import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(4,"username must contain atleast 4 Characters")
    .max(16,"username can only contain upto 16 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"username can not contain any special character");

const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"Invalid email address"}),
    password: z.string().min(8,{message:"Password must have atleast 8 characters"})
})

export default signupSchema;