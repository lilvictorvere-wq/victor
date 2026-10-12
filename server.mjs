import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { timingSafeEqual } from 'node:crypto';
const port = Number(process.env.PORT || 3000);
const routes = new Map([['/favicon.svg',['favicon.svg','image/svg+xml']],['/', ['index.html','text/html']], ['/styles.css',['styles.css','text/css']], ['/dashboard',['dashboard.html','text/html']], ['/app.js',['app.js','text/javascript']]]);
const privateRoutes = new Set(['/dashboard','/app.js']);
function authorized(req) {
  const { DASHBOARD_USER: user, DASHBOARD_PASSWORD: password } = process.env;
  if (!user || !password) return false;
  const expected = Buffer.from(`Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`);
  const actual = Buffer.from(req.headers.authorization || '');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export const server = http.createServer(async (req,res) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Cache-Control','no-store');
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405); return res.end(); }
  const path = new URL(req.url,'http://localhost').pathname;
  if (privateRoutes.has(path) && !authorized(req)) {
    if (!process.env.DASHBOARD_USER || !process.env.DASHBOARD_PASSWORD) {
      res.writeHead(503, {'Content-Type':'text/plain; charset=utf-8'});
      return res.end('Accesul privat nu este configurat. Setează DASHBOARD_USER și DASHBOARD_PASSWORD pe server.');
    }
    res.writeHead(401, {'WWW-Authenticate':'Basic realm="Victor AI private", charset="UTF-8"'});
    return res.end('Autentificare necesară.');
  }
  const route = routes.get(path);
  if (!route) { res.writeHead(404); return res.end('Pagina nu există.'); }
  try {
    const body = await readFile(new URL(`./public/${route[0]}`,import.meta.url));
    res.writeHead(200, {'Content-Type':`${route[1]}; charset=utf-8`});
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(500); res.end('Pagina nu poate fi încărcată.'); }
});
if (process.argv[1] === new URL(import.meta.url).pathname) server.listen(port,process.env.HOST || '127.0.0.1',()=>console.log(`Victor AI: port ${port}`));
