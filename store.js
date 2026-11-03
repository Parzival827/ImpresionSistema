import { put, list } from '@vercel/blob';
import crypto from 'node:crypto';
const P = 'pedidos/';
export const newId = () => crypto.randomBytes(6).toString('hex').toUpperCase().replace(/(.{4})(.{4})(.{4})/, '$1-$2-$3');
export const save = (o) => put(P + o.id + '.json', JSON.stringify(o), { access: 'public', allowOverwrite: true, addRandomSuffix: false, contentType: 'application/json' });
const read = (u) => fetch(u + '?t=' + Date.now(), { cache: 'no-store' }).then((r) => r.json());
export async function get(id) {
  if (!/^[A-F0-9]{4}(-[A-F0-9]{4}){2}$/.test(id || '')) return null;
  const { blobs } = await list({ prefix: P + id + '.json' });
  return blobs[0] ? read(blobs[0].url) : null;
}
export async function all() {
  let cursor, bl = [];
  do { const r = await list({ prefix: P, cursor }); bl.push(...r.blobs); cursor = r.cursor; } while (cursor);
  const out = await Promise.all(bl.map((b) => read(b.url).catch(() => null)));
  return out.filter(Boolean).sort((a, b) => b.creado.localeCompare(a.creado));
}
const sign = (t) => crypto.createHmac('sha256', process.env.ADMIN_PASSWORD || '').update(t).digest('hex');
export const sha = (s) => crypto.createHash('sha256').update(String(s)).digest();
export const makeCookie = () => { const e = Date.now() + 7 * 864e5; return `adm=${e}.${sign(String(e))}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 86400}`; };
export function isAdmin(req) {
  if (!process.env.ADMIN_PASSWORD) return false;
  const m = /(?:^|;\s*)adm=(\d+)\.([a-f0-9]+)/.exec(req.headers.cookie || '');
  if (!m || Number(m[1]) < Date.now()) return false;
  const a = Buffer.from(m[2]), b = Buffer.from(sign(m[1]));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
