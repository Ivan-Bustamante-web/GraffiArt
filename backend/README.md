# GraffiArt - Backend

API REST con Express 5, Prisma (MySQL), Zod para validaciones, JWT para la sesión y bcrypt para las contraseñas.

## Puesta en marcha

```bash
npm install
cp .env.example .env        # completar DATABASE_URL, JWT_SECRET y el admin
npx prisma migrate dev      # crea las tablas en tu base de datos
npm run seed                # categorías, gabinetes y administrador
npm run dev
```

Cada persona trabaja con su propia base de datos (vacía) y su propio `.env`.

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor con recarga automática |
| `npm start` | Servidor |
| `npm run prisma:migrate` | Crea y aplica migraciones en desarrollo |
| `npm run prisma:deploy` | Aplica migraciones existentes (producción) |
| `npm run seed` | Carga datos iniciales |
| `npm run crear-admin` | Crea o actualiza el administrador con `ADMIN_EMAIL` y `ADMIN_PASSWORD` |

## Estructura

```
prisma/
  schema/        schema dividido por tema (usuario, catalogo, inventario, carrito, diseno)
  migrations/    historial de la base de datos
  seed-data/     datos del seed
  seed.js
scripts/         scripts de línea de comandos
src/
  config/        variables de entorno validadas con Zod
  lib/           cliente de Prisma
  routes/        define las URLs y qué middlewares usa cada una
  controllers/   reciben la petición y devuelven la respuesta
  services/      lógica de negocio
  repositories/  consultas a la base de datos (único lugar donde se usa Prisma)
  schemas/       validaciones de entrada con Zod
  middlewares/   autenticación, validación y manejo de errores
  utils/         errores y serializadores
  app.js         configura Express
  server.js      conecta la base y levanta el servidor
```

El flujo de una petición es `routes → middlewares (auth, validación) → controller → service → repository → Prisma`.
Todos los errores salen como `{ "error": "mensaje" }` desde un único manejador.

## Qué hace cada tipo de archivo

Cada archivo empieza con un comentario que explica su rol. En resumen:

| Tipo | Para qué sirve | Debe tener | No debe tener |
|---|---|---|---|
| **routes** | Es el mapa de la API: qué URL y método lleva a qué acción. | URL, método, filtros previos (login, admin, validación) y el controller. | Lógica ni consultas a la base. |
| **controllers** | Recibe el pedido, llama al service y devuelve la respuesta. | Funciones cortas que leen `body`/`params`/usuario y responden con su código. | Reglas del negocio ni consultas a la base. |
| **services** | Tiene las reglas del negocio (lo que la app decide). | Validaciones del negocio, cálculos y errores propios. Usa los repositories para los datos. | `req`/`res` ni consultas directas a la base. |
| **repositories** | Es el único que habla con la base de datos. | Consultas simples de Prisma (buscar, listar, crear, actualizar, borrar). | Reglas del negocio ni mensajes para el usuario. |
| **schemas** | Define cómo tienen que venir los datos que envía el usuario. | Campos obligatorios, tipos y largos (Zod). Si no cumplen, responde 400. | Consultas ni lógica del negocio. |
| **middlewares** | Filtros que corren antes o después del controller. | Una función con `req`, `res` y `next` que deja pasar o corta con error. | Reglas de un recurso en particular. |
| **utils** | Funciones de ayuda chicas y reutilizables. | Código genérico (errores propios, conversión de datos). | Reglas del negocio ni acceso a la base. |
| **constants** | Valores fijos del proyecto en un solo lugar. | Textos, números y listas. | Lógica. |
| **config** | Lee y valida el `.env` al arrancar. | Las variables de entorno validadas. | Reglas del negocio. |
| **lib** | Conexiones a herramientas externas, creadas una sola vez. | El cliente de la base de datos. | Reglas del negocio. |
| **prisma/schema** | Describe las tablas de la base de datos. | Modelos, campos, tipos y relaciones, divididos por tema. | Lógica. |

## Endpoints (`/api`)

| Recurso | Rutas | Acceso |
|---|---|---|
| `/auth` | `POST /login`, `POST /register` | Público |
| `/usuarios` | `GET` y `PUT /perfil` | Sesión iniciada |
| `/gabinetes` | `GET /`, `GET /:id` (solo activos) | Público |
| `/materiales` | `GET /`, `GET /:id` público; `POST`, `PUT /:id`, `DELETE /:id` | Escritura: admin |
| `/categorias` | CRUD | Admin |
| `/productos` | CRUD | Admin |
| `/disenos` | CRUD de los diseños del usuario | Sesión iniciada |
| `/carrito` | `GET /`, `POST /items`, `PUT /items/:id`, `DELETE /items/:id` | Sesión iniciada |
