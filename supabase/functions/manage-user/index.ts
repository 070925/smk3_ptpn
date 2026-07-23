// supabase/functions/manage-user/index.ts
//
// Edge Function untuk manajemen pengguna oleh admin:
//   - action "create": buat akun Supabase Auth baru + profil di tabel users
//   - action "update": ubah nama/email/password/role/status pengguna
//   - action "delete": hapus akun Auth + profil pengguna
//
// Hanya bisa dipanggil oleh user yang sudah login DAN rolenya "admin"
// (dicek di dalam function ini, bukan cuma di sisi frontend).
//
// Deploy: 
//   supabase functions deploy manage-user
// Atau lewat Supabase Dashboard -> Edge Functions -> Deploy new function

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Missing Authorization header" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Client pakai token si pemanggil, buat identifikasi siapa yang request
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller }, error: callerErr } = await callerClient.auth.getUser();
    if (callerErr || !caller) {
      return jsonResponse({ error: "Sesi tidak valid, silakan login ulang." }, 401);
    }

    // Client admin (service_role) - bypass RLS
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Pastikan pemanggil adalah admin
    const { data: callerProfile, error: profileErr } = await adminClient
      .from("users")
      .select("role")
      .eq("id", caller.id)
      .single();

    if (profileErr || !callerProfile || callerProfile.role !== "admin") {
      return jsonResponse({ error: "Hanya admin yang boleh mengelola pengguna." }, 403);
    }

    const body = await req.json();
    const { action } = body;

    // ---- CREATE ----
    if (action === "create") {
      const { nama, email, password, role, status } = body;
      if (!nama || !email || !password) {
        return jsonResponse({ error: "Nama, email, dan password wajib diisi." }, 400);
      }

      // Cek apakah email sudah terdaftar
      const { data: existingUser } = await adminClient
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existingUser) {
        return jsonResponse({ error: "Email sudah terdaftar. Gunakan email lain." }, 400);
      }

      const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { nama },
      });

      if (createErr) {
        return jsonResponse({ error: createErr.message }, 400);
      }

      // Trigger handle_new_user sudah insert row di tabel users.
      // Update role/status sesuai pilihan admin.
      const { error: updateErr } = await adminClient
        .from("users")
        .update({ role: role || "petugas", status: status || "Aktif" })
        .eq("id", created.user.id);

      if (updateErr) {
        return jsonResponse({ error: "User created but profile update failed: " + updateErr.message }, 400);
      }

      return jsonResponse({ success: true, id: created.user.id });
    }

    // ---- UPDATE ----
    if (action === "update") {
      const { id, nama, email, password, role, status } = body;
      if (!id) {
        return jsonResponse({ error: "ID pengguna wajib diisi." }, 400);
      }

      // Update auth user
      const authUpdate: Record<string, unknown> = {};
      if (email) authUpdate.email = email;
      if (password) authUpdate.password = password;
      if (nama) authUpdate.user_metadata = { nama };

      if (Object.keys(authUpdate).length > 0) {
        const { error: authUpdateErr } = await adminClient.auth.admin.updateUserById(id, authUpdate);
        if (authUpdateErr) {
          return jsonResponse({ error: authUpdateErr.message }, 400);
        }
      }

      // Update profile
      const profileUpdate: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (nama) profileUpdate.nama = nama;
      if (email) profileUpdate.email = email;
      if (role) profileUpdate.role = role;
      if (status) profileUpdate.status = status;

      const { error: profileUpdateErr } = await adminClient
        .from("users")
        .update(profileUpdate)
        .eq("id", id);

      if (profileUpdateErr) {
        return jsonResponse({ error: profileUpdateErr.message }, 400);
      }

      return jsonResponse({ success: true });
    }

    // ---- DELETE ----
    if (action === "delete") {
      const { id } = body;
      if (!id) {
        return jsonResponse({ error: "ID pengguna wajib diisi." }, 400);
      }
      if (id === caller.id) {
        return jsonResponse({ error: "Tidak dapat menghapus akun sendiri." }, 400);
      }

      const { error: deleteErr } = await adminClient.auth.admin.deleteUser(id);
      if (deleteErr) {
        return jsonResponse({ error: deleteErr.message }, 400);
      }

      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: "Action tidak dikenali. Gunakan: create, update, delete." }, 400);
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
