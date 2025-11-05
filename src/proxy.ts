import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";

export default convexAuthNextjsMiddleware(async (req, { convexAuth }) => {
  // Allow all requests to proceed without authentication checks or redirects
  return;
});

export const config = {
  // Match all routes to ensure Convex Auth can handle auth endpoints
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
