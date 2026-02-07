# The Prism

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)

An AI-powered custom t-shirt design platform. Describe your design idea in natural language or upload a sketch, and the AI generates artwork that you can preview on a t-shirt mockup and purchase.

## Features

- **Text-to-T-Shirt** — Type a description and AI generates a custom design previewed on a t-shirt mockup
- **Sketch-to-Image** — Upload a hand-drawn sketch with a text prompt to transform it into a polished design
- **Design Marketplace** — Browse the latest AI-generated designs from other users
- **Integrated Payments** — Purchase designs via MercadoPago with email delivery of the print-ready file
- **Modern UI** — Dark theme with glassmorphism effects and animated gradient backgrounds

## Tech Stack

- **Next.js 14** (App Router) — React framework
- **Tailwind CSS** — Styling with custom glassmorphism and gradient effects
- **Stability AI** (Stable Diffusion v1.6) — AI image generation
- **MercadoPago** — Payment processing (via backend)
- **Axios** — HTTP client

## Architecture

```
the-prism (Frontend)
    │
    ├── /art                    → AI art generation page
    │   └── ArtGenerator        → Text prompt input, sketch upload, preview, payment flow
    │
    ├── /success                → Post-purchase confirmation
    │
    └── /                       → Landing page with hero, features, marketplace highlights
         └── MarketplaceHighlights → Latest designs from the backend API
```

The frontend communicates with a separate [backend service](https://github.com/ryanviana/mvp-the-prism-backend) for image generation orchestration, payment processing, and email delivery.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- The [backend service](https://github.com/ryanviana/mvp-the-prism-backend) running on port 3000

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ryanviana/the-prism.git
   cd the-prism
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables** — create a `.env.local` file:
   ```
   STABILITY_API_KEY=<your-stability-ai-api-key>
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
   NEXT_PUBLIC_SUCCESS_FRONTEND_URL=http://localhost:3001/success
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Related Repositories

- [mvp-the-prism-backend](https://github.com/ryanviana/mvp-the-prism-backend) — Backend API (NestJS + MongoDB + MercadoPago)
