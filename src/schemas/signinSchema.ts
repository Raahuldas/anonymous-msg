import { z } from "zod";

const signinSchema = z.object({
    identifier: z.string(),
    password:z.string()
})

export default signinSchema;