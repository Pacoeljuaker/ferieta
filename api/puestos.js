// Vercel Serverless Function: /api/puestos.js
// GET: lista puestos | POST: registra puesto (requiere usuario válido) | DELETE: elimina puesto SOLO si pertenece al usuario

async function readSupabaseJson(res) {
  const text = await res.text();
  try {
    return { json: JSON.parse(text), text };
  } catch (_) {
    return { json: null, text };
  }
}

async function verificarUsuario(supabaseUrl, headers, user) {
  if (!user || !user.id || !user.email || !user.password_hash) return null;
  const res = await fetch(
    `${supabaseUrl}/rest/v1/usuarios_feria?id=eq.${encodeURIComponent(user.id)}&email=eq.${encodeURIComponent(user.email)}&select=*`,
    { headers }
  );
  if (!res.ok) return null;
  const parsed = await readSupabaseJson(res);
  const rows = parsed.json;
  if (!Array.isArray(rows) || rows.length === 0) return null;
  if (rows[0].password_hash !== user.password_hash) return null;
  return rows[0];
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  const supabaseUrl = (process.env.SUPABASE_URL || "").trim().replace(/\/+$/, "");
  const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
  const table = "puestos_feria";

  if (!supabaseUrl || !supabaseKey) {
    return res.status(503).json({
      ok: false,
      message: "Backend en la nube aún no configurado (faltan variables SUPABASE_URL y SUPABASE_ANON_KEY en Vercel)."
    });
  }

  const headers = {
    "Content-Type": "application/json",
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`
  };

  if (req.method === "GET") {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*&order=id.asc`, {
        method: "GET",
        headers
      });
      const parsed = await readSupabaseJson(response);
      if (!response.ok) {
        return res.status(response.status).json({
          ok: false,
          error: parsed.json?.message || parsed.text || "Error al cargar puestos."
        });
      }
      return res.status(200).json({ ok: true, puestos: parsed.json || [] });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { puesto, user } = body || {};

      const validUser = await verificarUsuario(supabaseUrl, headers, user);
      if (!validUser) {
        return res.status(401).json({ ok: false, error: "Debes iniciar sesión con una cuenta válida para registrar un puesto." });
      }

      const { id, numero, nombre, categoria, descripcion, icono, color, imagen, lat, lng, productos } = puesto || {};
      if (!id || !nombre || !categoria || !descripcion || !Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ ok: false, error: "Faltan campos obligatorios en el registro." });
      }

      const checkRes = await fetch(`${supabaseUrl}/rest/v1/${table}?id=eq.${Number(id)}&select=id,owner_id,nombre`, { headers });
      const checkParsed = await readSupabaseJson(checkRes);
      const existing = Array.isArray(checkParsed.json) ? checkParsed.json : [];
      if (existing.length > 0 && existing[0].owner_id && existing[0].owner_id !== validUser.id) {
        return res.status(403).json({ ok: false, error: "Este puesto ya fue registrado por otro usuario." });
      }

      const payload = {
        id: Number(id),
        numero: String(numero || `Puesto ${id}`),
        nombre: String(nombre).trim(),
        categoria: String(categoria).trim(),
        descripcion: String(descripcion).trim(),
        icono: String(icono || "fa-store"),
        color: String(color || "#10b981"),
        imagen: String(imagen || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80"),
        lat: Number(lat),
        lng: Number(lng),
        owner_id: validUser.id,
        owner_nombre: validUser.nombre,
        productos
      };

      const response = await fetch(`${supabaseUrl}/rest/v1/${table}?on_conflict=id`, {
        method: "POST",
        headers: {
          ...headers,
          Prefer: "resolution=merge-duplicates,return=representation"
        },
        body: JSON.stringify(payload)
      });
      const parsed = await readSupabaseJson(response);

      if (!response.ok) {
        return res.status(response.status).json({
          ok: false,
          error: parsed.json?.message || parsed.text || "Error al guardar el puesto."
        });
      }

      const saved = Array.isArray(parsed.json) ? parsed.json[0] : parsed.json;
      return res.status(200).json({ ok: true, puesto: saved || payload });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { id, user } = body || {};

      const validUser = await verificarUsuario(supabaseUrl, headers, user);
      if (!validUser) {
        return res.status(401).json({ ok: false, error: "Sesión inválida." });
      }

      const checkRes = await fetch(`${supabaseUrl}/rest/v1/${table}?id=eq.${Number(id)}&select=id,owner_id`, { headers });
      const checkParsed = await readSupabaseJson(checkRes);
      const rows = Array.isArray(checkParsed.json) ? checkParsed.json : [];

      if (rows.length === 0) {
        return res.status(404).json({ ok: false, error: "Puesto no encontrado en la base de datos." });
      }

      if (String(rows[0].owner_id) !== String(validUser.id)) {
        return res.status(403).json({ ok: false, error: "No autorizado: solo el usuario que registró este puesto puede eliminarlo." });
      }

      const delRes = await fetch(
        `${supabaseUrl}/rest/v1/${table}?id=eq.${Number(id)}&owner_id=eq.${encodeURIComponent(validUser.id)}`,
        {
          method: "DELETE",
          headers
        }
      );
      const delParsed = await readSupabaseJson(delRes);

      if (!delRes.ok) {
        return res.status(delRes.status).json({
          ok: false,
          error: delParsed.json?.message || delParsed.text || "Error al eliminar el puesto."
        });
      }

      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).json({ ok: false, error: `Método ${req.method} no permitido` });
}
