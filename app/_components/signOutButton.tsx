'use client'

import { signOut } from "next-auth/react"

export const SignOutButton = () => {
    return (
        <button className="bg-red-600 text-white px-2 py-1 rounded-sm" onClick={() => signOut()}>Sair</button>
    )
}