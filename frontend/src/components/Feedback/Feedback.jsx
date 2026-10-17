import { FEEDBACK_STYLES } from "../../constants/STYLES";

// Aviso de color para informar al usuario: éxito, error o advertencia.
// Props:
//   type: success (verde), error (rojo) o warning (amarillo)
//   children: el mensaje a mostrar
const Feedback = ({ type, children }) => { // ALERT
  const feedback = FEEDBACK_STYLES[type];

  if (!feedback) {
    throw new Error(`Tipo de feedback no válido: ${type}`);
  }

  return (
    <div
      role={feedback.role}
      className={`mb-5 rounded-xl border p-4 text-sm ${feedback.className}`}
    >
      <div className="flex items-start gap-2">
        <span
          aria-hidden="true"
          className={`text-base font-bold ${feedback.iconClassName}`}
        >
          {feedback.icon}
        </span>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default Feedback;