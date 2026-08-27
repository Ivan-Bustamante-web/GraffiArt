# GraffiArt - Sitio de venta para gabinetes custom

Graffiart busca ser un espacio de venta para gabinetes personalizados por sus usuarios, ofreciendo servicios postventa y un espacio de diseño para crear tu gabinete perfecto.

---

# Tecnologías Incluidas

# Frontend
* **React** + **Vite** (Framework y empaquetador)
* **React Router Dom** (Enrutamiento)
* **Tailwind CSS** (Estilos)
* **Zustand** (Gestion de estado global)
* **Axios** (Peticiones HTTP)
* **Yup** (Validación de formularios)

# Backend
* **Prisma ORM** (Modelado y base de datos)
* **Zod** (Validación de datos y esquemas)
* **Jsonwebtoken** (Autenticacion)
* **Bcrypt** (Encriptacion de contraseñas)
* **Cors** & **Dotenv** (Configuración del servidor y variables de entorno)

---

# Instrucciones de Instalacion

### 1. Clonar el repositorio
Abre tu terminal y ejecuta el siguiente comando:

```bash:

git clone [https://github.com/Ivan-Bustamante-web/GraffiArt.git](https://github.com/Ivan-Bustamante-web/GraffiArt.git)
cd GraffiArt

## Instalar dependencias

Desde la raíz del proyecto, instalá todo con un solo comando (gracias a los workspaces de npm):

```bash
npm install
```

Esto instala automáticamente las dependencias de `backend` y `frontend`.

## Configurar la base de datos

1. Iniciá tu servidor MySQL (por ejemplo con XAMPP, iniciando el módulo MySQL).
2. Entrá a `http://localhost/phpmyadmin` y creá una base de datos llamada exactamente: graffiart_db


### Configurar las variables de entorno

Dentro de `backend`, copiá el archivo de ejemplo y renombralo a `.env`:

```bash
cd backend
cp .env.example .env
```

Completá `backend/.env` con tus datos (por defecto con XAMPP, usuario `root` sin contraseña):
DATABASE_URL="mysql://root:@localhost:3306/graffiart_db"
JWT_SECRET="graffiart_practica_profesionalizante_3ro_2026"


El `.env` no se sube a Git. Cada integrante debe crear el suyo propio.

### Aplicar las migraciones

Con el `.env` configurado:

```bash
npx prisma migrate dev
```

Esto crea todas las tablas (Usuario, Material, InventarioMovimiento, Gabinete, etc.) en tu base local.

---

## Cómo correr el proyecto

Necesitás **dos terminales abiertas al mismo tiempo**.

**Terminal 1 — Backend**
```bash
cd backend
npm run dev
```
Levanta en `http://localhost:3000`

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```
Levanta en `http://localhost:5173`

Abrí esa URL en el navegador para ver la aplicación.


LINK DOCUMENTACION: https://docs.google.com/document/d/1dXhFm-yipDWLSxfGWzNn0fUnUhUZOD0m/edit?usp=sharing&ouid=114669798753844354963&rtpof=true&sd=true