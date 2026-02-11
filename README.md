<img width="1263" height="698" alt="image" src="https://github.com/user-attachments/assets/e39099a8-bc93-4130-b818-6cf236c3ebc5" />



# MarketMind 🚀

MarketMind is a premium, real-time stock market intelligence dashboard built for the modern investor. It provides institutional-grade data, advanced charting, and breaking news in a high-performance, dark-mode interface.



## ✨ Features

-   **Real-Time Data**: Live price updates for Stocks, ETFs, Indices, and Crypto.
-   **Advanced Charting**: Interactive candles, sparklines, and volume data with 1-minute resolution.
-   **Financial Deep Dives**: Key metrics including P/E Ratio, Market Cap, Beta, and EPS.
-   **Aggregated News**: Breaking headlines from top financial sources (Bloomberg, CNBC, Reuters).
-   **Watchlist**: Personalized, persistent watchlist with performance tracking.
-   **Global Coverage**: Track major indices (S&P 500, Nasdaq) and crypto (BTC, ETH).
-   **Responsive Design**: A seamless experience across desktop, tablet, and mobile.

## 🛠️ Tech Stack

-   **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) (Animations)
-   **Data Fetching**: [SWR](https://swr.vercel.app/) (Stale-While-Revalidate caching)
-   **Charts**: [Recharts](https://recharts.org/)
-   **API**: Integrated with **Finnhub** for reliable market data.
-   **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/marketmind.git
    cd marketmind
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env.local` file in the root directory and add your Finnhub API key:
    ```env
    FINNHUB_API_KEY=your_api_key_here
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/            # Server-side API Proxies (Secure)
│   │   ├── components/     # Reusable UI Components
│   │   ├── hooks/          # Custom React Hooks
│   │   ├── lib/            # Utilities & Helpers
│   │   └── page.tsx        # Dashboard Entry Point
│   └── ...
├── public/                 # Static Assets
└── ...
```

## 🔒 Security Note

This application uses a BFF (Backend-for-Frontend) architecture to securely proxy API requests. Your Finnhub API key is never exposed to the client-side browser.

## 📄 License

This project is open source and available under the [MIT Logic](LICENSE).
