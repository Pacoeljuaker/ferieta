# Feria Grecia (Ictinos) - Mapa Interactivo y Registro de Puestos

## Estructura del Proyecto
- `index.html`: Interfaz principal con mapa Leaflet y modal de ficha de puesto.
- `styles.css`: Estilos personalizados del mapa, pines y modal.
- `script.js`: Base de datos de los 107 puestos (con descripciones), lógica del mapa y formulario de registro para puestos `Pendiente`.
- `api/puestos.js`: Backend Serverless para Vercel que conecta con Supabase.
- `supabase_schema.sql`: Script SQL para crear la tabla en Supabase.
- `vercel.json`: Configuración de funciones serverless en Vercel.

## Pasos para subir a GitHub y Vercel
1. Sube todos los archivos de esta carpeta a tu repositorio en **GitHub**.
2. En **Vercel**, importa el repositorio (o haz `git push` si ya está conectado).
   - **Nota:** Incluso sin configurar base de datos, la web ya funciona y guarda registros localmente en el navegador (`localStorage`).
3. Para que los registros queden guardados en la nube para **todos los usuarios**:
   - Crea un proyecto gratuito en [Supabase](https://supabase.com).
   - Ve a **SQL Editor**, pega el contenido de `supabase_schema.sql` y presiona **Run**.
   - Ve a **Project Settings > API** y copia tu `Project URL` y `anon public key`.
   - En **Vercel > Settings > Environment Variables**, agrega:
     - `SUPABASE_URL` = tu Project URL
     - `SUPABASE_ANON_KEY` = tu anon public key
   - Haz **Redeploy** en Vercel.
