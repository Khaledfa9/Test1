
# Khaled's CalorAI

A modern, AI-powered calorie and macronutrient tracker built with React, TypeScript, and Google Gemini.

## Features

-   **Calorie & Macro Tracking:** Log your daily meals and track your intake against your goals.
-   **AI Meal Extraction:** Upload a photo or PDF of your diet plan, and let Gemini AI automatically extract the meals, calories, and macros for you.
-   **AI Image Generation:** When adding a new meal, CalorAI automatically generates a realistic image of the food.
-   **Persistent Storage:** Your data is saved securely in your browser's local storage.
-   **Analytics Dashboard:** Visualize your progress with charts and insights into your eating habits.
-   **Light & Dark Mode:** A beautiful, responsive interface that adapts to your preferred theme.

## Tech Stack

-   **Frontend:** React 18, TypeScript
-   **AI:** Google Gemini API (`@google/genai`)
-   **Styling:** Tailwind CSS
-   **Charting:** Recharts
-   **Build Tool:** Vite

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   Node.js (v18 or later)
-   `npm` or `yarn`

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd calorai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your Gemini API Key:**
    -   Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    -   Create a file named `.env.local` in the root of the project.
    -   Add your API key to the `.env.local` file:
        ```
        VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
        ```

### Running the Application

Once you've completed the setup, you can start the development server:

```bash
npm run dev
```

This will launch the application in your browser, typically at `http://localhost:5173`.

## Available Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the application for production.
-   `npm run preview`: Serves the production build locally.
-   `npm run lint`: Lints the codebase for errors and warnings.
