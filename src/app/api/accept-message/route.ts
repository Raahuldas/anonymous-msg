import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/user.model";

export async function POST(request:Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user :User = session?.user as User

    if (!session || !user) {
        return Response.json(
            {
                success: false,
                message:"Unauthorized user"
            },
            {
                status:401
            }
        )
    }

    const userId = user._id;
    const {acceptMessages} = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessage: acceptMessages
            },
            {new:true}
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success:false,
                    message:"Error while updating user"
                },
                {
                    status:400
                }
            )
        }

        return Response.json(
            {
                success:true,
                message:"Message acceptance status updated successfully",
                updatedUser
            },
            {
                status:201
            }
        )

    } catch (error) {
        console.log("Failed to update accept messages status ");
        return Response.json(
            {
                success:false,
                message:"Failed to update accept messages status"
            },
            {
                status:500
            }
        )
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user :User = session?.user as User

    if (!session || !user) {
        return Response.json(
            {
                success: false,
                message:"Unauthorized user"
            },
            {
                status:401
            }
        )
    }

    const userId = user._id;  

    try {
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            return Response.json(
                {
                    success:false,
                    message:"user not found"
                },
                {
                    status:400
                }
            )    
        }

        return Response.json(
            {
                success: true,
                message:"user found successfully",
                isAcceptingMessage: foundUser.isAcceptingMessage
            },
            {
                status:200
            }
        )

    } catch (error) {
        return Response.json(
            {
                success:false,
                message:"error in getting message acceptance status"
            },
            {
                status:500
            }
        )
    }
}