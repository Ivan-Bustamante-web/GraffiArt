import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerGabinetes } from '../services/gabineteService';
import { useCartStore } from '../store/cartStore';

function TarjetaGabinete({ gab }) {
    const navigate = useNavigate();
    const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);
    const [agregado, setAgregado] = useState(false);

    const handleAgregar = async () => {
        await agregarAlCarrito(gab);
        setAgregado(true);
        setTimeout(() => setAgregado(false), 2000);
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow-lg flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-semibold text-white">{gab.nombre}</h2>
                <p className="text-gray-400 text-sm mt-1">Marca: {gab.marca}</p>
                <div className="mt-3 text-sm text-gray-300 space-y-1">
                    <p>Formato: <span className="text-white font-medium">{gab.formato}</span></p>
                    <p>Tamaño: <span className="text-white font-medium">{gab.tamano}</span></p>
                    <p>Panel: <span className="text-white font-medium">{gab.panel}</span></p>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700 flex flex-col gap-3">
                <span className="text-lg font-bold text-green-400">
                    $ {Number(gab.costoUnitario).toLocaleString()}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate(`/productos/${gab.id}`)}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition font-medium cursor-pointer"
                    >
                        Ver detalles
                    </button>
                    <button
                        onClick={handleAgregar}
                        className={`flex-1 px-3 py-2 rounded text-sm transition font-medium cursor-pointer text-white ${
                            agregado ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {agregado ? '✓ Agregado' : 'Agregar al carrito'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ProductosPage() {
    const [gabinetes, setGabinetes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerGabinetes()
            .then(data => {
                setGabinetes(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al cargar productos:", error);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="p-8 text-white text-center">Cargando catálogo...</div>
    );

    if (gabinetes.length === 0) return (
        <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Catálogo de Gabinetes</h1>
            <p className="text-gray-400">No hay productos disponibles por el momento.</p>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Catálogo de Gabinetes</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {gabinetes.map(gab => (
                    <TarjetaGabinete key={gab.id} gab={gab} />
                ))}
            </div>
        </div>
    );
}