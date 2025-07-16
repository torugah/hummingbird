import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/hooks/use-toast";
import { Loader2 } from "lucide-react";

const FormSchema = z
  .object({
    firstName: z.string().min(2,"First Name must be at least 2 characters.").max(50),
    lastName: z.string().min(2, "Last Name must be at least 2 characters.").max(50),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters."),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });

export function SignUpForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);

    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: data.firstName + " " + data.lastName,
        email: data.email,
        password: data.password
      })
    })

    if(response.ok) {
      toast({
        title: "Sucesso!",
        description: "Criamos seu usuário! Agora faça o login.",
      })
      
      setTimeout(() => {
        router.push('/')
      }, 3000);    
    } else {
      toast({
        title: "Error",
        description: "Oops! Something when wrong!",
        variant: "destructive"
      })
    }

    setIsLoading(false);
  };
  
  return (
    <Form {...form}>
      <form className="w-full space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-row space-x-2">
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Marco" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Sobrenome</FormLabel>
                  <FormControl>
                    <Input placeholder="Barros" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>                        
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-400">E-mail</FormLabel>
              <FormControl>
                <Input placeholder="eu@meuEmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row space-x-2">
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="suaS3nh4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Confirme sua senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="confime sua senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>                        
        </div>
        <Button className="w-full" type="submit" variant="default" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando...
            </>
          ) : (
            "Criar"
          )}
        </Button>
      </form>
    </Form>
  );
}
