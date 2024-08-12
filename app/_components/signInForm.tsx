import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z.string().min(6, {
    message: "Username must be at least 6 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export function SignInForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const { email, password } = form.getValues(); 

    try {
      const response = await signIn('credentials', {
        redirect: false,
        email,
        password
      })

      console.log('[LOGIN_RESPONSE]: ', response)

      if(!response?.error) {
        router.refresh()
        router.push('/dashboard')
      }
    } catch (error) {
      console.log('[LOGIN_ERROR]: ', error)
    }
  }
  
    return (
      <Form {...form}>
        <form className="w-full space-y-6" onSubmit={handleLogin}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-400">E-mail Addrres</FormLabel>
              <FormControl>
                <Input placeholder="me@myEmail.com" {...field} />
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
              <FormLabel className="text-gray-400">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="maybe1234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="items-center">
          <div className="items-center flex space-x-2 float-left">
            <Checkbox id="terms1" />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms1"
                className="text-sm font-light text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Remember me
              </label>
            </div>
          </div>
          <div className="float-right">
            <p className="text-xs font-semibold text-[#01C14C] underline cursor-pointer hover:underline-offset-2" >Forgot your password?</p>
            {/* TODO: Fazer tela de Reset Password */}
          </div>          
        </div>        
          <Button className="w-full" type="submit" variant="default">Sign In</Button>
        </form>
      </Form>
    );
  }