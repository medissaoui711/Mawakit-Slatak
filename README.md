
# Mawakit - Modern Prayer Times PWA

![Project Banner](https://placehold.co/1200x400/d62828/ffffff?text=Mawakit+App+Preview)

**Mawakit** is a comprehensive, modern Progressive Web Application (PWA) designed to assist Muslims in their daily worship. Built with performance and privacy in mind, it provides accurate prayer times, a Qibla compass with Augmented Reality (AR) support, a digital Quran, and tools for tracking daily worship habits—all accessible directly from your browser.

It solves the problem of intrusive, ad-heavy mobile applications by offering a clean, lightweight, and offline-capable alternative that works seamlessly across mobile and desktop devices.

## ✨ Features

*   **Accurate Prayer Times:** Displays scheduled times for Fajr, Dhuhr, Asr, Maghrib, and Isha based on your precise geolocation or manually selected city.
*   **Smart Countdown:** Dynamic countdown timer to the next prayer, with specific handling for Imsak and Iftar during Ramadan.
*   **Qibla Compass:**
    *   **Classic Mode:** A smooth, sensor-driven compass interface.
    *   **AR Mode:** An Augmented Reality view using your camera to visualize the Qibla direction in the real world.
*   **Ramadan Mode:** Automatically detects the holy month to display Imsak times and Iftar Duas.
*   **The Holy Quran:** Full reading experience with Uthmani script, audio recitation (verse-by-verse or continuous), and interactive Tafseer (interpretation).
*   **Adhkar & Dua:** A curated library of morning, evening, and post-prayer Adhkar, plus a "Hadith of the Day".
*   **Worship Tracker:**
    *   **Tasbih Counter:** Digital counter with session history.
    *   **Prayer Tracker:** Log your daily prayers.
    *   **Fasting Tracker:** Track fasted days with visual indicators for Sunnah fasting days (Mondays/Thursdays/White Days).
*   **Localization:** Full support for **Arabic (RTL)** and **English (LTR)**.
*   **Theming:** Toggle between Light and Dark modes.
*   **Offline Support:** Fully functional offline capabilities via Service Workers (PWA).

## 🛠️ Tech Stack

*   **Framework:** [React 19](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** CSS Modules / CSS Variables for theming.
*   **Animations:** [Framer Motion](https://www.framer.com/motion/) for smooth UI transitions.
*   **APIs:**
    *   [Aladhan API](https://aladhan.com/prayer-times-api) (Prayer Times & Calendar).
    *   [Al Quran Cloud](https://alquran.cloud/api) (Quran text & Metadata).
    *   [BigDataCloud](https://www.bigdatacloud.com/) (Reverse Geocoding).

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
*   **Node.js** (v18.0.0 or higher)
*   **npm** (usually comes with Node.js) or **yarn**

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/mawakit-app.git
    cd mawakit-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open your browser and navigate to `http://localhost:5173` to see the app in action.

4.  **Build for production:**
    ```bash
    npm run build
    ```

## 📂 Project Structure

A brief overview of the project's core structure:

```text
src/
├── components/        # Reusable UI components
│   ├── adhkar/        # Adhkar & Hadith cards
│   ├── common/        # Buttons, Loaders, Prompts
│   ├── fasting/       # Fasting calendar tracker
│   ├── layout/        # Header, Floating Action Button
│   ├── quran/         # Quran reader & Tafseer modals
│   ├── settings/      # Settings modal & inputs
│   ├── tasbih/        # Digital Tasbih logic
│   └── QiblaCompass.tsx
├── context/           # Global State (PrayerContext, LocaleContext, ThemeContext)
├── hooks/             # Custom Hooks (usePrayerTimes, useQibla, etc.)
├── utils/             # Helper functions (API calls, Date formatting, Calculations)
├── constants/         # Static data (Adhkar text, Hadiths, Config)
├── locales/           # Translation JSON files (ar.json, en.json)
├── App.tsx            # Main Application Entry
└── main.tsx           # React DOM Rendering
```

## ⚙️ How It Works

1.  **Location Detection:** On first load, the app requests Geolocation permissions. Coordinates are sent to the reverse geocoding API to determine the city name for display, while the raw coordinates are used to fetch accurate prayer times.
2.  **Data Fetching:** The `usePrayerTimes` hook fetches scheduling data for the entire month to minimize API calls. This data is cached in `localStorage` and managed via a Service Worker for offline access.
3.  **State Management:**
    *   `PrayerContext`: Manages user settings (calculation methods, selected muezzin, audio volume) and location data.
    *   `LocaleContext`: Handles dynamic switching between Arabic and English.
    *   `ThemeContext`: Manages CSS variable switching for Dark/Light modes.
4.  **Audio System:** A singleton `AudioManager` class handles the playback of Adhan and Quran recitations to ensure only one audio source plays at a time.

## 🗺️ Roadmap

*   [ ] **Push Notifications:** Native browser notifications for prayer times.
*   [ ] **Widget Support:** Home screen widgets for mobile.
*   [ ] **Customizable Themes:** Allow users to pick custom accent colors.
*   [ ] **Integration:** Sync fasting days with Google Calendar.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgements

*   **Aladhan.com** for their comprehensive Prayer Times API.
*   **Islamic Network** for the Quran Cloud API.
*   **Archive.org** for hosting high-quality audio files.
*   The open-source React community.

---
*Developed with ❤️ for the Ummah.*
