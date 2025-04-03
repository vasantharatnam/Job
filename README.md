# 📱 Job Search App (React Native with Expo & SQLite)

This is a mobile application built using React Native and Expo, allowing users to explore and bookmark jobs for offline viewing using SQLite.

---

## 🚀 Getting Started

Follow the steps below to install and run the project on your local machine and Android device.

### ✅ Prerequisites

- Node.js & npm installed
- [Expo CLI](https://docs.expo.dev/get-started/installation/) installed
- [Expo Go App](https://expo.dev/client) installed on your Android phone
- Android phone and laptop connected to the **same Wi-Fi network**

---

## 📦 Installation

1. **Download and extract the project**

   - Download the `.zip` file of the project
   - Extract the folder to a desired location

2. **Open the project in VS Code**

   ```bash
   cd Job_search
   ```

3. **Install dependencies (including SQLite)**

   ```bash
   npx expo install expo-sqlite
   ```

---

## 📱 Running the App

1. **Start the Expo development server**

   ```bash
   npx expo start
   ```

2. **Scan the QR code**

   - Open the **Expo Go** app on your Android device
   - Use the app to scan the QR code displayed in your terminal or browser

3. 🎉 The Job Search app will open on your phone!

---

## 🧠 Notes

- Bookmarked jobs are saved using **SQLite** and can be accessed offline via the **Bookmarks** tab.
- Ensure **your phone and laptop are on the same Wi-Fi network** for proper connection.

---

## 💡 Tech Stack

- React Native (with Expo)
- Expo SQLite
- Expo Router

---

## 📂 Project Structure

```
Job_search/
├── app/
│   └── tabs/
│       ├── jobs.tsx
│       ├── bookmarks.tsx
│       ├── index.tsx
│       └── layout.tsx
├── database/
│   └── database.ts
├── package.json
└── README.md
```

---

## 📬 Support

If you face any issues, feel free to raise a question or bug!
