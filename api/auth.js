// Vercel Serverless Function: /api/auth.js
// Maneja creación de cuenta e inicio de sesión contra la tabla usuarios_feria en Supabase

async function readSupabaseJson(res) {
  const text = await res.text();
  try {
    return { json: JSON.parse(text), text };
  } catch (_) {
    return { json: null, text };
  }
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Método no permitido" });
  }

  const supabaseUrl = (process.env.SUPABASE_URL || "").trim().replace(/\/+$/, "");
  const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
  const tableUsuarios = "usuarios_feria";

  if (!supabaseUrl || !supabaseKey) {
    return res.status(503).json({
      ok: false,
      error: "Backend en la nube no configurado."
    });
  }

  const headers = {
    "Content-Type": "application/json",
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`
  };

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { mode, nombre, email, password_hash } = body || {};

    const emailClean = String(email || "").trim().toLowerCase();
    if (!emailClean || !password_hash) {
      return res.status(400).json({ ok: false, error: "Faltan correo o contraseña." });
    }

    if (mode === "register") {
      const nombreClean = String(nombre || "").trim();
      if (!nombreClean) {
        return res.status(400).json({ ok: false, error: "Debes ingresar tu nombre." });
      }

      const checkRes = await fetch(
        `${supabaseUrl}/rest/v1/${tableUsuarios}?email=eq.${encodeURIComponent(emailClean)}&select=id`,
        { headers }
      );
      const checkParsed = await readSupabaseJson(checkRes);
      if (!checkRes.ok) {
        return res.status(checkRes.status).json({
          ok: false,
          error: checkParsed.json?.message || checkParsed.text || "Error al verificar usuario en Supabase."
        });
      }

      const existing = checkParsed.json;
      if (Array.isArray(existing) && existing.length > 0) {
        return res.status(409).json({ ok: false, error: "Este correo ya está registrado. Inicia sesión." });
      }

      const newUser = {
        nombre: nombreClean,
        email: emailClean,
        password_hash: String(password_hash)
      };

      const insertRes = await fetch(`${supabaseUrl}/rest/v1/${tableUsuarios}`, {
        method: "POST",
        headers: { ...headers, Prefer: "return=representation" },
        body: JSON.stringify(newUser)
      });
      const insertParsed = await readSupabaseJson(insertRes);

      if (!insertRes.ok) {
        return res.status(insertRes.status).json({
          ok: false,
          error: insertParsed.json?.message || insertParsed.text || "Error al crear usuario en Supabase."
        });
      }

      const created = Array.isArray(insertParsed.json) ? insertParsed.json[0] : insertParsed.json;
      return res.status(200).json({
        ok: true,
        user: {
          id: created.id,
          nombre: created.nombre,
          email: created.email,
          password_hash: created.password_hash
        }
      });
    }

    const loginRes = await fetch(
      `${supabaseUrl}/rest/v1/${tableUsuarios}?email=eq.${encodeURIComponent(emailClean)}&select=*`,
      { headers }
    );
    const loginParsed = await readSupabaseJson(loginRes);
    if (!loginRes.ok) {
      return res.status(loginRes.status).json({
        ok: false,
        error: loginParsed.json?.message || loginParsed.text || "Error al consultar usuario en Supabase."
      });
    }

    const rows = loginParsed.json;
    if (!Array.isArray(rows) || rows.length === 0 || rows[0].password_hash !== String(password_hash)) {
      return res.status(401).json({ ok: false, error: "Correo o contraseña incorrectos." });
    }

    const user = rows[0];
    return res.status(200).json({
      ok: true,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        password_hash: user.password_hash
      }
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
