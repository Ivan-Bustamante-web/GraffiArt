import { Link } from "react-router";
import MainContainer from "../../components/MainContainer/MainContainer";
import { ADMIN_CARDS } from "../../constants/ADMIN_CARDS";
import { MESSAGES } from "../../constants/MESSAGES";

const A = MESSAGES.admin;

// Tarjeta con link a una sección del panel de administración.
// Props:
//   to: dirección a la que lleva
//   title: título de la tarjeta
//   children: descripción corta
const AdminCard = ({ to, title, children }) => {
  return (
    <Link
      to={to}
      className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <h2 className="mb-2 text-lg font-semibold text-neutral-900">{title}</h2>
      <p className="text-sm text-neutral-600">{children}</p>
    </Link>
  );
};

// Página principal del panel de administración, con accesos a categorías, productos e inventario.
const Admin = () => {
  return (
    <MainContainer title={A.title} subtitle={A.subtitle}>
      <div className="grid gap-6 md:grid-cols-3">
        {ADMIN_CARDS.map(({ to, title, text }) => (
          <AdminCard key={to} to={to} title={title}>
            {text}
          </AdminCard>
        ))}
      </div>
    </MainContainer>
  );
};

export default Admin;
