import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
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

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const newUser = await UserModel.aggregate(
            [
                {
                    $match:{_id:userId}
                },
                {
                    $unwind:'$message'
                },
                {
                    $sort:{'message.createdAt': -1}
                },
                {
                    $group:{_id:'$_id', message:{$push:'$message'}}
                }
            ]
        )

        if (!newUser || newUser.length === 0) {
            return Response.json(
                {
                    success:false,
                    message:"User not found"
                },
                {
                    status:400
                }
            )
        }

        return Response.json(
            {
                success:true,
                message:"success",
                messages:newUser[0].message
            },
            {
                status:200
            }
        )

    } catch (error) {
        console.log("internal server error",error);
        
        return Response.json(
            {
                success: false,
                message:"internal server error"
            },
            {
                status:500
            }
        )
    }

}