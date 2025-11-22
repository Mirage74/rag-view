export function createAuthEntity(raw) {
  if (!raw) return null;
  const p = raw.payload || {};
  return {
    message: raw.message ?? "",
    success: Boolean(raw.success),
    payload: {
      id: p.id ?? null,
      username: p.username ?? "",
      email: p.email ?? "",
      registrationStatus: p.registrationStatus ?? "",
      lastLogin: p.lastLogin ?? null,
      token: p.token ?? "",
      refreshToken: p.refreshToken ?? "",
    },
  };
}
