import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useToast } from "@/components/hooks/use-toast";
import Link from "next/link";

const FormSchema = z.object({
  email: z.string().min(1, 'Insira um e-mail').email('E-mail inválido'),
  password: z.string().min(1, 'Insira sua senha').min(8, 'Senhas possuem no mínimo 8 caracteres!'),
  rememberMe: z.boolean().optional()
});

const SignInForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    const signInData = await signIn('credentials', {
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
      redirect: false,
    });

    if (signInData?.error) {
      let errorMessage = "Oops! Something went wrong!";
            
      // Verifica o tipo de erro
      if (signInData.error.includes("E-mail não encontrado")) {
          errorMessage = "E-mail não encontrado. Verifique o endereço digitado.";
      } else if (signInData.error.includes("Senha incorreta")) {
          errorMessage = "Senha incorreta. Tente novamente.";
      }

      toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive"
      });
    } else {
      router.push('/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form className="w-full space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-400">E-mail Address</FormLabel>
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
        <div className="flex justify-between items-center">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-light text-gray-500 !mt-0">
                  Remember me
                </FormLabel>
              </FormItem>
            )}
          />
          <Button variant="ghost" className="h-fit py-0" asChild>
            <Link href="/passwordRecovery" className="text-xs font-semibold text-[#01C14C] underline hover:underline-offset-2">
              Forgot your password?
            </Link>
          </Button>
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