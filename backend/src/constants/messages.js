// CONSTANTES
// Aquí viven los valores fijos del proyecto (textos, números, listas) en un solo lugar, para no repetirlos ni escribirlos a mano en otros archivos.
// Debe tener: solo datos. Se importan donde hacen falta.
// No debe tener: lógica ni funciones complejas.
// Este archivo: guarda todos los textos de error y de éxito que devuelve la API.

export const MESSAGES = {
  http: {
    routeNotFound: 'Ruta no encontrada',
    invalidJson: 'El cuerpo de la petición no es un JSON válido',
    internal: 'Error interno del servidor',
    tokenRequired: 'Token requerido',
    tokenInvalid: 'Token inválido o expirado',
    adminOnly: 'Acceso denegado. Se requieren permisos de administrador.',
  },
  prisma: {
    duplicate: 'Ya existe un registro con ese valor',
    related: 'La operación no se puede completar porque hay datos relacionados',
    notFound: 'Registro no encontrado',
  },
  server: {
    health: 'API GraffiArt funcionando',
    dbError: 'No se pudo conectar a la base de datos:',
    running: (port) => `Servidor corriendo en http://localhost:${port}`,
  },
  env: {
    invalid: (problemas) => `Variables de entorno inválidas:\n${problemas}`,
    databaseUrl: 'DATABASE_URL es obligatoria',
    jwtSecret: 'JWT_SECRET debe tener al menos 16 caracteres',
  },
  auth: {
    emailTaken: 'Ya existe una cuenta con ese email',
    registered: 'Registro exitoso. Ya podés iniciar sesión.',
    invalidCredentials: 'Credenciales inválidas. Revisá tu email y contraseña.',
    loginRequired: 'Debés ingresar email y contraseña',
    emailRequired: 'El email es obligatorio',
    emailInvalid: 'El email no es válido',
    nameRequired: 'El nombre es obligatorio',
    surnameRequired: 'El apellido es obligatorio',
    passwordMin: (min) => `La contraseña debe tener al menos ${min} caracteres`,
  },
  usuario: {
    notFound: 'Usuario no encontrado',
    nameAndSurnameRequired: 'Nombre y apellido son obligatorios',
  },
  categoria: {
    nameRequired: 'El nombre de la categoría es obligatorio',
    duplicate: 'Ya existe una categoría con ese nombre',
    notFound: 'Categoría no encontrada',
  },
  producto: {
    nameBrandRequired: 'Nombre y marca son obligatorios',
    cost: 'El costo unitario debe ser un número mayor o igual a 0',
    currentStock: 'El stock actual debe ser un número entero mayor o igual a 0',
    minStock: 'El stock mínimo debe ser un número entero mayor o igual a 0',
    characteristics: 'Las características del gabinete son obligatorias',
    categoryMissing: 'La categoría seleccionada no existe',
    notFound: 'Producto no encontrado',
  },
  gabinete: {
    notFound: 'Gabinete no encontrado',
  },
  material: {
    nameRequired: 'El nombre es obligatorio',
    codeRequired: 'El código es obligatorio',
    invalidCategory: 'La categoría no es válida',
    invalidUnit: 'La unidad de medida no es válida',
    currentStock: 'El stock actual debe ser un número entero mayor o igual a 0',
    minStock: 'El stock mínimo debe ser un número entero mayor o igual a 0',
    cost: 'El costo unitario debe ser un número',
    costNegative: 'El costo unitario no puede ser negativo',
    duplicate: 'Ya existe un material con ese código',
    notFound: 'Material no encontrado',
  },
  diseno: {
    nameConfigRequired: 'Nombre y configuración son obligatorios',
    notFound: 'Diseño no encontrado',
  },
  carrito: {
    noProduct: 'No se especificó ningún producto o diseño para agregar al carrito.',
    quantity: 'La cantidad debe ser mayor a 0',
    itemNotFound: 'Item no encontrado en el carrito',
    cabinetUnavailable: 'El gabinete seleccionado no está disponible',
    designNotFound: 'El diseño guardado no fue encontrado',
  },
};
