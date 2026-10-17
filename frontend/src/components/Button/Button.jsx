import { BUTTON_VARIANTS } from "../../constants/STYLES";

// Botón reutilizable con distintos estilos.
// Props:
//   variant: estilo: primary, secondary, compact, danger, linkEdit, linkDelete, etc.
//   type: button (por defecto) o submit para enviar formularios
//   children: texto o contenido del botón
const Button = ({
  variant = "primary",
  type = "button",
  children,
  ...buttonProps
}) => {
  return (
    <button
      type={type}
      className={BUTTON_VARIANTS[variant]}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default Button;
