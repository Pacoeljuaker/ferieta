# Feria Grecia (Ictinos) - Registro de Usuarios y Puestos

## Funcionalidades incluidas
1. **Registro e Inicio de Sesión de Usuarios:** Botones en la barra superior (`Iniciar Sesión` / `Crear Cuenta`) y redirección automática si intentas registrar un puesto sin sesión.
2. **Registro en puestos `Pendiente`:** Solo usuarios autenticados pueden reclamar y registrar un puesto pendiente, completando nombre, categoría, descripción y productos con precio/unidad.
3. **Eliminación exclusiva por propietario (`owner_id`):** Solo el usuario que registró un puesto ve el botón **"Eliminar mi Puesto"** y el backend (`/api/puestos.js`) valida que `owner_id` coincida con su cuenta antes de eliminarlo y devolverlo a estado `Pendiente`.
4. **Descripción en cada ficha:** Todos los puestos muestran su descripción dentro de la ventana modal.

## Despliegue en GitHub + Vercel + Supabase
1. Sube todos los archivos de esta carpeta a tu repositorio en **GitHub**.
2. En **Supabase**, abre **SQL Editor**, pega el contenido de `supabase_schema.sql` y ejecútalo (**Run**).
3. En **Vercel > Settings > Environment Variables**, agrega:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Haz **Redeploy** en Vercel.
