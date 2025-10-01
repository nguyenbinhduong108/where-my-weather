export async function serverPost(path: string, body?: any, init?: RequestInit) {
  const base = process.env.BASR_API || process.env.BASR_API || "";
  if (!base) {
    throw new Error("Backend base URL not configured (BASR_API or BASR_API)");
  }

  const url = `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init && (init.headers as Record<string, string>)),
    },
    body: body ? JSON.stringify(body) : undefined,
    // Avoid caching server-to-server calls unless specifically requested
    cache: "no-store",
    ...init,
  });

  const json = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data: json };
}

export async function serverGet(path: string, init?: RequestInit) {
  const base = process.env.BASR_API || process.env.BASR_API || "";
  if (!base) {
    throw new Error("Backend base URL not configured (BASR_API or BASR_API)");
  }

  const url = `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, { method: "GET", headers: { Accept: "application/json", ...(init && (init.headers as Record<string, string>)) }, cache: "no-store", ...init });
  const json = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data: json };
}

export async function serverPut(path: string, body?: any, init?: RequestInit) {
  const base = process.env.BASR_API || process.env.BASR_API || "";
  if (!base) {
    throw new Error("Backend base URL not configured (BASR_API or BASR_API)");
  }

  const url = `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...(init && (init.headers as Record<string, string>)) },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    ...init,
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data: json };
}

export async function serverPatch(path: string, body?: any, init?: RequestInit) {
  const base = process.env.BASR_API || process.env.BASR_API || "";
  if (!base) {
    throw new Error("Backend base URL not configured (BASR_API or BASR_API)");
  }

  const url = `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...(init && (init.headers as Record<string, string>)) },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    ...init,
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data: json };
}

export async function serverDelete(path: string, init?: RequestInit) {
  const base = process.env.BASR_API || process.env.BASR_API || "";
  if (!base) {
    throw new Error("Backend base URL not configured (BASR_API or BASR_API)");
  }

  const url = `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, { method: "DELETE", headers: { Accept: "application/json", ...(init && (init.headers as Record<string, string>)) }, cache: "no-store", ...init });
  const json = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data: json };
}
