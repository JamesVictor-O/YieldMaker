export function buildSelfVerificationUrl(params: {
  address?: string | null;
}): string {
  const appBase = process.env.NEXT_PUBLIC_URL || "";
  const callback = `${appBase}/verify-self/callback`;

  // Prefer a fully specified verify URL; fallback to base + path
  const configured = process.env.NEXT_PUBLIC_SELF_VERIFY_URL;
  const base =
    configured || `${process.env.NEXT_PUBLIC_SELF_BASE_URL || ""}/verify`;

  const url = new URL(base);
  url.searchParams.set("redirect_uri", callback);
  if (params.address) url.searchParams.set("address", params.address);
  return url.toString();
}


