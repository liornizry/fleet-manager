# מערכת ניהול צי רכבים (Fleet Manager)

מערכת מקיפה לניהול צי רכבים עם תמיכה ב-Firebase Firestore לשמירת נתונים בענן.

## תכונות

- 🚗 ניהול רכבים (הוספה, עריכה, מחיקה)
- 📅 מערכת הזמנות מתקדמת עם תצוגת Gantt
- 👥 ניהול משתמשים והרשאות
- 🔄 סנכרון אוטומטי בזמן אמת עם Firebase
- 📊 דשבורד ניהולי עם סטטיסטיקות
- 🎨 ממשק משתמש מודרני ונעים

## התקנה

1. שכפל את הפרויקט:
\`\`\`bash
git clone https://github.com/liornizry/fleet-manager.git
cd fleet-manager
\`\`\`

2. התקן תלויות:
\`\`\`bash
npm install
\`\`\`

## הגדרת Firebase

### שלב 1: יצירת פרויקט Firebase

1. היכנס ל-[Firebase Console](https://console.firebase.google.com/)
2. לחץ על "Add project" / "הוסף פרויקט"
3. תן שם לפרויקט (למשל: "fleet-manager")
4. בחר אם להפעיל Google Analytics (אופציונלי)
5. לחץ על "Create project"

### שלב 2: הוספת אפליקציית Web

1. בדף הבית של הפרויקט, לחץ על אייקון "</>" (Web)
2. תן שם לאפליקציה (למשל: "Fleet Manager App")
3. **אל תסמן** "Set up Firebase Hosting" (לא נדרש כרגע)
4. לחץ "Register app"
5. **העתק את פרטי ההגדרה** שמופיעים

### שלב 3: יצירת Firestore Database

1. בתפריט הצד, לחץ על "Firestore Database"
2. לחץ על "Create database"
3. בחר מיקום (מומלץ: `europe-west1` לישראל)
4. בחר "Start in **test mode**" (למטרות פיתוח)
   - **שים לב:** במצב זה הנתונים נגישים לכולם! שנה את הכללים לאחר הפיתוח
5. לחץ "Enable"

### שלב 4: עדכון הקונפיגורציה בקוד

פתח את הקובץ `src/firebase.js` והחלף את הערכים:

\`\`\`javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // מפתח API
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",        // מזהה הפרויקט
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
\`\`\`

**איפה למצוא את הפרטים?**
- Firebase Console > Project Settings (גלגל השיניים) > "Your apps"
- תחת "SDK setup and configuration" בחר "Config"

### שלב 5: אתחול נתונים ראשוניים (אופציונלי)

כדי להעתיק את הנתונים הדמו ל-Firestore, הרץ את האפליקציה פעם אחת:

\`\`\`bash
npm run dev
\`\`\`

הנתונים ייווצרו אוטומטית ב-Firestore בפעם הראשונה שתשתמש באפליקציה.

## הרצת הפרויקט

### מצב פיתוח
\`\`\`bash
npm run dev
\`\`\`
פתח את הדפדפן ב-`http://localhost:5173`

### בניית הפרויקט לייצור
\`\`\`bash
npm run build
\`\`\`

### תצוגה מקדימה של הבנייה
\`\`\`bash
npm run preview
\`\`\`

## מבנה הפרויקט

\`\`\`
fleet-manager/
├── src/
│   ├── firebase.js          # הגדרות Firebase
│   ├── useFirestore.js      # Hooks לניהול Firestore
│   ├── App.jsx              # קומפוננטה ראשית
│   └── ...
├── package.json
└── README.md
\`\`\`

## טכנולוגיות

- **React 19** - ספריית UI
- **Vite** - כלי בנייה מהיר
- **Firebase Firestore** - מסד נתונים בענן
- **Tailwind CSS** - עיצוב
- **Lucide React** - אייקונים

## Security Rules (חשוב!)

כשתהיה מוכן לייצור, עדכן את ה-Security Rules ב-Firestore:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // דוגמה: רק משתמשים מחוברים יכולים לקרוא/לכתוב
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

## תמיכה

לשאלות ובעיות, פתח Issue ב-[GitHub](https://github.com/liornizry/fleet-manager/issues)

## רישיון

MIT
