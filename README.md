# Hex Mining Game

## Overview

Hex Mining Game is an interactive web-based game where players can mine resources (ETH and TON) from a hexagonal grid. Players can purchase tools to improve their mining efficiency and manage their in-game balance.

This project was bootstrapped with Vite, React, and TypeScript.

## Features

- Hexagonal grid-based mining field
- Resource mining (ETH and TON)
- Tool shop with various mining tools
- User balance management
- Real-time balance updates via WebSocket
- Responsive design for various screen sizes

## Technologies Used

- React
- TypeScript
- Vite
- Zustand (for state management)
- Firebase (Firestore for database)
- Tailwind CSS (for styling)
- WebSocket (for real-time balance updates)

## Setup

1. Clone the repository:
2. Install dependencies: npm install
3. Set up your Firebase project and add your configuration to `.env`
4. Start the development server: npm run dev (Web Telegram t.me/App_Find_BTC_bot/FindBTC_App)

## Usage

1. Connect your wallet or authenticate with Telegram
2. Explore the hexagonal grid and click on cells to mine resources
3. Visit the shop to purchase mining tools
4. Use tools to increase mining efficiency
5. Monitor your balance in real-time

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```
