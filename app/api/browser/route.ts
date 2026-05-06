export const dynamic = "force-dynamic";

// Headers that cause iframe blocking — stripped before we respond
const STRIP_HEADERS = new Set([
  "x-frame-options",
  "content-security-policy",
  "content-security-policy-report-only",
]);

// Injected into every proxied HTML page so link clicks / form submits
// are forwarded to the parent SafariWindow via postMessage.
const NAV_SCRIPT = `<script>
(function () {
  function send(url) {
    try { window.parent.postMessage({ type: "safari-navigate", url: url }, "*"); } catch(e) {}
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (!href || href.startsWith("#") || href.startsWith("javascript")) return;
    e.preventDefault();
    send(a.href);
  }, true);
  document.addEventListener("submit", function (e) {
    var form = e.target;
    e.preventDefault();
    var action = form.action || window.location.href;
    if (form.method && form.method.toLowerCase() === "post") {
      send(action);
    } else {
      var qs = new URLSearchParams(new FormData(form)).toString();
      send(action + (action.includes("?") ? "&" : "?") + qs);
    }
  }, true);
})();
</script>`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new Response("Missing url param", { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      redirect: "follow",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(errorPage(targetUrl, msg), {
      status: 502,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const rawContentType = upstream.headers.get("content-type") ?? "text/html";
  const isHtml = rawContentType.includes("text/html");

  // Build clean outbound headers
  const outHeaders = new Headers({ "Content-Type": rawContentType });
  upstream.headers.forEach((val, key) => {
    const k = key.toLowerCase();
    if (STRIP_HEADERS.has(k)) return;
    if (k === "content-encoding") return;   // fetch() already decoded
    if (k === "transfer-encoding") return;
    if (k === "content-length") return;     // length changes after injection
    try { outHeaders.set(key, val); } catch { /* skip invalid headers */ }
  });

  if (!isHtml) {
    const body = await upstream.arrayBuffer();
    return new Response(body, { status: upstream.status, headers: outHeaders });
  }

  // ── HTML handling ─────────────────────────────────────────────────────────
  let html = await upstream.text();
  const effectiveUrl = upstream.url ?? targetUrl; // resolved after redirects

  // Remove any pre-existing <base> tags so ours doesn't conflict
  html = html.replace(/<base\b[^>]*>/gi, "");

  // BUG FIX: use /<head([^>]*)>/ so the closing > is always included in
  // the match — previous regex omitted it when <head> had attributes,
  // producing malformed markup like <head lang="en"<base href="...">>
  const baseTag = `<base href="${effectiveUrl}">`;
  if (/<head[^>]*>/i.test(html)) {
    html = html.replace(/<head([^>]*)>/i, (match) => match + baseTag);
  } else if (/<html[^>]*>/i.test(html)) {
    html = html.replace(/<html([^>]*)>/i, (match) => match + `<head>${baseTag}</head>`);
  } else {
    html = baseTag + html;
  }

  // Inject nav interceptor right before </head>
  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, NAV_SCRIPT + "</head>");
  } else {
    html = NAV_SCRIPT + html;
  }

  outHeaders.set("Content-Type", "text/html; charset=utf-8");
  return new Response(html, { status: upstream.status, headers: outHeaders });
}

function errorPage(url: string, reason: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  body{font-family:-apple-system,sans-serif;display:flex;flex-direction:column;
       align-items:center;justify-content:center;height:100vh;margin:0;
       background:#f0f0f5;color:#1d1d1f;gap:12px;text-align:center;padding:24px}
  h2{font-size:18px;font-weight:600;margin:0}
  p{font-size:13px;color:#6e6e73;margin:0;max-width:360px}
  a{display:inline-flex;align-items:center;gap:6px;margin-top:8px;padding:8px 16px;
    background:#0071e3;color:white;border-radius:8px;font-size:13px;font-weight:500;text-decoration:none}
</style></head><body>
  <div style="font-size:52px">🔒</div>
  <h2>Safari Can't Open the Page</h2>
  <p style="font-size:12px;color:#8e8e93;word-break:break-all">${reason}</p>
  <a href="${url}" target="_blank" rel="noopener noreferrer">Open in New Tab ↗</a>
</body></html>`;
}
