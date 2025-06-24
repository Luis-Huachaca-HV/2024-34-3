# Backend - Kafka Dashboard

Este backend es parte del proyecto **Kafka Dashboard** y proporciona servicios para la gestión, monitoreo y análisis de datos provenientes de Kafka. Está desarrollado en Node.js y utiliza diversas librerías para la conexión y procesamiento de datos en tiempo real.

## Características principales

- Conexión y consumo de mensajes desde topics de Kafka.
- Procesamiento y almacenamiento de datos recibidos.
- Exposición de endpoints REST para consulta y análisis.
- Integración con el frontend para visualización en tiempo real.
- Soporte para análisis por lotes y resultados históricos.

## Estructura de carpetas

```
backend/
├── ande.js
├── batch_results.json
├── index.js
├── node_modules/
├── package.json
├── package-lock.json
```

## Instalación

1. **Instala las dependencias:**
   ```sh
   npm install
   ```

2. **Configura las variables de entorno** (si es necesario, crea un archivo `.env`).

3. **Inicia el servidor:**
   ```sh
   node index.js
   ```

## Endpoints principales

- `GET /api/data` - Obtiene los datos procesados.
- `POST /api/batch` - Inicia un análisis por lotes.
- Otros endpoints pueden estar definidos según la lógica de negocio.

## Requisitos

- Node.js >= 14.x
- Acceso a un clúster de Kafka (configurable en el código o variables de entorno)

## Notas

- Los resultados de análisis por lotes se almacenan en `batch_results.json`.
- No subas la carpeta `node_modules` al repositorio (usa `.gitignore`).

## Licencia

MIT

---

**Autor:** Luis Huachaca HV  
**Repositorio