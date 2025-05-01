import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("pages/welcome.tsx"),
    route("/login", "./pages/auth/login.tsx"),
    route("/register", "./pages/auth/register.tsx"),
    route("/dashboard", "./pages/dashboard.tsx"),
    route("/settings/profile", "./pages/settings/profile.tsx"),
    route("/settings/password", "./pages/settings/password.tsx"),
    route("/settings/appearance", "./pages/settings/appearance.tsx"),
    route("/users", "./pages/user/index.tsx"),
    route("/users/:id", "./pages/user/show.tsx"),
    route("/ordinary-users", "./pages/ordinary-user/index.tsx"),
    route("/ordinary-users/:id", "./pages/ordinary-user/show.tsx"),
    route("/permits", "./pages/permit/index.tsx"),
    route("/permits/:id", "./pages/permit/show.tsx"),
    route("/verify-account-notice", "./pages/auth/waiting-verification.tsx"),
] satisfies RouteConfig;
