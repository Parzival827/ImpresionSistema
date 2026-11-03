import { get, save, newId } from './store.js';
const t = (v, n) => String(v ?? '').trim().slice(0, n);
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const o = await get(String(req.query.id || '').toUpperCase());
    if (!o) return res.status(404).json({ error: 'No encontramos ese código' });
    const { id, creado, pieza, cantidad, estado, precio, pagado, mensaje } = o;
    return res.json({ id, creado, pieza, cantidad, estado, precio, pagado, mensaje });
  }
  if (req.method !== 'POST') return res.status(405).end();
  const b = req.body || {};
  if (b.web) return res.json({ id: 'OK' }); // honeypot anti-spam
  const o = {
    id: newId(), creado: new Date().toISOString(), estado: 'Nuevo', precio: null, pagado: 0, mensaje: '', notas: '',
    nombre: t(b.nombre, 100), email: t(b.email, 120), telefono: t(b.telefono, 40), pieza: t(b.pieza, 120),
    descripcion: t(b.descripcion, 2000), material: t(b.material, 40), color: t(b.color, 40),
    cantidad: Math.max(1, Math.min(10000, parseInt(b.cantidad) || 1)), fecha_deseada: t(b.fecha_deseada, 20),
    archivos: (Array.isArray(b.archivos) ? b.archivos : []).slice(0, 10)
      .filter((a) => /^https:\/\/[\w.-]+\.blob\.vercel-storage\.com\//.test(a?.url))
      .map((a) => ({ name: t(a.name, 120), url: a.url, size: Number(a.size) || 0 })),
  };
  if (!o.nombre || !/^\S+@\S+\.\S+$/.test(o.email) || !o.pieza) return res.status(400).json({ error: 'Faltan nombre, correo válido o pieza' });
  await save(o);
  res.json({ id: o.id });
}
