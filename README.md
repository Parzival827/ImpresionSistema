# Pedidos 3D (Vercel)
Cliente: `/` (formulario, subida de archivos, seguimiento) · Admin: `/admin` (contraseña).
## Desplegar
1. Sube esta carpeta a un repo de GitHub e impórtalo en vercel.com (o ejecuta `npx vercel` dentro de la carpeta). Framework: "Other".
2. En el proyecto: **Storage → Create → Blob** y conéctalo al proyecto (crea `BLOB_READ_WRITE_TOKEN`).
3. **Settings → Environment Variables**: añade `ADMIN_PASSWORD` con la contraseña que quieras.
4. Haz **Redeploy**. Entra a `tu-dominio.vercel.app/admin`.
## Notas
- Pedidos y archivos viven en Vercel Blob. Las URLs son públicas pero impredecibles; el código de seguimiento es el "secreto" del cliente.
- Máx. 100 MB por archivo (se sube directo a Blob, sin límite de 4.5 MB de las funciones).
- "Exportar CSV" te da Fecha, Cliente, Pieza, Cantidad, Material, Precio, Estado y Pagado para pegar en tu hoja de Pedidos.
