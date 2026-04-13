# Desplegar el frontend en Google Cloud Run (Docker + Nginx)

Este repo genera una SPA con **Vite** en `dist/` y la sirve con **Nginx** en el puerto que define Cloud Run mediante la variable de entorno **`PORT`** (por defecto **8080**). El script `docker-entrypoint.sh` ajusta la directiva `listen` de Nginx a ese valor.

La URL del API se fija en **tiempo de build** con **`VITE_API_URL`** (no en runtime). Para producción:

`VITE_API_URL=https://form-backend-818499958988.us-central1.run.app/api`

## Requisitos

- Cuenta y proyecto en Google Cloud.
- [Google Cloud SDK](https://cloud.google.com/sdk) (`gcloud`) instalado y autenticado.
- APIs habilitadas (según tu flujo): **Cloud Build**, **Artifact Registry** (o Container Registry), **Cloud Run**.

Sustituye en los comandos:

- `PROJECT_ID`: ID del proyecto GCP.
- `REGION`: región (p. ej. `us-central1`).
- `REPO`: nombre del repositorio de Artifact Registry (p. ej. `docker`).
- `SERVICE`: nombre del servicio en Cloud Run (p. ej. `forms-frontend`).
- `IMAGE_NAME`: nombre de la imagen (p. ej. `forms-frontend`).

## 1. Instalar dependencias (local, opcional)

Solo necesario para probar el build fuera de Docker:

```bash
npm ci
```

## 2. Build local del frontend (opcional)

```bash
export VITE_API_URL="https://form-backend-818499958988.us-central1.run.app/api"
npm run build
```

Salida: carpeta **`dist/`**.

Comando exacto del script: **`tsc -b && vite build`**.

## 3. Crear repositorio de Artifact Registry (una vez por proyecto/región)

```bash
gcloud config set project PROJECT_ID

gcloud artifacts repositories create REPO \
  --repository-format=docker \
  --location=REGION \
  --description="Imágenes Docker"
```

Configura Docker para autenticarse contra Artifact Registry:

```bash
gcloud auth configure-docker REGION-docker.pkg.dev
```

## 4. Construir la imagen con Cloud Build

Desde la raíz del repo (donde está el `Dockerfile`):

```bash
gcloud builds submit \
  --project=PROJECT_ID \
  --tag REGION-docker.pkg.dev/PROJECT_ID/REPO/IMAGE_NAME:latest
```

`gcloud builds submit --tag ...` ejecuta `docker build` sobre el `Dockerfile`; el **`ARG VITE_API_URL`** del Dockerfile ya trae por defecto la URL de producción. No hace falta pasar build-args salvo que quieras otro entorno.

Si necesitas **otra** `VITE_API_URL` en Cloud Build, usa un `cloudbuild.yaml` con el builder de Docker, por ejemplo:

```yaml
steps:
  - name: gcr.io/cloud-builders/docker
    args:
      - build
      - -t
      - REGION-docker.pkg.dev/PROJECT_ID/REPO/IMAGE_NAME:latest
      - --build-arg
      - VITE_API_URL=https://form-backend-818499958988.us-central1.run.app/api
      - .
images:
  - REGION-docker.pkg.dev/PROJECT_ID/REPO/IMAGE_NAME:latest
```

Y despliega con:

```bash
gcloud builds submit --project=PROJECT_ID --config=cloudbuild.yaml
```

## 5. Desplegar en Cloud Run

```bash
gcloud run deploy SERVICE \
  --project=PROJECT_ID \
  --image REGION-docker.pkg.dev/PROJECT_ID/REPO/IMAGE_NAME:latest \
  --region REGION \
  --platform managed \
  --port 8080 \
  --allow-unauthenticated
```

**Importante:** `--port 8080` debe coincidir con el puerto en el que escucha Nginx tras el `docker-entrypoint.sh`. Cloud Run inyectará **`PORT=8080`** en el contenedor; el entrypoint sustituye `listen 8080;` por `listen $PORT;` (equivalente si `PORT` es 8080).

## 6. Obtener la URL del servicio

Tras el despliegue, la consola muestra la URL. También puedes listar:

```bash
gcloud run services describe SERVICE \
  --project=PROJECT_ID \
  --region REGION \
  --format 'value(status.url)'
```

## 7. CORS en el backend

El navegador llamará al backend en  
`https://form-backend-818499958988.us-central1.run.app`  
desde el **origen** de tu frontend (la URL de Cloud Run).

Configura el backend (Nest u otro) para permitir en CORS ese origen, métodos necesarios y la cabecera **`Authorization`** si usas JWT.

## Checklist

1. Imagen construida con `VITE_API_URL` correcto (build-arg o default del Dockerfile).
2. Servicio Cloud Run con **`--port 8080`**.
3. SPA: recarga en rutas internas resuelta por `try_files` → `/index.html`.
4. Backend con CORS actualizado con la URL del frontend.
