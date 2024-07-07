'use client'

import axios, { AxiosError } from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceCallback } from "usehooks-ts"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import signupSchema from "@/schemas/signupSchema"
import { ApiResponse } from "@/types/ApiResponse"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


function page() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceCallback(setUsername, 500)
  const { toast } = useToast();
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  useEffect(() => {
    const checkUsernameUniqueness = async () => {
      console.log(debouncedUsername);
      
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const res = await axios.post(`/api/unique-username?username=${username}`)
          console.log(res);
          setUsernameMessage(res.data.message);

        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data?.message ?? "Error checking username"
          )
        }
        finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUniqueness();
  }, [username])

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    console.log(data);
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/signup", data)

      toast({
        title: "success",
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
    } catch (error) {
      console.error("Error while signing up a user", error);
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center ">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join mystry message
          </h1>
          <p className="mb-4">
            Signup to start Anonymous message
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debouncedUsername(e.target.value)
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin"/>}
                  <p className={`px-3 ${usernameMessage ==="Username is available"?"text-green-500" :"text-red-500"}`} > {usernameMessage}</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin"/>
                  </>
                ) : ('Signup')
              }
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default page