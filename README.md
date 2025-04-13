# London Hackathon - EncodeAI Mini-Apps

![London Hackathon](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/320px-Flag_of_France.svg.png)

A collection of three mini-applications built during the London Hackathon 2025, featuring AI-enhanced functionality and modern web technologies.

## 🚀 Overview

This repository contains three independent web applications built with React, TypeScript, and Tailwind CSS. Each application demonstrates different aspects of modern web development with a focus on AI integration and user experience.

## 📱 Applications

### 1. Group Expenses Tracker

A user-friendly app designed to help groups of friends or households manage and track shared expenses. The app allows users to log expenses, assign them to individuals, and automatically calculate who owes what to whom.

**Key Features:**
- Add and track group expenses
- Split expenses among multiple participants
- View real-time balance summaries
- Settle debts with a simple click
- Intuitive and modern user interface

### 2. PlanBuddies

A social planning application that helps friends organize events together. Features AI-generated descriptions and event images to make planning more engaging and fun.

**Key Features:**
- Create and manage user profiles with AI-generated avatars
- Organize events with detailed information
- Generate beautiful event images using AI
- Create AI-powered group descriptions
- French-themed UI with elegant design elements

### 3. Wheel of Fate

An event planning tool that helps groups decide who brings what to an event using a spinning wheel mechanism. Perfect for potlucks, parties, and group gatherings.

**Key Features:**
- Create and manage events
- Track participants and their responses
- Assign items to participants using a spinning wheel
- Manage event items and responsibilities
- French-themed UI consistent with the other applications

## 🛠️ Tech Stack

All applications are built with:
- React 19
- TypeScript
- Tailwind CSS for styling
- Zustand for state management
- Express.js for backend services
- OpenAI API integration for AI features

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation and Running

1. Clone the repository:
```bash
git clone https://github.com/yourusername/London_Hackathon_encodeAI.git
cd London_Hackathon_encodeAI
```

2. Choose an application to run:
```bash
cd tonk/apps/[app-name]  # Replace [app-name] with group-expenses-tracker, planbuddies, or wheel-of-fate
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. For applications with backend services (like PlanBuddies), start the server:
```bash
cd server
npm install
npm run build
npm run start
```

## 🔌 API Integration

Some applications use OpenAI's API for enhanced features:

- **PlanBuddies**: Uses OpenAI for generating event images, user avatars, and group descriptions
- Set up your `.env` file with your OpenAI API key:
```
OPENAI_API_KEY=your-api-key-here
PORT=6080
```

## 👥 Contributors

- Valentin Bonnet
- Théo Premartin

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏆 Hackathon Achievement

Created during the London Hackathon 2025, these applications demonstrate the integration of AI capabilities with modern web development practices.
