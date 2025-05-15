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
import { Loader2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useToast } from "@/components/hooks/use-toast";
  
const FormSchema = z.object({
  email: z.string().min(1, 'Insira um e-mail').email('E-mail inválido'),
  password: z.string().min(1, 'Insira sua senha').min(8,'Senhas possuem no mínimo 8 caracteres!')
})

const SignInForm = () => {
  const router = useRouter();
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (values:z.infer<typeof FormSchema> ) => {
    setIsLoading(true);
    const signInData = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    console.log('LOGIN >>>>>>>>>>> ',signInData)

    if(signInData?.error){
      toast({
        title: "Error",
        description: "Oops! Something when wrong!",
        variant: "destructive"
      })
    } else {
      router.push('/dashboard');
    }
    setIsLoading(false);
  }  

  return (
    <Form {...form}>
      <form className="w-full space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-400">E-mail Addrres</FormLabel>
            <FormControl>
              <Input placeholder="mail@example.com" type="email" {...field} />
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
              <Input type="password" placeholder="Enter your password" {...field} />
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
      <Button className="w-full disabled:cursor-progress" type="submit" variant="default" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
      </form>
    </Form>
  );
};


export default SignInForm;