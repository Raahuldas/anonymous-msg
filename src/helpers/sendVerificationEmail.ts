import {resend} from "@/lib/resend";

import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
) :Promise<ApiResponse> {
    try {
        // const { data, error } =
         await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystry message | Verification code',
            react: VerificationEmail({username, otp:verifyCode}),
          });
        
        return {success:true, message:"email sent successfully "}
    } catch (error) {
        console.log("failed to send verification email",error);
        return {success:false, message:"failed to send verification email"}
        
    }
}