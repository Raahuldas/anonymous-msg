import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json()

        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({
            username: decodedUsername
        })

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "user not found"
                },
                {
                    status: 400
                }
            )
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json(
                {
                    success: true,
                    message: "user verified successfully"
                },
                {
                    status: 201
                }
            )
        } else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code is expired, please signup again to get a new code"
                },
                {
                    status: 400
                }
            )
        } else {
            return Response.json(
                {
                    success: true,
                    message: "Verification code is incorrect"
                },
                {
                    status: 400
                }
            )
        }

    } catch (error) {
        console.log("Error while verifying code", error);

        return Response.json(
            {
                success: false,
                message: "Error while verifying code"
            },
            {
                status: 500
            }
        )
    }
}