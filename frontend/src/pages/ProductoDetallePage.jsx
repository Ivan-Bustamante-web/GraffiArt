import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerGabinetes } from '../services/gabineteService';
import { useCartStore } from '../store/cartStore';

export default function ProductoDetallePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [gabinete, setGabinete] = useState(null);
    const [loading, setLoading] = useState(true);
    const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);

    useEffect(() => {
        obtenerGabinetes()
            .then(data => {
                const encontrado = data.find(g => g.id.toString() === id);
                setGabinete(encontrado);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al cargar detalle del producto:", error);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="p-8 text-white text-center">Cargando detalles del producto...</div>;

    if (!gabinete) {
        return (
            <div className="p-8 max-w-3xl mx-auto text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Producto no encontrado</h1>
                <button 
                    onClick={() => navigate('/productos')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition cursor-pointer"
                >
                    Volver al catálogo
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <button 
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-white mb-6 text-sm flex items-center gap-1 cursor-pointer"
            >
                ← Volver
            </button>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-700 pb-6">
                    <div>
                        <span className="text-blue-400 text-sm font-semibold uppercase tracking-wider">Marca: {gabinete.marca}</span>
                        <h1 className="text-3xl font-bold text-white mt-1">{gabinete.nombre}</h1>
                    </div>
                    <span className="text-2xl font-bold text-green-400">$ {gabinete.costoUnitario.toLocaleString()}</span>
                </div>

                <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Especificaciones técnicas</h3>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li>Formato: <span className="text-white font-medium">{gabinete.formato}</span></li>
                            <li>Tamaño: <span className="text-white font-medium">{gabinete.tamano}</span></li>
                            <li>Panel lateral: <span className="text-white font-medium">{gabinete.panel}</span></li>
                        </ul>
                    </div>
                    <div className="bg-gray-900 p-4 rounded border border-gray-700 flex flex-col justify-center">
                        <p className="text-sm text-gray-400 mb-2">Descripción del fabricante</p>
                        <p className="text-gray-300 text-sm">
                            Gabinete de alta calidad optimizado para un rendimiento superior, excelente flujo de aire y diseño moderno compatible con componentes de última generación.
                        </p>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-700 flex justify-end gap-4">
                    <button 
                        onClick={() => {
                            agregarAlCarrito(gabinete);
                            alert(`¡${gabinete.nombre} agregado al carrito!`);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition cursor-pointer"
                    >
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
    );
}