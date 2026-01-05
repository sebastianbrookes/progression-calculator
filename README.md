# 🏀 NBA 2K Progression Calculator

A modern web app companion for NBA 2K26 MyNBA team rebuild series. Enter your player's game stats and receive calculated development points with randomized perks that add excitement and realism to player progression.

## ✨ Features

- **📊 Stats Entry** — Input points, rebounds, assists, steals, blocks, and awards
- **🎲 Perk Wheel** — Spin for random buffs, nerfs, or neutral effects
- **📈 Points Calculation** — Automatic development and badge point generation
- **⚙️ Customization** — Configure point values and create custom perks
- **💾 Persistent Settings** — localStorage saves your preferences
- **📱 Mobile Friendly** — Responsive design for on-the-go use

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 16.1 | React framework |
| [React](https://react.dev/) | 19.2 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Styling |
| [shadcn/ui](https://ui.shadcn.com/) | — | Component library |
| [Lucide React](https://lucide.dev/) | — | Icons |
| [Vercel](https://vercel.com/) | — | Deployment |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/progression-calculator.git

# Navigate to project
cd progression-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```
progression-calculator/
├── app/
│   ├── page.tsx          # Home - Stats entry form
│   ├── spin/page.tsx     # Perk wheel spinner
│   ├── results/page.tsx  # Points breakdown & perk display
│   ├── customize/        # Point settings configuration
│   └── perks/            # Custom perk management
├── components/
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── perks.ts          # Perk definitions
│   ├── perksStorage.ts   # Custom perk localStorage
│   └── pointSettingsStorage.ts  # Point config storage
└── public/               # Static assets
```

## 🎮 How It Works

1. **Enter Stats** — Input your player's game performance
2. **Select Awards** — Check any earned accolades (POTG, MVP, etc.)
3. **Spin the Wheel** — Try your luck for a buff or debuff perk
4. **View Results** — See calculated development & badge points with perk effects

## 🌐 Deployment

Deployed on [Vercel](https://vercel.com). Push to `main` for automatic deployment.

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🙏 Credits

- Built for [Peeweedaplug's](https://www.youtube.com/@PeeWeeDaGamer) Brooklyn Nets MyNBA series
- Inspired by [nba2kpt.com](https://www.nba2kpt.com/) by Jonas Dockx
- Developed by [Sebastian Brookes](https://www.linkedin.com/in/sebastian-brookes/)
