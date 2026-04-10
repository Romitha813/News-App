# NewsAnalyzer: Full-Internet News Search App

NewsAnalyzer is a modern, full-stack Next.js web application designed to bring transparency to internet searching. It fetches the latest news from across the web, dynamically scores sources based on reliability, and provides robust article reading features. 

Built with an elegant dark mode, glassmorphism UI, and Vanilla CSS, the system is designed to provide quick, insightful, and verified access to current events without bias traps.

## ✨ Features

- **Latest Famous News**: A dynamic beautiful dashboard representing top-tier news articles locally cached without overbearing API requests.
- **Reliability Engine**: Uses advanced domain detection logic to automatically grade and filter out unverified sources natively in the frontend. Displays verified news clearly, moving unverified or heavily opinionated news to a designated collapsible "Unreliable dropdown".
- **Built-in Readability Extractor**: Click "Read Full" on any abstract to trigger the backend to scrape, clean, and provide the entire article text directly inside the app using Mozilla's Readability parser without needing to navigate securely ad-ridden websites.
- **Markdown & PDF Exports**: One-click download functions generating professional, offline versions of your search results or entire articles in Markdown locally!
- **Purely Next.js (App Router)**: Fast Server-Side generation integrated alongside Client-Side API interactions.

## 🚀 Getting Started

### 1. Requirements

Before running the project, you must acquire a free token from the **GNews API**:
- Sign up at [GNews.io](https://gnews.io)
- Copy your access key

### 2. Environment Variables

Create and populate the `.env.local` file inside the root folder:

```bash
# Get from https://gnews.io
NEXT_PUBLIC_GNEWS_API_KEY="YOUR_GNEWS_API_KEY_HERE"
```

### 3. Installation

Install the required dependencies using NPM:

```bash
npm install
```

### 4. Running Locally

Run the development server natively:

```bash
npm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) using your browser to see the dashboard.

## 🛠️ Tech Stack
- **Framework**: [Next.js 14](https://nextjs.org/)
- **UI & Styling**: Custom Vanilla CSS with modern Glassmorphism
- **TypeScript**: Highly typed components and models
- **HTML Document Extraction**: `@mozilla/readability` + `jsdom`
- **Deployment**: Local Node runtime or Vercel edge networks
