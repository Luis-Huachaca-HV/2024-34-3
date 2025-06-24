# Proyecto 2024-34-3: Plataforma de Análisis y Visualización con Kafka

Este proyecto integra un backend, un frontend y scripts de procesamiento para el análisis y visualización de datos en tiempo real y por lotes usando Kafka.

## Flujo de trabajo

1. **Levanta el backend y el frontend:**
   - Abre dos terminales:
     - En uno, inicia el backend:
       ```sh
       cd kafka-dashboard/backend
       npm install
       node index.js
       ```
     - En otro, inicia el frontend:
       ```sh
       cd kafka-dashboard/frontend
       npm install
       npm start
       ```

2. **Configura y ejecuta el envío de datos:**
   - Abre un tercer terminal.
   - Edita el archivo `envio.py` y cambia la URL según el destino:
     - Para pruebas locales, usa `localhost`.
     - Para producción o pruebas en clúster, usa la IP del clúster Kafka.
   - Ejecuta el script:
     ```sh
     python3 envio.py
     ```

3. **Análisis por lotes:**
   - Edita `batch_analysis2.py` para configurar el destino (`localhost` o IP del clúster).
   - Ejecuta el análisis por lotes:
     ```sh
     python3 batch_analysis2.py
     ```

## Dependencias

- **Backend:** Node.js, KafkaJS, Express, etc.
- **Frontend:** React, dependencias de npm.
- **Python:** 
  - `pyspark`
  - `kafka-python`
  - `requests`
  - Otras dependencias listadas en los scripts y/o `requirements.txt`

Instala dependencias de Python con:
```sh
pip install pyspark kafka-python requests
```
Agrega otras según sea necesario.

## Notas importantes

- Asegúrate de tener un clúster de Kafka accesible o ejecuta todo en modo local.
- No subas archivos grandes ni carpetas como `node_modules` al repositorio (usa `.gitignore`).
- El flujo recomendado es: **levantar backend y frontend, luego ejecutar scripts de envío y análisis**.

## Estructura del repositorio

```
/
├── kafka-dashboard/
│   ├── backend/
│   └── frontend/
├── envio.py
├── batch_analysis2.py
├── ...
```

## Autor

Luis Huachaca HV

---

**Repositorio:** [https://github.com/Luis-Huachaca-HV/2024-34-3](https://github.com/Luis-Huachaca-HV/2024-34-3)