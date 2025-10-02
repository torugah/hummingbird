'use client'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaPlusCircle } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from "next/image"
import { useToast } from "@/components/hooks/use-toast"
import { useRouter } from 'next/navigation'
import { NumericFormat } from 'react-number-format'

const FormSchema = z.object({
  bank_id: z.number().min(1, "Selecione um banco"),
  dbl_creditLimit: z.string().refine(val => {
    // Remove todos os caracteres não numéricos
    const numericValue = val.replace(/[^0-9]/g, "");
    // Verifica se tem pelo menos 1 dígito (já que min(1) já faz isso)
    return numericValue.length > 0;
  }, "Valor inválido"),
  str_dueDate: z.string()
    .min(5, "Data inválida")
    .refine(val => {
      const [month, year] = val.split('/')
      const monthNum = parseInt(month)
      const yearNum = parseInt(year)
      return monthNum >= 1 && monthNum <= 12 && yearNum >= 0 && yearNum <= 99
    }, "Data inválida"),
  str_lastNumbers: z.string().min(4, "Coloque os 4 últimos números").max(4, "Apenas os últimos 4 números")
})

interface ChildComponentProps {
  userId: string | null | undefined;
}

interface Bank {
  bank_id: number;
  str_bankName: string;
  str_image: string;
}

const DialogAddNewCard: React.FC<ChildComponentProps> = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [banks, setBanks] = useState<Bank[]>([])

  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      bank_id: 1,
      dbl_creditLimit: "15000",
      str_dueDate: "",
      str_lastNumbers: "",
    },
  })

  const { reset } = form

  const handleCancel = () => {
    reset()
  }

  // Fetch banks data
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch("/api/getBanks")
        if (!response.ok) throw new Error('Failed to fetch banks')
        const data = await response.json()
        setBanks(data)
      } catch (error) {
        console.error('Error fetching banks:', error)
      }
    }
    fetchBanks()
  }, [])

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true)

    // Format due date to MM/YY
    const [month, year] = data.str_dueDate.split('/')
    const fullYear = `20${year}` // Assuming 21st century
    const dueDate = new Date(parseInt(fullYear), parseInt(month) - 1, 1)

    // Format credit limit
    const rawValue = data.dbl_creditLimit.replace(/[^0-9]/g, "")
    const numericValue = parseFloat(rawValue) / 100

    const requestBody = {
      str_user_id: userId,
      str_bank_id: data.bank_id,
      dbl_creditLimit: numericValue,
      dtm_dueDate: dueDate.toISOString(), // Converta para ISO string
      str_lastNumbers: data.str_lastNumbers,
    }

    try {
      // console.log("Request body before send:", JSON.stringify(requestBody, null, 2));

      const response = await fetch('/api/cards', {
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
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2">
          <FaPlusCircle className="h-24 w-24 text-gray-400 hover:text-[#01C14C] hover:cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Cartão</DialogTitle>
          <DialogDescription>Adicione as informações abaixo e salve-as.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="dialogForm"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Bank Select */}
            <FormField
              control={form.control}
              name="bank_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banco</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um banco" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {banks.map((bank) => (
                        <SelectItem key={bank.bank_id} value={bank.bank_id.toString()}>
                          <div className="flex items-center gap-2">
                            <Image
                              src={bank.str_image}
                              alt={bank.str_bankName}
                              width={24}
                              height={24}
                              className="w-6 h-6 object-contain"
                              unoptimized
                            />
                            <span>{bank.str_bankName}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Credit Limit Input */}
            <FormField
              control={form.control}
              name="dbl_creditLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite do Cartão</FormLabel>
                  <FormControl>
                    <NumericFormat
                      value={field.value}
                      onValueChange={(values) => {
                        field.onChange(values.value)
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

            {/* Last 4 Digits */}
            <FormField
              control={form.control}
              name="str_lastNumbers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Últimos 4 Dígitos</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex: 1234"
                      maxLength={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Due Date */}
            <FormField
              control={form.control}
              name="str_dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Vencimento (MM/AA)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="MM/AA"
                      maxLength={5}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value.length === 2 && !field.value.includes('/')) {
                          field.onChange(value + '/')
                        } else {
                          field.onChange(value)
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost" onClick={handleCancel}>Cancelar</Button>
          </DialogClose>
          <Button
            type="submit"
            form="dialogForm"
            disabled={isLoading}
          >
            {isLoading ? "Carregando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogAddNewCard