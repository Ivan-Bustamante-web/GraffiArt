import Feedback from "../../components/Feedback/Feedback";
import MainContainer from "../../components/MainContainer/MainContainer";
import ProductCard from "../../components/ProductCard/ProductCard";
import StateMessage from "../../components/StateMessage/StateMessage";
import { MESSAGES } from "../../constants/MESSAGES";
import { useGabinetes } from "../../hooks/useGabinetes";
import { useCartStore } from "../../store/cartStore";
import { gabineteToProduct } from "../../utils/gabinete";
import { ROUTES } from "../../constants/ROUTES";

const M = MESSAGES.catalog;

// Página del catálogo: muestra todos los gabinetes disponibles.
const Productos = () => {
  const { gabinetes, loading, error } = useGabinetes();
  const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);

  return (
    <MainContainer title={M.title} width="xl">
      {error && <Feedback type="error">{error}</Feedback>}
      {loading ? (
        <StateMessage>{M.loading}</StateMessage>
      ) : gabinetes.length === 0 ? (
        !error && <StateMessage>{M.empty}</StateMessage>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {gabinetes.map((gabinete) => (
            <ProductCard
              key={gabinete.id}
              product={gabineteToProduct(gabinete)}
              detailsTo={ROUTES.productDetail(gabinete.id)}
              onAddToCart={() => agregarAlCarrito(gabinete)}
            />
          ))}
        </div>
      )}
    </MainContainer>
  );
};

export default Productos;
