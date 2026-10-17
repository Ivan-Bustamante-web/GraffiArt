import Button from "../../components/Button/Button";
import DataTable from "../../components/DataTable/DataTable";
import EntityForm from "../../components/EntityForm/EntityForm";
import Feedback from "../../components/Feedback/Feedback";
import MainContainer from "../../components/MainContainer/MainContainer";
import { CATEGORIA_FORM } from "../../constants/FORMS";
import { MESSAGES } from "../../constants/MESSAGES";
import useCrudResource from "../../hooks/useCrudResource";
import { categoriaSchema } from "../../schemas/entities";
import categoriaService from "../../services/categoriaService";

const M = MESSAGES.admin.categorias;

// Página de administración de categorías: crear, editar y eliminar.
const AdminCategorias = () => {
  const crud = useCrudResource({
    key: "categorias",
    service: categoriaService,
    schema: categoriaSchema,
    initialValues: CATEGORIA_FORM.initialValues,
    toFormValues: (categoria) => ({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || "",
    }),
    messages: M,
  });

  const columns = [
    { header: CATEGORIA_FORM.columns.name, key: "nombre" },
    { header: CATEGORIA_FORM.columns.description, render: (c) => c.descripcion || "-" },
    { header: CATEGORIA_FORM.columns.products, render: (c) => c._count?.productos || 0 },
    {
      header: CATEGORIA_FORM.columns.actions,
      render: (categoria) => (
        <div className="flex gap-4">
          <Button variant="linkEdit" onClick={() => crud.startEdit(categoria)}>
            {MESSAGES.actions.edit}
          </Button>
          <Button
            variant="linkDelete"
            onClick={() => {
              if (window.confirm(MESSAGES.confirmDelete(M.item))) {
                crud.remove(categoria.id);
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
    <MainContainer title={M.title} subtitle={M.subtitle}>
      {crud.error && <Feedback type="error">{crud.error}</Feedback>}
      {crud.message && <Feedback type="success">{crud.message}</Feedback>}

      <EntityForm
        title={
          crud.editingId ? CATEGORIA_FORM.editTitle : CATEGORIA_FORM.createTitle
        }
        fields={CATEGORIA_FORM.fields}
        values={crud.values}
        onChange={crud.onChange}
        onSubmit={crud.onSubmit}
        onCancel={crud.cancelEdit}
        editing={Boolean(crud.editingId)}
        submitLabel={CATEGORIA_FORM.createLabel}
        editLabel={MESSAGES.actions.saveChanges}
        columns={1}
      />

      <DataTable columns={columns} rows={crud.items} />
    </MainContainer>
  );
};

export default AdminCategorias;
