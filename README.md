# CoSpace

Plataforma web para consultar espacios disponibles y gestionar reservas por horas. CoSpace permite a los usuarios explorar los espacios publicados, consultar sus características, autenticarse y realizar reservas. También cuenta con funcionalidades de administración para gestionar los espacios de la plataforma.

## Tabla de contenido

- [Características](#características)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Requisitos previos](#requisitos-previos)
- [Configuración de variables de entorno](#configuración-de-variables-de-entorno)
- [Instalación y ejecución en desarrollo](#instalación-y-ejecución-en-desarrollo)
- [Credenciales del administrador](#credenciales-del-administrador)
- [Ejecución con Docker](#ejecución-con-docker)
- [Scripts disponibles](#scripts-disponibles)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Funcionalidades principales](#funcionalidades-principales)
- [Base de datos y seed](#base-de-datos-y-seed)
- [Solución de problemas](#solución-de-problemas)
- [Aplicación desplegada](#aplicación-desplegada)

## Características

- Consulta de espacios disponibles.
- Visualización de información detallada de cada espacio.
- Registro e inicio de sesión de usuarios.
- Autenticación mediante sesiones y tokens.
- Creación de reservas por horas.
- Consulta de las reservas del usuario.
- Cancelación de reservas según las reglas del sistema.
- Panel de administración para gestionar espacios.
- Persistencia de datos en PostgreSQL.
- Validación de datos y control de acceso según el rol del usuario.
- Interfaz adaptable a diferentes tamaños de pantalla.

> Las funcionalidades disponibles pueden variar según los módulos implementados en la versión final del proyecto.

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| Next.js | Framework de React para construir la aplicación web. |
| React | Construcción de la interfaz de usuario. |
| TypeScript | Tipado estático del código. |
| Tailwind CSS | Estilos y diseño de la interfaz. |
| Prisma ORM | Acceso y consultas a la base de datos. |
| PostgreSQL | Base de datos relacional. |
| Supabase | Servicio utilizado para alojar PostgreSQL. |
| Node.js | Entorno de ejecución de JavaScript. |
| npm | Instalación y administración de dependencias. |
| Docker | Construcción y ejecución del contenedor de la aplicación. |
| Zod | Validación de datos, si está incluido en la versión final. |
| jose / bcryptjs | Herramientas relacionadas con tokens y contraseñas, según su uso en el código. |

## Requisitos previos

Antes de instalar el proyecto, asegúrate de tener lo siguiente:

### 1. Git

Permite clonar el repositorio.

Descarga: https://git-scm.com/downloads

Comprueba la instalación:

```bash
git --version
```

### 2. Node.js

Instala una versión de Node.js compatible con la versión de Next.js y las dependencias del proyecto.

Para este proyecto se ha trabajado con Node.js `24.18.1`. Se recomienda utilizar esa misma versión para reproducir el entorno de desarrollo.

Descarga: https://nodejs.org/

Comprueba la instalación:

```bash
node --version
npm --version
```

### 3. Cuenta de Supabase

El proyecto utiliza una base de datos PostgreSQL alojada en Supabase.

1. Ingresa a https://supabase.com/.
2. Inicia sesión o crea una cuenta.
3. Crea un proyecto de Supabase.
4. Espera a que termine de aprovisionarse la base de datos.
5. Abre el proyecto y entra en **Connect** o en la sección de configuración de conexión de la base de datos.
6. Copia la cadena de conexión de PostgreSQL adecuada para la aplicación.

La cadena de conexión contiene información sensible. No la publiques ni la incluyas directamente en el repositorio.

### 4. Docker

Docker es necesario para ejecutar la aplicación mediante contenedores.

Descarga: https://www.docker.com/get-started/

Comprueba la instalación:

```bash
docker --version
docker compose version
```

Para ejecutar el proyecto localmente en modo desarrollo no es obligatorio utilizar Docker si la base de datos de Supabase ya está configurada y accesible.

### 5. Acceso a la base de datos

Necesitas una base de datos PostgreSQL accesible y permisos para crear las tablas definidas por las migraciones.

En este proyecto se utiliza Supabase, por lo que no es necesario instalar PostgreSQL localmente si utilizas la base de datos remota.

## Configuración de variables de entorno

Las variables de entorno permiten configurar las conexiones, los secretos de autenticación y otros parámetros sin escribir valores sensibles directamente en el código.

El proyecto debe incluir un archivo `.env.example` con las variables necesarias. Para comenzar, crea una copia:

```bash
cp .env.example .env
```

Después, completa las variables de acuerdo con las instrucciones siguientes.

### `DATABASE_URL`

**Propósito:** establece la conexión de Prisma con la base de datos PostgreSQL.

**Cómo obtenerla:**

1. Abre tu proyecto en Supabase.
2. Ve a la sección **Connect** o a los ajustes de conexión de la base de datos.
3. Selecciona PostgreSQL y copia la cadena de conexión.
4. Si utilizas el pooler de Supabase, selecciona el modo de conexión apropiado para la aplicación y para las migraciones.
5. Sustituye los marcadores de posición por los datos reales de tu proyecto.

Ejemplo ilustrativo:

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:TU_PASSWORD@HOST_DEL_POOLER:PUERTO/postgres"
```

No copies este ejemplo literalmente. Debes utilizar el host, puerto, usuario y contraseña proporcionados por Supabase.

Si la contraseña contiene caracteres especiales, asegúrate de codificarlos correctamente para una URL.

**Importante:** las migraciones pueden requerir una conexión directa o una conexión de sesión, dependiendo de la configuración de Supabase. Utiliza el método compatible con tu configuración de Prisma. Si el proyecto define una variable separada para migraciones, configúrala también.

### `JWT_SECRET`

**Propósito:** secreto utilizado para firmar o verificar tokens de autenticación, si así está implementado en la aplicación.

Genera un secreto aleatorio desde una terminal con Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado en el archivo `.env`:

```env
JWT_SECRET="PEGA_AQUI_EL_SECRETO_GENERADO"
```

Utiliza un secreto diferente para cada entorno. No compartas este valor ni lo subas al repositorio.

### `AUTH_SECRET` u otras variables de autenticación

Si el archivo `.env.example` incluye una variable adicional, como `AUTH_SECRET`, debes generar un secreto independiente con el mismo comando de Node.js y colocarlo en la variable correspondiente.

No es necesario crear variables que el proyecto no utilice. Debes configurar exactamente las que aparecen en el `.env.example` y las que requiere el código.

### Ejemplo de `.env`

El siguiente ejemplo es ilustrativo. Conserva únicamente las variables que realmente estén definidas en el proyecto:

```env
DATABASE_URL="postgresql://USUARIO:CONTRASENA@HOST:PUERTO/postgres"
JWT_SECRET="SECRETO_GENERADO"
```

Si tu `.env.example` contiene más variables, completa cada una antes de ejecutar la aplicación.

### Seguridad de las variables

- No subas el archivo `.env` a Git.
- No compartas contraseñas de Supabase ni secretos de autenticación.
- Mantén `.env.example` sin credenciales reales.
- Para producción, configura las variables desde el proveedor de despliegue.
- Si una credencial se publica accidentalmente, cámbiala inmediatamente.

## Instalación y ejecución en desarrollo

Sigue los pasos en el orden indicado para ejecutar el proyecto desde cero.

### Paso 1. Clonar el repositorio

Reemplaza la URL de ejemplo por la URL real del repositorio:

```bash
git clone REEMPLAZAR_CON_URL_DEL_REPOSITORIO
```

Entra en el directorio del proyecto:

```bash
cd cospace
```

Si el repositorio tiene otro nombre, utiliza el directorio creado por `git clone`.

### Paso 2. Instalar las dependencias

Ejecuta:

```bash
npm install
```

Este comando instala las dependencias definidas en `package.json`.

### Paso 3. Configurar las variables de entorno

Crea el archivo `.env`:

```bash
cp .env.example .env
```

Edita el archivo:

```bash
nano .env
```

Completa `DATABASE_URL` y las demás variables definidas en `.env.example`.

Guarda los cambios y cierra el editor.

Antes de continuar, comprueba que las variables sean correctas y que la base de datos de Supabase esté disponible.

### Paso 4. Ejecutar las migraciones

El proyecto utiliza Prisma para gestionar el esquema de la base de datos.

Ejecuta:

```bash
npx prisma migrate deploy
```

Este comando aplica las migraciones existentes que todavía no se hayan ejecutado en la base de datos configurada.

Comprueba el estado de las migraciones:

```bash
npx prisma migrate status
```

Si el proyecto necesita generar el cliente de Prisma antes de ejecutar la aplicación, ejecuta también:

```bash
npx prisma generate
```

Si ocurre un error de conexión, revisa `DATABASE_URL`, la contraseña, el host, el puerto y los permisos de la base de datos.

### Paso 5. Ejecutar el seed

El seed introduce los datos iniciales necesarios para utilizar la aplicación, como las categorías o el usuario administrador configurado en el proyecto.

Ejecuta:

```bash
npx prisma db seed
```

Espera a que el proceso termine correctamente.

El seed debe ejecutarse después de que las tablas hayan sido creadas mediante las migraciones.

Si se vuelve a ejecutar, su comportamiento depende de cómo esté implementado. Comprueba que las operaciones de inserción sean idempotentes antes de ejecutarlo repetidamente en una base de datos con información existente.

### Paso 6. Iniciar la aplicación

Ejecuta:

```bash
npm run dev
```

Por defecto, Next.js inicia el servidor de desarrollo en:

http://localhost:3000

Abre esa dirección en el navegador.

Si el puerto `3000` está ocupado, Next.js puede utilizar otro puerto y mostrarlo en la terminal.

### Paso 7. Probar la aplicación

Después de iniciar el servidor:

1. Abre la página principal.
2. Accede al listado de espacios.
3. Abre el detalle de un espacio disponible.
4. Inicia sesión con las credenciales del administrador o registra un usuario, según el flujo habilitado.
5. Comprueba las funcionalidades correspondientes al rol de usuario.
6. Si hay espacios disponibles y el usuario tiene los permisos necesarios, prueba el flujo de reserva.
7. Accede al panel de administración para verificar las funciones administrativas.

Para probar las reservas, debe existir al menos un espacio válido en la base de datos. Si el seed no crea espacios, utiliza el panel de administración para crear uno.

## Credenciales del administrador

El seed configura un usuario administrador inicial para facilitar las pruebas.

Completa esta sección con los valores reales definidos por `prisma/seed.ts`:

| Campo | Valor |
|---|---|
| URL de inicio de sesión | `http://localhost:3000/login` |
| Correo del administrador | `REEMPLAZAR_CON_EMAIL_REAL_DEL_SEED` |
| Contraseña del administrador | `REEMPLAZAR_CON_CONTRASEÑA_REAL_DEL_SEED` |
| Panel de administración | `http://localhost:3000/admin/spaces` |

**Importante:** los valores de correo y contraseña deben coincidir con los configurados en el seed real. No inventes credenciales para esta sección.

Si el seed genera una contraseña mediante variables de entorno o no crea una contraseña predeterminada, documenta ese procedimiento aquí.

Las credenciales de prueba no deben reutilizarse en producción. Cambia o deshabilita la cuenta inicial antes de exponer la aplicación a usuarios reales.

## Ejecución con Docker

Esta sección describe cómo construir una imagen y ejecutar el contenedor de la aplicación.

Antes de comenzar, comprueba que existan el `Dockerfile` y la configuración de producción necesaria. Los comandos siguientes asumen que el `Dockerfile` está en la raíz del repositorio.

### Paso 1. Configurar las variables de entorno

Asegúrate de que el archivo `.env` contenga las variables requeridas por la aplicación.

No incluyas el archivo `.env` dentro de la imagen ni copies secretos al repositorio. El archivo `.dockerignore` debe excluirlo del contexto de construcción.

### Paso 2. Construir la imagen

Desde la raíz del proyecto, ejecuta:

```bash
docker build -t cospace:latest .
```

### Paso 3. Ejecutar el contenedor

Pasa las variables necesarias al contenedor mediante `--env-file`:

```bash
docker run --name cospace-app -p 3000:3000 --env-file .env cospace:latest
```

Abre la aplicación en:

http://localhost:3000

El comando presupone que la imagen arranca Next.js en el puerto `3000` y que las variables de entorno se leen en tiempo de ejecución.

Si el `Dockerfile` no existe, o si la imagen no cuenta con un comando de inicio de producción, esta sección no podrá ejecutarse hasta implementar y probar esa configuración.

### Comandos útiles de Docker

Ver los contenedores activos:

```bash
docker ps
```

Ver los registros del contenedor:

```bash
docker logs -f cospace-app
```

Detener el contenedor:

```bash
docker stop cospace-app
```

Eliminar el contenedor detenido:

```bash
docker rm cospace-app
```

Eliminar la imagen:

```bash
docker rmi cospace:latest
```

### Consideraciones para producción

- Utiliza una imagen optimizada para producción.
- Configura las variables de entorno de forma segura.
- No introduzcas secretos dentro de la imagen.
- Ejecuta las migraciones como parte del proceso de despliegue, con las credenciales apropiadas.
- Comprueba que la imagen final incluya todos los recursos necesarios para iniciar Next.js.
- Verifica que las variables que necesita Prisma estén disponibles en el contenedor.

## Scripts disponibles

Los scripts se definen en `package.json`. Los siguientes son los comandos habituales de Next.js y Prisma; verifica cuáles están presentes en la versión final del repositorio.

| Comando | Propósito |
|---|---|
| `npm run dev` | Inicia Next.js en modo desarrollo. |
| `npm run build` | Compila la aplicación para producción. |
| `npm run start` | Inicia el servidor de producción después de construir la aplicación. |
| `npm run lint` | Ejecuta el análisis estático configurado, si existe este script. |
| `npx tsc --noEmit` | Comprueba los tipos de TypeScript sin generar archivos de salida. |
| `npx prisma generate` | Genera el cliente de Prisma. |
| `npx prisma migrate deploy` | Aplica las migraciones pendientes existentes. |
| `npx prisma migrate status` | Muestra el estado de las migraciones. |
| `npx prisma db seed` | Ejecuta el seed configurado. |

Para consultar los scripts exactos disponibles, ejecuta:

```bash
npm run
```

También puedes revisar la sección `scripts` del archivo `package.json`.

No ejecutes comandos que no estén definidos en el proyecto sin verificar antes su configuración.

## Estructura del proyecto

La estructura general de CoSpace se organiza por responsabilidades. La siguiente descripción corresponde a las rutas y módulos identificados en el proyecto; ajusta los nombres si la estructura final difiere.

```text
cospace/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   └── spaces/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (private)/
│   │   └── dashboard/
│   ├── admin/
│   │   └── spaces/
│   └── api/
│       └── reservations/
├── components/
│   └── reservations/
│       └── reservation-form.tsx
├── lib/
│   ├── auth/
│   │   └── session.ts
│   ├── services/
│   │   ├── spaces.service.ts
│   │   └── reservations.service.ts
│   └── prisma.ts
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── .env.example
├── .gitignore
├── Dockerfile
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

### Descripción de las carpetas

- **`app/`**: contiene las páginas, layouts y rutas de la aplicación Next.js.
- **`app/(public)/`**: contiene las páginas públicas, como la página principal y el catálogo de espacios.
- **`app/(auth)/`**: agrupa las páginas relacionadas con el registro y el inicio de sesión, si están organizadas de esta manera.
- **`app/(private)/`**: contiene páginas destinadas a usuarios autenticados, como el dashboard.
- **`app/admin/`**: contiene las páginas del panel administrativo, según la estructura de rutas utilizada.
- **`app/api/`**: contiene los Route Handlers que exponen operaciones HTTP para el frontend.
- **`components/`**: contiene componentes reutilizables de interfaz, como el formulario de reservas.
- **`lib/auth/`**: centraliza la lógica de autenticación y consulta de la sesión.
- **`lib/services/`**: contiene las funciones de negocio y acceso a datos, separadas de los componentes visuales.
- **`lib/prisma.ts`**: configura el cliente de Prisma utilizado por la aplicación.
- **`prisma/migrations/`**: contiene las migraciones versionadas de la base de datos.
- **`prisma/schema.prisma`**: define el modelo de datos de Prisma.
- **`prisma/seed.ts`**: contiene los datos iniciales de la aplicación.
- **`public/`**: almacena archivos estáticos públicos.
- **`.env.example`**: documenta las variables de entorno requeridas sin incluir secretos.
- **`prisma.config.ts`**: contiene la configuración de Prisma utilizada por la versión del proyecto.
- **`Dockerfile`**: define la imagen de Docker, si está implementado.
- **`package.json`**: define las dependencias y los scripts disponibles.

Los directorios entre paréntesis, como `(public)` o `(private)`, son grupos de rutas de Next.js y no forman parte de la URL pública.

## Funcionalidades principales

### Consulta de espacios

El usuario puede consultar el listado de espacios publicados, su descripción, imagen, capacidad y precio por hora.

Al seleccionar un espacio, puede abrir la página de detalle correspondiente.

### Autenticación

La aplicación ofrece un flujo de registro e inicio de sesión. Las operaciones que requieren autenticación deben validar la sesión del usuario antes de permitir el acceso.

### Reservas

Los usuarios autenticados pueden acceder al formulario de reserva de un espacio.

Las reglas de validación del sistema deben aplicarse tanto en la interfaz como en el servidor. El backend es la fuente de verdad para autorizar y registrar las operaciones.

### Administración

El usuario con rol de administrador puede acceder a las funcionalidades administrativas disponibles, como la gestión de espacios.

Las rutas y operaciones administrativas deben restringirse a usuarios autorizados.

## Base de datos y seed

La aplicación utiliza PostgreSQL y Prisma para definir y mantener el esquema de datos.

El flujo inicial recomendado es:

1. Configurar la conexión mediante las variables de entorno.
2. Aplicar las migraciones versionadas.
3. Generar el cliente de Prisma si es necesario.
4. Ejecutar el seed.
5. Iniciar la aplicación.

Comandos:

```bash
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```

El seed debe configurar los datos iniciales que el proyecto necesita para funcionar, incluido el administrador si está definido en `prisma/seed.ts`.

No ejecutes `prisma migrate reset` en una base de datos con información que quieras conservar, ya que puede eliminar datos.

## Solución de problemas

### Error de conexión con Supabase

Comprueba lo siguiente:

- Que `DATABASE_URL` sea correcta.
- Que la contraseña no tenga caracteres especiales sin codificar.
- Que el host y el puerto correspondan al método de conexión seleccionado.
- Que la base de datos esté disponible.
- Que las migraciones utilicen una conexión compatible con tu configuración de Supabase.

### Error al ejecutar las migraciones

Ejecuta:

```bash
npx prisma migrate status
```

Revisa el estado de la base de datos y los mensajes de error antes de volver a ejecutar el proceso.

No elimines migraciones ni restablezcas la base de datos como primera medida.

### El administrador no puede iniciar sesión

Comprueba que:

1. El seed terminó correctamente.
2. El correo y la contraseña coinciden con los valores documentados.
3. El usuario fue creado en la base de datos.
4. La aplicación está conectada al mismo proyecto de Supabase donde se ejecutó el seed.
5. Las variables de autenticación están correctamente configuradas.

### No aparecen espacios

Comprueba que existan registros de espacios en la base de datos. Si el seed no crea espacios, agrega uno mediante la funcionalidad administrativa disponible.

### Error de tipos o compilación

Ejecuta:

```bash
npx tsc --noEmit
npm run build
```

Lee el mensaje de error y corrige el problema antes de desplegar la aplicación.

### El contenedor de Docker no inicia

Consulta los registros:

```bash
docker logs -f cospace-app
```

Comprueba que las variables de entorno estén disponibles, que el puerto sea correcto y que el comando de inicio esté configurado para producción.

## Aplicación desplegada

**URL pública:** `REEMPLAZAR_CON_URL_REAL_DEL_DESPLIEGUE`

Cuando el despliegue esté disponible, sustituye el marcador por la URL pública real de la aplicación.

Antes de entregar el proyecto, verifica que la URL funcione desde una sesión de navegador independiente y que las variables de entorno de producción estén configuradas.

## Autoría

Proyecto desarrollado como parte de una prueba técnica.

- **Proyecto:** CoSpace
- **Repositorio:** `REEMPLAZAR_CON_URL_REAL_DEL_REPOSITORIO`
- **Aplicación desplegada:** `REEMPLAZAR_CON_URL_REAL_DEL_DESPLIEGUE`


