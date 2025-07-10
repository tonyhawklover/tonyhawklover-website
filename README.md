# Abel Blanco - Interactive Resume with AI Line Rider

A unique and creative resume website that combines professional information with an interactive AI-powered Line Rider game overlay. Watch as an AI learns to play Line Rider in real-time while you browse through my professional experience and projects.

## 🎮 Features

### Interactive Resume

- **Modern Design**: Clean, responsive design with smooth animations
- **Multiple Sections**: About, Experience, Education, Skills, and Projects
- **Dark Mode Support**: Automatic dark/light mode based on system preference
- **Smooth Navigation**: Tabbed interface with smooth transitions

### AI-Powered Line Rider Game

- **Real-time AI Learning**: AI that evolves and improves its Line Rider gameplay over time
- **Genetic Algorithm**: Uses evolutionary algorithms to optimize line placement and rider control
- **Visual Learning Progress**: See the AI's generation, best score, and learning metrics
- **User Control**: Take control at any time to draw your own lines
- **Physics Simulation**: Realistic physics using Matter.js

### Technical Highlights

- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Modern utility-first CSS framework
- **Matter.js**: Physics engine for realistic Line Rider simulation
- **Framer Motion**: Smooth animations and transitions
- **Genetic Algorithm**: Custom AI implementation that learns and evolves

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/abelblanco/tonyhawklover-website.git
cd tonyhawklover-website
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

## 🎯 How the AI Works

The AI uses a genetic algorithm to learn optimal Line Rider strategies:

1. **Population**: Maintains multiple strategies (individuals) in each generation
2. **Evaluation**: Each strategy is scored based on:
   - Distance traveled
   - Tricks performed (flips, air time)
   - Overall performance
3. **Selection**: Best-performing strategies survive to the next generation
4. **Crossover**: Combines successful strategies to create new ones
5. **Mutation**: Introduces random variations to explore new possibilities
6. **Evolution**: Each generation typically lasts 30 seconds before evolving

### AI Controls

- **AI Control**: Watch the AI learn and evolve its strategies
- **Take Control**: Switch to manual mode to draw your own lines
- **Reset**: Start the AI learning process from scratch

## 🛠️ Technical Architecture

### Frontend

- **React 19**: Latest React with modern hooks and concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animation library

### Game Engine

- **Matter.js**: 2D physics engine
- **Canvas API**: Custom rendering for optimal performance
- **Genetic Algorithm**: Custom AI implementation

### Deployment

- **Vercel**: Optimized for Next.js deployment
- **Cloudflare**: CDN and edge computing support

---

_Built with ❤️ by Abel Blanco_

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Deploying To Production

| Command                           | Action                                       |
| :-------------------------------- | :------------------------------------------- |
| `npm run build`                   | Build your production site                   |
| `npm run preview`                 | Preview your build locally, before deploying |
| `npm run build && npm run deploy` | Deploy your production site to Cloudflare    |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
