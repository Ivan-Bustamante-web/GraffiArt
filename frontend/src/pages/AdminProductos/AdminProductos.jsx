import Button from "../../components/Button/Button";
import DataTable from "../../components/DataTable/DataTable";
import EntityForm from "../../components/EntityForm/EntityForm";
import Feedback from "../../components/Feedback/Feedback";
import MainContainer from "../../components/MainContainer/MainContainer";
import StateMessage from "../../components/StateMessage/StateMessage";
import {
  FORMATOS,
  MATERIALES_CHASIS,
  PANELES,
  TAMANOS,
} from "../../constants/CATALOGO";
import { PRODUCTO_FORM } from "../../constants/FORMS";
import { MESSAGES } from "../../constants/MESSAGES";
import useCrudResource from "../../hooks/useCrudResource";
import useFetch from "../../hooks/useFetch";
import { productoSchema } from "../../schemas/entities";
import { listarCategorias } from "../../services/categoriaService";
import productoService from "../../services/productoService";
import { formatPrice } from "../../utils/format";

const M = MESSAGES.admin.productos;

const toFormValues = (producto) => ({
  nombre: producto.nombre || "",
  marca: producto.marca || "",
  costoUnitario: producto.costoUnitario || "",
  stockActual: producto.stockActual ?? 0,
  stockMinimo: producto.stockMinimo ?? 0,
  tamano: producto.tamano || PRODUCTO_FORM.initialValues.tamano,
  formato: producto.formato || PRODUCTO_FORM.initialValues.formato,
  materialChasis: producto.materialChasis || PRODUCTO_FORM.initialValues.materialChasis,
  panel: producto.panel || PRODUCTO_FORM.initialValues.panel,
  categoriaId: producto.categoriaId || "",
});

// Página de administración de productos: crear, editar y eliminar.
const AdminProductos = () => {
  const crud = useCrudResource({
    key: "productos",
    service: productoService,
    schema: productoSchema,
    initialValues: PRODUCTO_FORM.initialValues,
    toFormValues,
    messages: M,
  });
  const { data: categorias } = useFetch(
    "categorias",
    listarCategorias,
    M.loadError,
  );

  const fields = [
    ...PRODUCTO_FORM.fields.slice(0, 5),
    {
      ...PRODUCTO_FORM.categoryField,
      options: (categorias ?? []).map((c) => ({ value: c.id, label: c.nombre })),
    },
    ...PRODUCTO_FORM.fields.slice(5),
  ];

  const columns = [
    { header: PRODUCTO_FORM.columns.product, key: "nombre" },
    { header: PRODUCTO_FORM.columns.brand, key: "marca" },
    { header: PRODUCTO_FORM.columns.category, render: (p) => p.categoria?.nombre || PRODUCTO_FORM.noCategory },
    { header: PRODUCTO_FORM.columns.cost, render: (p) => formatPrice(p.costoUnitario) },
    { header: PRODUCTO_FORM.columns.stock, key: "stockActual" },
    {
      header: PRODUCTO_FORM.columns.features,
      render: (p) => (
        <div className="text-xs">
          <div>{TAMANOS[p.tamano] || p.tamano}</div>
          <div>{FORMATOS[p.formato] || p.formato}</div>
          <div>{MATERIALES_CHASIS[p.materialChasis] || p.materialChasis}</div>
          <div>{PANELES[p.panel] || p.panel}</div>
        </div>
      ),
    },
    {
      header: PRODUCTO_FORM.columns.actions,
      render: (producto) => (
        <div className="flex gap-4">
          <Button variant="linkEdit" onClick={() => crud.startEdit(producto)}>
            {MESSAGES.actions.edit}
          </Button>
          <Button
            variant="linkDelete"
            onClick={() => {
              if (window.confirm(MESSAGES.confirmDelete(M.item))) {
                crud.remove(producto.id);
              }
            }}
          >
            {MESSAGES.actions.delete}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainContainer title={M.title} subtitle={M.subtitle} width="xl">
      {crud.error && <Feedback type="error">{crud.error}</Feedback>}
      {crud.message && <Feedback type="success">{crud.message}</Feedback>}

      <EntityForm
        title={
          crud.editingId ? PRODUCTO_FORM.editTitle : PRODUCTO_FORM.createTitle
        }
        fields={fields}
        values={crud.values}
        onChange={crud.onChange}
        onSubmit={crud.onSubmit}
        onCancel={crud.cancelEdit}
        editing={Boolean(crud.editingId)}
        submitLabel={PRODUCTO_FORM.createLabel}
        editLabel={MESSAGES.actions.saveChanges}
      />

      <h2 className="text-lg font-semibold text-neutral-900">{M.registered}</h2>
      {crud.loading ? (
        <StateMessage>{M.loading}</StateMessage>
      ) : (
        <DataTable columns={columns} rows={crud.items} empty={M.empty} />
      )}
    </MainContainer>
  );
};

export default AdminProductos;
