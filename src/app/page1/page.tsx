"use client";

import React, { useState } from 'react';
import { getAllItems, deleteItem, createItem, updateItem } from "../services/items";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader, Card } from '../components/index';

interface Page1Props { }

const Page1: React.FC<Page1Props> = () => {
    const queryClient = useQueryClient()
    const [isMutating, setIsMutating] = useState(false);
    const { data, isLoading, isFetching } = useQuery({ queryKey: ['items'], queryFn: getAllItems, staleTime: 10000 })

    const deleteMutation = useMutation({
        mutationFn: deleteItem,
        onMutate: async (id: string) => {
            setIsMutating(true);
            await queryClient.cancelQueries({ queryKey: ['items'] })
            const previousItems = queryClient.getQueryData(['items'])
            queryClient.setQueryData(['items'], (old: any) => old.filter((item: any) => item._id !== id))
            return { previousItems }
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['items'] }); setIsMutating(false) },
    })

    const createItemMutation = useMutation({
        mutationFn: createItem,
        onMutate: async (item: any) => {
            setIsMutating(true);
            await queryClient.cancelQueries({ queryKey: ['items'] })
            const previousItems = queryClient.getQueryData(['items'])
            queryClient.setQueryData(['items'], (old: any) => [...old, item])
            return { previousItems }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] }); setIsMutating(false);
        },
    })

    const updateItemMutation = useMutation({
        mutationFn: ({ id, item }: { id: string, item: any }) => updateItem(id, item),
        onMutate: async ({ id, item }: { id: string, item: any }) => {
            setIsMutating(true);
            await queryClient.cancelQueries({ queryKey: ['items'] })
            const previousItems = queryClient.getQueryData(['items'])
            queryClient.setQueryData(['items'], (old: any) => old.map((oldItem: any) => oldItem._id === id ? item : oldItem))
            return { previousItems }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] }); setIsMutating(false);
        },
    })

    const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const item = {
            model_name: (form[0] as HTMLInputElement).value,
            color: (form[1] as HTMLInputElement).value,
            plate_number: (form[2] as HTMLInputElement).value,
        }
        createItemMutation.mutate(item);
    };

    const form = () => {
        return (
            <form onSubmit={handleAddItem} className='form-layout'>
                <input type="text" placeholder={data.model_name} defaultValue={data.model_name} />
                <input type="text" placeholder={data.color} defaultValue={data.color} />
                <input type="text" placeholder={data.plate_number} defaultValue={data.plate_number} />
                <button type="submit">Add Item</button>
            </form>
        );
    }

    return (
        <div>
            {(isLoading || isFetching || isMutating) && <Loader />}
            <h1>Items</h1>
            {data && form()}

            <br />

            <div className="loader-animation" />
            {data && data.map((book: any, idx: number) => {
                return (
                    <Card
                        key={idx}
                        data={book}
                        onDelete={() => deleteMutation.mutate(book._id)}
                        onUpdate={(item: any) => updateItemMutation.mutate({ id: book._id, item })}
                    />
                );
            })}
        </div>
    );
}

export default Page1;