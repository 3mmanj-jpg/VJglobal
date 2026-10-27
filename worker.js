const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
});
const safe = (value) => String(value ?? "").slice(0, 3000);
const escapeHtml = (value) => safe(value).replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/inquiry") {
      if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
      let data;
      try { data = await request.json(); } catch { return json({ error: "Invalid form submission." }, 400); }
      if (!data || typeof data !== "object" || Array.isArray(data)) return json({ error: "Invalid form submission." }, 400);
      if (String(data.website || "").trim()) return json({ ok: true });
      for (const field of ["formType", "name", "email", "phone"]) {
        if (!String(data[field] || "").trim()) return json({ error: `Please complete the ${field} field.` }, 400);
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) return json({ error: "Please enter a valid email address." }, 400);
      if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL || !env.FROM_EMAIL) {
        return json({ error: "The inquiry form is not configured for email delivery yet. Please contact us by email or WhatsApp." }, 503);
      }
      const rows = Object.entries(data)
        .filter(([key]) => !["website", "formType"].includes(key))
        .map(([key, value]) => `<tr><th align="left" style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(key)}</th><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(value)}</td></tr>`).join("");
      const kind = data.formType === "training" ? "Build & Sell Training Inquiry" : "Fulfillment Quote Request";
      const result = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: env.FROM_EMAIL,
          to: [env.CONTACT_EMAIL],
          reply_to: safe(data.email),
          subject: `V&J Global Business — ${kind}`,
          html: `<div style="font-family:Arial,sans-serif;color:#101c2b"><h2>${kind}</h2><p>New inquiry submitted through the V&J Global Business website.</p><table style="border-collapse:collapse;width:100%">${rows}</table></div>`
        })
      });
      if (!result.ok) return json({ error: "We couldn't deliver your inquiry. Please try again later." }, 502);
      return json({ ok: true });
    }
    return env.ASSETS.fetch(request);
  }
};
