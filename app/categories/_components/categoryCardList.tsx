'use server'

import React from 'react';
import { FaRegMoneyBill1 } from "react-icons/fa6";
import DialogAddNewCategory from './dialogAddNewCategory';
import { formatCurrency } from '@/lib/utils';
import DialogEditCategory from './dialogEditCategory';

// Define the type for a Category based on your API response
interface Category {
    category_id: number; // Assuming an ID field
    str_categoryName: string;
    str_movimentType: 'Input' | 'Output'; // Assuming these are the possible values
    bool_hasBudgetLimit: boolean;
    dbl_budgetLimit: number | null;
    str_image: string | null; // Assuming image can be null
    bool_active: boolean; // Assuming an active status
    // Add other fields if necessary
}

interface CategoryCardListProps {
    userId: string | null | undefined;
    showDialog: boolean;
}

async function getCategories(userId: string | null | undefined): Promise<Category[]> {
    if (!userId) {
        console.log("No user ID found, skipping category fetch.");
        return [];
    } 

    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hummingbird-swart.vercel.app/'
        const response = await fetch(`${baseUrl}/api/categories?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // Or 'no-cache' depending on requirements
        });

        if (!response.ok) {
            // Handle specific status codes if needed
             if (response.status === 404) {
                console.log("No categories found for this user.");
                return []; // Return empty array if no categories found
            }
            throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }

        const data = await response.json();
        // Assuming the API returns an array of category objects directly
        return data;

    } catch (error) {
        console.error("Error in getCategories:", error);
        return []; // Return empty array on error
    }
}

const CategoryCardList: React.FC<CategoryCardListProps> = async ({ userId , showDialog }) => {

    const categories = await getCategories(userId);

    return (
        <>
            {categories.map((category) => (
                // Use a unique key for each card, like category.id
                <div 
                    key={category.category_id} 
                    className='flex flex-col p-[0.1rem] w-[32%] max-lg:w-[49%] max-sm::w-[99%] h-fit bg-gray-100 border-gray-300 border-2 rounded-lg'>

                    {/* Use category.str_image if available, otherwise a default */}
                    <div className={`flex flex-row items-center p-2 rounded-sm w-full h-fit aspect-video bg-cover 
                                    bg-center ${(category.str_image && category.str_image !== 'none') 
                                    ? `bg-[url('${process.env.NEXT_PUBLIC_API_URL || ''}${category.str_image}')]` 
                                    : `bg-[url('/noCategoryAvaliableSmall.png')]`}`}>
                         {/* Agora sempre haverá uma imagem de fundo, então o texto de placeholder não é mais necessário aqui */}
                    </div>

                    {/* Use category.str_image if available, otherwise a default */}
                    {/* <div
                        className={`h-4/6 rounded-sm bg-cover bg-center ${(category.str_image && category.str_image !== 'none') ? `bg-[url('${process.env.NEXT_PUBLIC_API_URL || ''}${category.str_image}')]` : `bg-[url('/noCategoryAvaliableSmall.png')]`}`}
                    > */}
                         {/* Agora sempre haverá uma imagem de fundo, então o texto de placeholder não é mais necessário aqui */}
                    {/* </div> */}
                    <div className='flex flex-row h-fit justify-between p-1'>
                        <div className='flex flex-col justify-around'>
                            {/* Display category name */}
                            <p className="font-semibold">{category.str_categoryName}</p>
                            {/* Display budget limit if applicable */}
                            {category.bool_hasBudgetLimit && category.dbl_budgetLimit !== null && (
                                <div className='flex flex-row items-center'>
                                    <FaRegMoneyBill1 className='pr-2 h-4 w-6'/>
                                    {/* Format the budget limit */}
                                    <p className='text-xs'>Meu limite de gastos é {formatCurrency(category.dbl_budgetLimit)}</p>
                                </div>
                            )}
                             {!category.bool_hasBudgetLimit && (
                                 <p className='text-xs text-gray-500'>Sem limite definido</p>
                             )}
                        </div>
                        {/* Manter este wrapper para o posicionamento correto do menu de ações */}
                        <div className='flex flex-col text-end self-center'> 
                            <DialogEditCategory  category={category} userId={userId}/>
                        </div>
                    </div>
                </div>
            ))}

            {/* The "Add New Category" card, always present */}
            <div className='flex flex-col p-[0.1rem] w-[32%] max-lg:w-[49%] max-sm:w-[99%] h-60 bg-gray-100 border-gray-300 border-2 rounded-lg items-center justify-center'>  
                <DialogAddNewCategory userId={userId} />
            </div>
        </>
    );
}

export default CategoryCardList;
