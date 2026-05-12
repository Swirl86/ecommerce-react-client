# Ecommerce React Client
A modern, fully component‑based React frontend built with **Vite**, **Tailwind CSS**, and a clean architecture.  
This client integrates directly with my Spring Boot backend project: [**springboot-ecommerce-api**](https://github.com/Swirl86/springboot-ecommerce-api).

The project focuses on clarity, maintainability, and small, meaningful commits with a strong emphasis on UI/UX polish and robust test coverage.

---

## 🔗 Backend Integration

This frontend is built to work directly with:

**https://github.com/Swirl86/springboot-ecommerce-api**

### 🧩 Backend Provides
<details>
<summary><strong>E‑commerce Domain</strong></summary>
  
- Products  
- Categories  
- Wishlist  
</details>

<details>
<summary><strong>User & Auth</strong></summary>
  
- JWT authentication  
- User profiles  
- Admin roles
</details>

<details>
<summary><strong>Orders & Checkout</strong></summary>
  
- Cart → Checkout → Order creation  
- Order history  
- Address management
</details>

---

## 📦 Technologies

| Layer / Concern        | Technologies                                  |
| ---------------------- | ---------------------------------------------- |
| Language               | JavaScript (ES2023)                            |
| Framework              | React (Vite)                                   |
| Styling                | Tailwind CSS                                   |
| Architecture           | Component‑based structure                      |
| API                    | Fetch API, integration with springboot-ecommerce-api |
| State (planned)        | Context API / Custom Hooks                     |
| Build Tool             | Vite                                           |
| Package Manager        | npm                                            |
| Utilities              | Prettier (planned)                     |
| Tooling                | Visual Studio Code                             |

---

## 🚀 Features

<details>
<summary><strong>Product Browsing</strong></summary>
  
- Product grid with responsive layout  
- Category filtering (URL‑synced)  
- Sorting (URL‑synced)  
- Product image viewer with zoom  
- Skeleton loaders for smooth UX  
</details>

<details>
<summary><strong>Authentication & User Flow</strong></summary>
  
- Login & Register pages
- Redirects based on auth state
- “Keep me logged in” option
- Form validation via custom hooks
</details>

<details>
<summary><strong>Profile Management</strong></summary>
  
- Profile overview
- Edit profile (name, email, phone, password)
- Edit address
- Wishlist tab (UI placeholder)
- Order history tab (UI placeholder)
</details>

<details>
<summary><strong>Testing</strong></summary>
  
- Full Vitest + Testing Library setup
- Stable mocks for hooks, context, router, and UI
- Tests for:
  - Login
  - Register
  - Profile
  - EditProfileForm
  - EditAddressForm
  - ProductCard
  - Products page
- Centralized alias configuration for consistent imports
</details>

---

## 📌 Notes

- This project is actively evolving alongside the backend.  
- More features will be added: cart, checkout UI, wishlist UI, admin dashboard.  
- UI/UX polish is a priority (animations, skeletons, transitions).  

---

## 🛠️ Development

### 📥 Install dependencies
Install all required packages:

```bash
npm install
```

### 🚀 Start development server

Launch the Vite dev server:

```bash
npm run dev
```

### 🧪 Run tests

Launch the Vite dev server:

```bash
npm run test
```

---

## 📄 License

MIT License  
© 2026 Susanne (Swirl86)
