import { useState } from "react";
import { Link } from "react-router";
import { PRODUCTCARD } from "../types/PRODUCTCARD";
import Button from "./Button";

export default function ProductCard({
  product,
  detailsTo,
  onAddToCart,
}) {
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const { name, image, price } = product;

  return (
    <article className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <button
        type="button"
        className="block w-full cursor-zoom-in bg-neutral-100"
        onClick={() => setIsImageExpanded(true)}
        aria-label={PRODUCTCARD.expandImage(name)}
      >
        <img
          src={image}
          alt={name}
          className="h-48 w-full object-cover"
        />
      </button>

      <div className="space-y-3 p-4">
        <div>
          <h2 className="font-semibold text-neutral-900">{name}</h2>
          <p className="mt-1 text-sm text-neutral-600">${price}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to={detailsTo}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-center text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
          >
            {PRODUCTCARD.details}
          </Link>
          <Button
            variant="verify"
            disabled={!onAddToCart}
            onClick={() => onAddToCart(product)}
          >
            {PRODUCTCARD.addToCart}
          </Button>
        </div>
      </div>

      {isImageExpanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={PRODUCTCARD.image(name)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-neutral-900"
            onClick={() => setIsImageExpanded(false)}
          >
            {PRODUCTCARD.close}
          </button>
          <img
            src={image}
            alt={name}
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        </div>
      )}
    </article>
  );
}