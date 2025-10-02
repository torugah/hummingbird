// components/InstallmentHandler.tsx
"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface InstallmentPreview {
  installmentNumber: number
  value: number
  dueDate: Date
  status: 'pending' | 'paid'
}

interface InstallmentHandlerProps {
  totalValue: number
  installmentCount: number
  startDate: Date
  onInstallmentsChange: (installments: InstallmentPreview[]) => void
}

export function InstallmentHandler({ 
  totalValue, 
  installmentCount, 
  startDate, 
  onInstallmentsChange 
}: InstallmentHandlerProps) {
  const [installments, setInstallments] = useState<InstallmentPreview[]>([])

  useEffect(() => {
    if (installmentCount > 1 && totalValue > 0) {
      const installmentValue = totalValue / installmentCount
      const newInstallments: InstallmentPreview[] = []

      for (let i = 0; i < installmentCount; i++) {
        const dueDate = new Date(startDate)
        dueDate.setMonth(startDate.getMonth() + i)
        
        newInstallments.push({
          installmentNumber: i + 1,
          value: installmentValue,
          dueDate,
          status: 'pending'
        })
      }

      setInstallments(newInstallments)
      onInstallmentsChange(newInstallments)
    } else {
      setInstallments([])
      onInstallmentsChange([])
    }
  }, [totalValue, installmentCount, startDate, onInstallmentsChange])

  if (installmentCount <= 1 || installments.length === 0) {
    return null
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">Prévia das Parcelas</CardTitle>
        <CardDescription>
          {installmentCount} parcelas de {installments[0]?.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {installments.map((installment) => (
            <div key={installment.installmentNumber} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{installment.installmentNumber}</Badge>
                <span className="text-sm font-medium">
                  {installment.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {format(installment.dueDate, "MMM/yyyy", { locale: ptBR })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}