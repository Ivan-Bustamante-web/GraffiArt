import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';

export default function CarritoPage() {
    const { carrito, incrementarCantidad, decrementarCantidad, removerDelCarrito, vaciarCarrito } = useCartStore();
    const navigate = useNavigate();

    const precioTotal = carrito.reduce((acc, item) => {
        const precioUnitario = Number(item.precioUnitario ?? item.gabinete?.costoUnitario ?? item.costoUnitario ?? 0);
        return acc + precioUnitario * item.cantidad;
    }, 0);

    const handleCheckout = () => {
        alert("¡Compra realizada con éxito! (Simulación)");
        vaciarCarrito();
        navigate('/productos');
    };

    if (carrito.length === 0) {
        return (
            <div className="p-8 max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Tu Carrito está vacío</h1>
                <p className="text-gray-400 mb-6">Aún no has agregado ningún gabinete del fabricante a tu carrito.</p>
                <button 
                    onClick={() => navigate('/productos')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition cursor-pointer"
                >
                    Ver Catálogo de Productos
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Carrito de Compras</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de productos en el carrito */}
                <div className="lg:col-span-2 space-y-4">
                    {carrito.map(item => {
                        const gabinete = item.gabinete || item;
                        const nombre = gabinete.nombre || item.disenoguardado?.nombre || 'Diseño personalizado';
                        const precioUnitario = Number(item.precioUnitario ?? gabinete.costoUnitario ?? 0);
                        const subtotal = precioUnitario * item.cantidad;

                        return (
                        <div key={item.id} className="bg-gray-800 border border-gray-700 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold text-white">{nombre}</h2>
                                {gabinete.marca && <p className="text-gray-400 text-sm">Marca: <span className="text-white">{gabinete.marca}</span></p>}
                                {gabinete.formato && (
                                    <div className="text-xs text-gray-300 space-x-2">
                                        <span>Formato: <strong className="text-white">{gabinete.formato}</strong></span>
                                        <span>•</span>
                                        <span>Tamaño: <strong className="text-white">{gabinete.tamano}</strong></span>
                                        <span>•</span>
                                        <span>Panel: <strong className="text-white">{gabinete.panel}</strong></span>
                                    </div>
                                )}
                                
                                {/* Botón de ver detalles en la tarjeta del producto */}
                                <button 
                                    onClick={() => navigate(`/productos/${gabinete.id}`)}
                                    className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded transition font-medium cursor-pointer inline-block"
                                    hidden={!gabinete.id}
                                >
                                    Ver detalles
                                </button>

                                <p className="text-green-400 font-bold pt-1">$ {precioUnitario.toLocaleString()} c/u</p>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-700">
                                <div className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded border border-gray-700">
                                    <button 
                                        onClick={() => decrementarCantidad(item.id)}
                                        className="text-gray-300 hover:text-white px-1 font-bold cursor-pointer"
                                    >
                                        -
                                    </button>
                                    <span className="text-white font-bold px-2">{item.cantidad}</span>
                                    <button 
                                        onClick={() => incrementarCantidad(item.id)}
                                        className="text-gray-300 hover:text-white px-1 font-bold cursor-pointer"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="text-right min-w-[90px]">
                                    <p className="text-xs text-gray-400">Subtotal</p>
                                    <p className="text-white font-bold">$ {subtotal.toLocaleString()}</p>
                                </div>

                                <button 
                                    onClick={() => removerDelCarrito(item.id)}
                                    className="text-red-400 hover:text-red-300 p-2 text-sm transition cursor-pointer"
                                    title="Eliminar producto"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                        );
                    })}

                    <div className="flex justify-between items-center pt-2">
                        <button 
                            onClick={vaciarCarrito}
                            className="text-gray-400 hover:text-red-400 text-sm underline transition cursor-pointer"
                        >
                            Vaciar carrito
                        </button>
                    </div>
                </div>

                {/* Resumen de compra (Limpio y sin botones de detalle) */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 h-fit space-y-4">
                    <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-3">Resumen del pedido</h2>
                    
                    <div className="flex justify-between text-gray-300">
                        <span>Subtotal</span>
                        <span>$ {precioTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                        <span>Envío</span>
                        <span className="text-green-400 font-medium">Gratis</span>
                    </div>

                    <div className="border-t border-gray-700 pt-3 flex justify-between text-lg font-bold text-white">
                        <span>Total</span>
                        <span className="text-green-400">$ {precioTotal.toLocaleString()}</span>
                    </div>

                    <button 
                        onClick={handleCheckout}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition cursor-pointer mt-4"
                    >
                        Finalizar Compra
                    </button>
                </div>
            </div>
        </div>
    );
}