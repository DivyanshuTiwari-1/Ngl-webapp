"use client"
import { useForm ,FormProvider} from "react-hook-form";
import { signIn } from "next-auth/react";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";
import { signinSchema } from "@/app/schemas/signinSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiresponse";
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
const page = () => {
  

    const { toast } = useToast();
   



    const router = useRouter();

    // Zod implementation
    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
          
           identifier: '',
            password: '',
        },
    });
 
    const onSubmit = async (data: z.infer<typeof signinSchema>) => {
        
            const result = await signIn('credentials', {
              redirect: true,
              identifier: data.identifier,
              password: data.password,
            });
            if(result?.error){
              if(result.error == "CredentialsSignin"){
                toast({
                    title:"login failed",
                    description:"incorrect username or password",
                    variant:"destructive"
                })
              }
              else {
                toast({
                    title:"error",
                    description:result.error,
                    variant:"destructive"
                })
              }
            }
            if(result?.url){
              router.replace("/Dashboard");
            }
           
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">Sign in to start your anonymous adventure</p>
                </div>
 <FormProvider {...form}>              
 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
   
      <FormField
      control={form.control}
      name="identifier"
      render={({ field }) => (
        <FormItem>
          <FormLabel>email/username</FormLabel>
          <FormControl>
            <Input placeholder="email/username" {...field} 
                
                />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
       <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>password</FormLabel>
          <FormControl>
            <Input placeholder="password" {...field} 
                
                />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit" >
  signin
</Button>
  </form>
  </FormProvider>
<div className="text-center mt-4">
  <p>
    Already a member?{' '}
    <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
      Sign up
    </Link>
  </p>
</div>

 </div>
 </div>
    );

};
export default page