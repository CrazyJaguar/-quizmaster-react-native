# 🧠 QuizMaster — React Native Quiz App

A multi-screen mobile quiz app built with **React Native + Expo** as part of the Dibtech Nepal React Native Intern selection task.

---

## 🚀 Live Preview

> 📱 Try the app instantly — no installation needed!

**Expo Go Link:** `[YOUR EXPO GO LINK HERE]`

Open the link on your phone with the **Expo Go** app installed, or scan the QR code from the Expo dashboard.

---

## ✨ Features

- 🏠 **Home Screen** — App title, Start Quiz button, and last score retrieved from local storage
- ❓ **Quiz Screen** — 5 general knowledge questions with 4 multiple-choice options each
- 📊 **Progress Bar** — Visual indicator showing how far through the quiz you are
- ✅ **Answer Feedback** — Correct answers highlight green, wrong answers highlight red
- 🔀 **Shuffled Questions** — Question order and options are randomized every quiz run
- 🏆 **Result Screen** — Final score with a performance message based on your result
- 💾 **Persistent Score** — Last score saved locally using AsyncStorage and shown on Home Screen
- 🔄 **Restart Anytime** — Restart the quiz from the Result screen

---

## 📁 Project Structure

```
QuizMaster/
├── App.js                  # Navigation setup (Stack Navigator)
├── screens/
│   ├── HomeScreen.js       # Home screen with last score
│   ├── QuizScreen.js
    ├── ReviewScreen.js       # Quiz logic, progress bar, answer handling
│   └── ResultScreen.js     # Score display and AsyncStorage save
├── data/
│   └── questions.js        # Local JSON question bank
└── utils/
    ├── ThemeContext.js
    └── shuffle.js          # Fisher-Yates shuffle utility
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React Native | Mobile app framework |
| Expo | Development and build tooling |
| React Navigation (Stack) | Screen navigation |
| React Hooks (useState, useEffect) | State management |
| AsyncStorage | Persistent local storage |
| StyleSheet (pure RN) | UI styling — no third-party UI libraries |

---

## 📦 Installation & Running Locally

### Prerequisites
- Node.js installed
- Expo CLI installed globally
- Expo Go app on your phone **or** an Android/iOS emulator

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/quizmaster-react-native.git
cd quizmaster-react-native

# 2. Install dependencies
npm install

# 3. Install Expo and navigation packages
npx expo install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context react-native-gesture-handler @react-native-async-storage/async-storage  @react-navigation/bottom-tabs react-native-svg

# 4. Start the development server
npx expo start
```

Then:
- **Phone** → Scan the QR code with the Expo Go app
- **Android Emulator** → Press `a`
- **iOS Simulator** → Press `i`

---

## 📋 Evaluation Criteria Covered

- [x] Multi-screen app with React Navigation
- [x] State management across components using hooks
- [x] Scoring logic and question progression
- [x] Clean, modular, and well-commented code
- [x] UI/UX with consistent color theme and responsive layout
- [x] **Bonus:** Progress bar
- [x] **Bonus:** Shuffled questions and options
- [x] **Bonus:** AsyncStorage for previous results

---

## 👤 Author

**Sushant Raj Mishra**
Portfolio: [sushantrm.com.np](https://sushantrm.com.np)
