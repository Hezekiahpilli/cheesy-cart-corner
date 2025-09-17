# Cheesy Cart Corner

Cheesy Cart Corner is a full-featured pizza ordering experience that showcases menu browsing, customizable pizzas, a persistent shopping cart, and a guided checkout flow. The application is built as a single-page React app and includes authenticated customer areas alongside administrative dashboards for managing orders and curated menu content.

## Features

- **Menu exploration** with featured pizzas, detailed descriptions, imagery, and pricing by size.
- **Cart management** that captures add-ons, sizes, quantities, and automatically totals the order.
- **Account experiences** for registration, login, viewing order history, and continuing saved carts.
- **Checkout workflow** that validates delivery details, payment preferences, and submits an order confirmation.
- **Admin insights** with dashboards and reports to help staff monitor performance and handle day-to-day operations.

## Tech Stack

- [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) powered by [Vite](https://vitejs.dev/).
- [React Router](https://reactrouter.com/) for client-side routing.
- [Zustand](https://zustand-demo.pmnd.rs/) for application state management.
- [TanStack Query](https://tanstack.com/query/latest) for data fetching utilities.
- [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) for styling and component primitives.
- [ESLint](https://eslint.org/) and TypeScript tooling for static analysis.

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm (bundled with Node.js)

### Clone and Install

```bash
git clone https://github.com/<your-org>/cheesy-cart-corner.git
cd cheesy-cart-corner
npm install
```

### Run the Development Server

```bash
npm run dev
```

By default Vite serves the application at `http://localhost:5173`. The dev server supports hot module replacement and will automatically reload when you edit files.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create an optimized production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint across the codebase. |

## Deployment

This project builds to a static bundle that can be deployed on any modern hosting provider (e.g., Netlify, Vercel, Render, GitHub Pages). A typical workflow is:

1. Build the production assets:
   ```bash
   npm run build
   ```
2. Upload the contents of the `dist/` directory to your hosting provider or connect the repository for automatic builds.
3. Configure your host to serve `index.html` for all routes (single-page application fallback) to support client-side routing.

Refer to your provider's documentation for configuring custom domains, environment variables, and build automation.

## Project Structure

```
src/
├── components/       # Reusable UI components (navigation, forms, dialogs, etc.)
├── data/             # Seeded menu, toppings, and drinks data
├── pages/            # Route-level screens (menu, cart, checkout, admin)
├── store/            # Zustand stores for auth, cart, checkout, and orders
├── hooks/, lib/, types/  # Shared utilities and type definitions
└── App.tsx           # Route configuration and providers
```

## Contributing

1. Fork the repository and create your feature branch.
2. Commit your changes with clear messages.
3. Run `npm run lint` (and any other relevant checks).
4. Open a pull request for review.

---

For questions or suggestions, feel free to open an issue or start a discussion.
