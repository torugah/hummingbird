'use client'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaPlusCircle } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from "next/image"
import { useToast } from "@/components/hooks/use-toast"
import { useRouter } from 'next/navigation'
import { NumericFormat } from 'react-number-format'
import { Upload } from 'lucide-react';
import { ImageCropperDialog } from './ImageCropperDialog';

const FormSchema = z.object({
  str_wishName: z.string().min(3, "Mínimo de 3 caracteres"),
  str_wishDescription: z.string().optional(),
  dbl_wishValue: z.string().refine(val => {
    const numericValue = val.replace(/[^0-9]/g, "");
    return numericValue.length > 0;
  }, "Valor inválido"),
  str_image: z.string().optional()
});

type EditFormValues = z.infer<typeof FormSchema>;

interface ChildComponentProps {
  userId: string | null | undefined;
}

const DialogAddNewWish: React.FC<ChildComponentProps> = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const [cropperOpen, setCropperOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo de imagem válido.",
        variant: "destructive",
      });
      return;
    }

    setSelectedImageFile(file);
    setCropperOpen(true);
  };

  const handleUploadBackgroundImage = async (croppedImage: Blob) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", croppedImage, selectedImageFile?.name || 'image.jpg');
      formData.append("userId", userId || "");

      const response = await fetch("/api/uploadImageNOPE", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar imagem");
      }

      const data = await response.json();
      form.setValue("str_image", data.imageUrl);
      toast({
        title: "Sucesso!",
        description: "Imagem atualizada com sucesso!",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar a imagem.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSelectedImageFile(null);
    }
  };

  const form = useForm<EditFormValues>({
    resolver: zodResolver(FormSchema),
    values: {
      str_wishName: "",
      str_wishDescription: "",
      dbl_wishValue: "0.0",
      str_image: "none"
    },
  });

  const { reset } = form

  const handleCancel = () => {
    reset()
  }

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true)

    // Format credit limit
    const rawValue = data.dbl_wishValue.replace(/[^0-9]/g, "")
    const numericValue = parseFloat(rawValue) / 100

    const requestBody = {
      str_user_id: userId,
      str_wishName: data.str_wishName,
      str_wishDescription: data.str_wishDescription,
      dbl_wishValue: numericValue,
      str_image: data.str_image
    }

    try {
      console.log("Request body before send:", JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/desires?userId=${userId}`, {
        cache: 'no-store',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Registro salvo!",
        })
        handleCancel()
        router.refresh()
      } else {
        throw new Error('Falha ao salvar')
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Oops! Algo deu errado!",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button className="p-2">
            <FaPlusCircle className="h-24 w-24 text-gray-400 hover:text-[#01C14C] hover:cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] rounded-lg max-h-[80vh] overflow-y-auto dialog-scroll-container pr-2">
          <DialogHeader>
            <DialogTitle>Adicionar Desejo</DialogTitle>
            <DialogDescription>
              Adicione as informações abaixo e salve-as.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              id="addWishForm"
              className="w-full space-y-4 py-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-row max-lg:flex-col space-x-2">
                <div className="w-1/2 max-lg-w-[100%]">
                  <FormField
                    control={form.control}
                    name="str_wishName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Item</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nome do item"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-1/2 max-lg-w-[100%]">
                  <FormField
                    control={form.control}
                    name="dbl_wishValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor do Item</FormLabel>
                        <FormControl>
                          <NumericFormat
                            value={field.value}
                            onValueChange={(values) => {
                              field.onChange(values.value);
                            }}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                            fixedDecimalScale={true}
                            decimalScale={2}
                            placeholder="R$ 0,00"
                            customInput={Input}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="str_wishDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Descrição do item"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center items-center pt-2">
                <label htmlFor="upload" className="cursor-pointer flex flex-col items-center justify-center w-2/3 h-fit aspect-video bg-gray-100 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-200 transition">
                  <Upload className="w-10 h-10 mb-2" />
                  {selectedImageFile ? selectedImageFile.name : "Carregar imagem"}
                </label>
                <input
                  id="upload"
                  type="file"
                  className="hidden"
                  accept="image/jpeg, image/jpg, image/gif, image/png, image/webp"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </div>
            </form>
          </Form>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" onClick={handleCancel}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading} form="addWishForm">
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImageCropperDialog
        open={cropperOpen}
        onOpenChange={setCropperOpen}
        imageFile={selectedImageFile}
        onCropComplete={handleUploadBackgroundImage}
        aspect={16 / 9}
      />
    </>
  )
}

export default DialogAddNewWish