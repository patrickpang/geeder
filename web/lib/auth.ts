export function isAuthenticated(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ", 2)[1];
  if (!token) {
    return false;
  }

  // TODO: tokens table
  if (token !== Deno.env.get("GROQ_API_KEY")) {
    return false;
  }

  return true;
}
