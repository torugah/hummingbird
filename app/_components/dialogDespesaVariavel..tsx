'use client'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import React, { useState } from 'react'

const DialogDPV = () => {

    const [isParcelado, setIsParcelado] = useState(false);

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Adicionar</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Nova Despesa</DialogTitle>
                        <DialogDescription>
                            Inclua aqui suas despesas fixas, aluguel por exemplo 🏠 Clique em salver quando preencher tudo 😉.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="identificador" className="text-right">
                                Identificador
                            </Label>
                            <Input
                                id="identificador"
                                placeholder="Nome do Item"
                                className="col-span-3"
                                type="text"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="itemValue" className="text-right">
                                Valor
                            </Label>
                            <Input
                                id="itemValue"
                                placeholder="R$ #.###,##"
                                className="col-span-3"
                                type="text"
                            />
                        </div>
                        <div className={`flex items-center justify-${isParcelado ? 'between' : 'center' } space-x-2 transition-all duration-300 ease-in-out`}>
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="parcelado"
                                    checked={isParcelado}
                                    onCheckedChange={setIsParcelado} // Atualiza o estado com o valor do switch
                                />
                                <Label htmlFor="parcelado">Está parcelado?</Label>
                            </div>

                            {/* Campo condicional que aparece suavemente se isParcelado for true */}
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isParcelado ? 'opacity-100 w-3/6' : 'opacity-0 max-w-0' }`}>
                                <Input
                                    id="num-parcelas"
                                    placeholder="Quantas Parcelas?"
                                    className="col-span-3 w-full"
                                    type="number"
                                />
                            </div>
                        </div>

                        <div className="flex flex-row items-center justify-between space-x-2">
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Em qual conta?" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Seus bancos</SelectLabel>
                                    <SelectItem value="1">Banco do Brasil</SelectItem> {/*Values serão alterados posteriomente*/}
                                    <SelectItem value="2">Itaú Unibanco</SelectItem>
                                    <SelectItem value="3">Nubank</SelectItem>
                                    <SelectItem value="4">Inter</SelectItem>
                                    <SelectItem value="5">Next</SelectItem>
                                    <SelectItem value="6">Bradesco</SelectItem>
                                    {/*Deverá também ter forma de pagamento com dinhero físico*/}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Forma Paga?" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Formas de Pagamento</SelectLabel>
                                    <SelectItem value="1">Débito</SelectItem>
                                    <SelectItem value="2">Crédito</SelectItem>
                                    <SelectItem value="3">PIX Débito</SelectItem>
                                    <SelectItem value="4">PIX Crédito</SelectItem>
                                    <SelectItem value="5">Boleto</SelectItem>
                                    <SelectItem value="6">Outro</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        </div>                        
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit">Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DialogDPV;