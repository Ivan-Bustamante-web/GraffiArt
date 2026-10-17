import { useState } from "react";
import { Link } from "react-router";
import CartItem from "../../components/CartItem/CartItem";
import Button from "../../components/Button/Button";
import Feedback from "../../components/Feedback/Feedback";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import MainContainer from "../../components/MainContainer/MainContainer";
import StateMessage from "../../components/StateMessage/StateMessage";
import { MESSAGES } from "../../constants/MESSAGES";
import { selectPrecioTotal, useCartStore } from "../../store/cartStore";
import { ROUTES } from "../../constants/ROUTES";

const M = MESSAGES.cart;

// Página del carrito de compras: lista de productos, resumen y compra.
const Carrito = () => {
  const carrito = useCartStore((state) => state.carrito);
  const total = useCartStore(selectPrecioTotal);
  const incrementarCantidad = useCartStore((s) => s.incrementarCantidad);
  const decrementarCantidad = useCartStore((s) => s.decrementarCantidad);
  const removerDelCarrito = useCartStore((s) => s.removerDelCarrito);
  const vaciarCarrito = useCartStore((s) => s.vaciarCarrito);
  const [purchased, setPurchased] = useState(false);

  const handleCheckout = () => {
    vaciarCarrito();
    setPurchased(true);
  };

  if (carrito.length === 0) {
    return (
      <MainContainer width="md">
        {purchased && <Feedback type="success">{M.checkoutSuccess}</Feedback>}
        <StateMessage
          title={M.emptyTitle}
          action={
            <Link
              to={ROUTES.products}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
            >
              {M.viewCatalog}
            </Link>
          }
        >
          {M.emptyText}
        </StateMessage>
      </MainContainer>
    );
  }

  return (
    <MainContainer title={M.title} width="xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {carrito.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrement={() => incrementarCantidad(item.id)}
              onDecrement={() => decrementarCantidad(item.id)}
              onRemove={() => removerDelCarrito(item.id)}
            />
          ))}
          <Button variant="mutedText" onClick={vaciarCarrito}>
            {M.clear}
          </Button>
        </div>

        <OrderSummary total={total} onCheckout={handleCheckout} />
      </div>
    </MainContainer>
  );
};

export default Carrito;
