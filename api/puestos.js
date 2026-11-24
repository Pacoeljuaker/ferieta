// Vercel Serverless Function: /api/puestos.js
// Lee y guarda registros de puestos en Supabase usando variables de entorno en Vercel:
// SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (o SUPABASE_ANON_KEY)

export default async function handler(req, res) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
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
      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ ok: false, error: errText });
      }
      const puestos = await response.json();
      return res.status(200).json({ ok: true, puestos });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { id, numero, nombre, categoria, descripcion, icono, color, imagen, lat, lng, productos } = body || {};

      if (!id || !nombre || !categoria || !descripcion || !Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ ok: false, error: "Faltan campos obligatorios en el registro." });
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

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ ok: false, error: errText });
      }

      const saved = await response.json();
      return res.status(200).json({ ok: true, puesto: saved[0] || payload });
    } catch (error) {
      return res.status(500).json({ ok: false, error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ ok: false, error: `Método ${req.method} no permitido` });
}
