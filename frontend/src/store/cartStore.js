import { create } from 'zustand';

export const useCartStore = create((set) => ({
    carrito: [],
    
    agregarAlCarrito: (gabinete) => set((state) => {
        const existe = state.carrito.find(item => item.id === gabinete.id);
        if (existe) {
            return {
                carrito: state.carrito.map(item => 
                    item.id === gabinete.id ? { ...item, cantidad: item.cantidad + 1 } : item
                )
            };
        }
        return { carrito: [...state.carrito, { ...gabinete, cantidad: 1 }] };
    }),

    incrementarCantidad: (id) => set((state) => ({
        carrito: state.carrito.map(item => 
            item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
    })),

    decrementarCantidad: (id) => set((state) => ({
        carrito: state.carrito.map(item => {
            if (item.id === id) {
                return { ...item, cantidad: Math.max(1, item.cantidad - 1) };
            }
            return item;
        })
    })),

    removerDelCarrito: (id) => set((state) => ({
        carrito: state.carrito.filter(item => item.id !== id)
    })),

    vaciarCarrito: () => set({ carrito: [] })
}));