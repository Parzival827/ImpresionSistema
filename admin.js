import { all, get, save, isAdmin, makeCookie, sha } from './store.js';
import crypto from 'node:crypto';
const ESTADOS = ['Nuevo', 'Cotizado', 'Aprobado', 'Imprimiendo', 'Listo', 'Entregado', 'Cancelado'];
export default async function handler(req, res) {
  const a = req.query.action;
  if (a === 'login' && req.method === 'POST') {
    const ok = process.env.ADMIN_PASSWORD && crypto.timingSafeEqual(sha(req.body?.password), sha(process.env.ADMIN_PASSWORD));
    if (!ok) return res.status(401).json({ error: 'Contraseña incorrecta (¿configuraste ADMIN_PASSWORD?)' });
    res.setHeader('Set-Cookie', makeCookie()); return res.json({ ok: true });
  }
  if (!isAdmin(req)) return res.status(401).json({ error: 'No autorizado' });
  if (a === 'list') return res.json(await all());
  if (a === 'update' && req.method === 'POST') {
    const b = req.body || {}, o = await get(b.id);
    if (!o) return res.status(404).json({ error: 'Pedido no encontrado' });
    if (ESTADOS.includes(b.estado)) o.estado = b.estado;
    o.precio = b.precio === '' || b.precio == null ? null : Number(b.precio);
    o.pagado = Number(b.pagado) || 0;
    o.mensaje = String(b.mensaje || '').slice(0, 1000); o.notas = String(b.notas || '').slice(0, 2000);
    await save(o); return res.json(o);
  }
  res.status(400).json({ error: 'Acción inválida' });
}
