import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { usernameValidation } from "@/schemas/signupSchema";
import { z } from "zod";

const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function POST(request:Request) {
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username:searchParams.get('username')
        }

        const result = usernameQuerySchema.safeParse(queryParam);
        console.log("Result ------------",result);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success:false,
                    message:usernameErrors?.length > 0 ? usernameErrors.join(',') : "invalid query parameter"
                },
                {
                    status:400
                }
            )
        }

        const {username} = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified:true
        })

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                },
                {status:409}
            )
        }

        return Response.json(
            {
                success: true,
                message: "Username is available"
            },
            {
                status:201
            }
        )
        
    } catch (error) {
        console.error("error while checking username",error);
        
        return Response.json(
            {
                success:false,
                message: "error while checking username"
            },
            {
                status:500
            }
        )
    }
}