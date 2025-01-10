"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
	category: string;
	price: number;
	quantity: number;
	code: string;
}

interface CartStore {
	items: CartItem[];
	isOpen: boolean;
	addItem: (item: CartItem) => void;
	removeItem: (id: string) => void;
	updateQuantity: (id: string, quantity: number) => void;
	toggleCart: () => void;
}

export const useCartStore = create(
	persist<CartStore>(
		(set) => ({
			items: [],
			isOpen: false,
			addItem: (item) =>
				set((state) => {
					const existingItem = state.items.find((i) => i.code === item.code);
					if (existingItem) {
						return {
							items: state.items.map((i) =>
								i.code === item.code ? { ...i, quantity: i.quantity + 1 } : i
							),
						};
					}
					return {
						items: [...state.items, { ...item, quantity: 1 }],
					};
				}),
			removeItem: (id) =>
				set((state) => ({
					items: state.items.filter((item) => item.code !== id),
				})),
			updateQuantity: (id, quantity) =>
				set((state) => ({
					items: state.items.map((item) =>
						item.code === id
							? { ...item, quantity: Math.max(0, quantity) }
							: item
					),
				})),
			toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
		}),
		{
			name: "cart-storage", // Key for localStorage
			// partialize: (state) => ({ items: state.items || [] }), // Persist only the `items` field
		}
	)
);
