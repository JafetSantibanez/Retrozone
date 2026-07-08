import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        catalogoAdmin: resolve(__dirname, "src/admin/catalogo_admin.html"),
        loginAdmin: resolve(__dirname, "src/admin/loginAdmin/loginAdmin.html"),
        notFoundComponent: resolve(__dirname, "src/components/not-found/not-found.html"),
        aboutus: resolve(__dirname, "src/pages/aboutus/aboutus.html"),
        forgotPassword: resolve(__dirname, "src/pages/auth/forgot-password/forgot-password.html"),
        login: resolve(__dirname, "src/pages/auth/login/login.html"),
        register: resolve(__dirname, "src/pages/auth/register/register.html"),
        catalog: resolve(__dirname, "src/pages/catalog/catalog.html"),
        contact: resolve(__dirname, "src/pages/contact/contact.html"),
        home: resolve(__dirname, "src/pages/home/home.html"),
        notFound: resolve(__dirname, "src/pages/notFound/notFound.html"),
        privacy: resolve(__dirname, "src/pages/privacy/privacy.html"),
        profile: resolve(__dirname, "src/pages/profile/profile.html"),
        cart: resolve(__dirname, "src/pages/shopping-cart/cart.html"),
        terms: resolve(__dirname, "src/pages/terms/terms.html"),
      },
    },
  },
});