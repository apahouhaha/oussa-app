# 🚀 OUSSA APP - V1 BASE

## Version: V1-BASE
- ✅ Login (User/Commerçant)
- ✅ Navigation 5 onglets
- ✅ Profil utilisateur
- ⏳ À venir: Posts, Filtres, Gestion commerçant

---

## 🚀 DÉMARRER EN 3 MIN

### 1. Clone le repo
```bash
git clone https://github.com/USERNAME/oussa-app.git
cd oussa-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Supabase (optionnel pour MVP)
```bash
cp .env.local.example .env.local
# Remplis VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
```

### 4. Lancer l'app
```bash
npm run dev
```

### 5. Tester sur téléphone
**Option A - Même WiFi:**
```
http://192.168.X.X:5173
```

**Option B - Ngrok (partout):**
```bash
ngrok http 5173
# Ouvre l'URL ngrok sur téléphone
```

---

## 🧪 Tester
- **Email:** test@example.com
- **Password:** test
- **Roles:** Utilisateur ou Commerçant

---

## 📋 Workflow Pro

```
1. Teste sur téléphone
2. Dis à Claude ce qui fonctionne/ne fonctionne pas
3. Claude crée V2 avec les fixes
4. git push
5. Vercel redeploy auto
6. Testes V2
7. Répète...
```

---

## 🔄 Deploy sur Vercel

### 1. Push sur GitHub
```bash
git add .
git commit -m "v1-base: initial setup"
git push origin main
```

### 2. Sur https://vercel.com
- Import GitHub repo
- Add environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Deploy!

### 3. Tester
```
https://oussa-app.vercel.app
```

---

## 📁 Structure

```
oussa-app/
├── src/
│   ├── App.tsx         ← App principale
│   ├── main.tsx
│   ├── index.css
│   └── lib/
│       └── supabase.ts ← Config Supabase
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── .env.local.example
```

---

## 🔧 Commandes

```bash
npm run dev      # Dev local
npm run build    # Build pour prod
npm run preview  # Preview build local
```

---

## ⚠️ Notes
- App en développement
- Login mockée (pas de vrai auth pour V1)
- Design responsive
- Testée sur mobile

---

Besoin d'aide? Dis à Claude quoi corriger!
