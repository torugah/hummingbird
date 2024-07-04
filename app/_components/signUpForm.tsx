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

const FormSchema = z.object({
  firstName: z.string().min(6, {
    message: "Username must be at least 6 characters.",
  }),
  lastName: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  eMail: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export function SignUpForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      eMail: "",
      password: "",
      confirmPassword: ""
    },
  })
  
    return (
      <Form {...form}>
        <form className="w-full space-y-2"> {/* TODO: OnSubmit method*/}
        <div className="flex flex-row space-x-2">
            <div className="w-1/2">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-gray-400">First Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John" {...field} />
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
                        <FormLabel className="text-gray-400">Last Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Seed" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>                        
        </div>
        <FormField
          control={form.control}
          name="eMail"
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
        <div className="flex flex-row space-x-2">
            <div className="w-1/2">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-gray-400">Password</FormLabel>
                        <FormControl>
                            <Input placeholder="yourPassword" {...field} />
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
                        <FormLabel className="text-gray-400">Confirm</FormLabel>
                        <FormControl>
                            <Input placeholder="confirmYourPassword" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>                        
        </div>
          <Button className="w-full" type="submit" variant="default">Sign In</Button>
        </form>
      </Form>
    );
  }