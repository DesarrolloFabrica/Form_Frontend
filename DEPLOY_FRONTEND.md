# Despliegue del frontend (Forms CUN)

Stack: **React 19 + TypeScript + Vite 6**. La salida de producción es la carpeta **`dist/`** en la raíz del repo.

La URL base del API se configura con **`VITE_API_URL`** (sin barra final). Debe definirse **en el entorno en el momento del `vite build`**, porque Vite sustituye `import.meta.env.VITE_*` al compilar.

## Requisitos previos

- Node.js acorde al proyecto (recomendado: LTS actual).
- Backend en producción: `https://form-backend-818499958988.us-central1.run.app` (prefijo `/api` si tu Nest lo usa globalmente).

## 1. Instalar dependencias

```bash
npm ci
```

(Alternativa: `npm install` si no usas lockfile fijado en CI.)

## 2. Configurar la URL del API para el build

Copia el ejemplo y ajusta solo si hace falta en local:

```bash
cp .env.example .env
```

Para un **build de producción** que apunte al backend desplegado, el valor debe ser:

```bash
VITE_API_URL=https://form-backend-818499958988.us-central1.run.app/api
```

En Windows (PowerShell), antes del build:

```powershell
$env:VITE_API_URL="https://form-backend-818499958988.us-central1.run.app/api"
```

En Unix:

```bash
export VITE_API_URL="https://form-backend-818499958988.us-central1.run.app/api"
```

> Si tu backend **no** usa el prefijo global `/api`, quita ese segmento en `VITE_API_URL` para que coincida con las rutas reales.

## 3. Compilar

```bash
npm run build
```

Comando exacto definido en `package.json`: **`tsc -b && vite build`**.

## 4. Carpeta de salida

Tras un build correcto, sube al hosting estático el contenido de:

- **`dist/`** (HTML, `assets/`, favicon, `_redirects` si usas Netlify, etc.)

Validación rápida en local después del build:

```bash
npm run preview
```

Abre la URL que imprime Vite y comprueba login o una petición autenticada; en las herramientas de red del navegador, las llamadas deben ir al host configurado en `VITE_API_URL`.

## 5. SPA y recarga en rutas profundas

El proyecto usa **`BrowserRouter`** (`react-router-dom`). El servidor debe devolver **`index.html`** para rutas que no sean archivos estáticos (p. ej. `/login`, `/dashboard`).

Según dónde despliegues:

| Plataforma | Archivo en el repo |
|------------|-------------------|
| Netlify | `public/_redirects` (se copia a `dist/` al hacer build) |
| Vercel | `vercel.json` en la raíz |
| Nginx / Docker / VM | Ver `deploy/nginx-spa.conf.example` |
| Firebase Hosting | Configura `rewrites` a `index.html` en `firebase.json` (no incluido aquí) |
| Cloud Storage + balanceador | Configura la regla de error/rewrite equivalente en la consola de GCP |

Sin esa regla, al recargar en una ruta interna obtendrás **404** del servidor.

## 6. CORS y cookies

El frontend en producción será **otro origen** distinto del de Cloud Run del backend. El backend debe permitir en CORS el origen de tu sitio (métodos y cabeceras que uses, p. ej. `Authorization`). Si algo falla solo en producción, revisa primero la consola del navegador (CORS) y la pestaña Red.

## Checklist rápido

1. `VITE_API_URL` definida en el entorno del build de producción.
2. `npm run build` sin errores.
3. Subir **`dist/`** al hosting estático.
4. Reglas SPA (rewrite a `index.html`) activas en el servidor.
5. Probar recarga en una ruta interna (p. ej. `/login`).
