# HomeWatch v1.1.5

Application de gestion de films et séries, propulsée par TMDB et Firebase.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Firebase** (Authentication + Firestore)
- **TMDB API** pour les données films/séries
- **Tailwind CSS** + **shadcn/ui** + **Framer Motion**

---

## Installation

```bash
npm install
```

## Configuration

### 1. Variables d'environnement

Copiez `.env.example` en `.env` et remplissez les valeurs :

```bash
cp .env.example .env
```

### 2. TMDB API Key

1. Créez un compte sur [themoviedb.org](https://www.themoviedb.org)
2. Allez dans **Paramètres > API**
3. Copiez votre clé API (v3) dans `VITE_TMDB_API_KEY`

### 3. Firebase

1. Créez un projet sur [console.firebase.google.com](https://console.firebase.google.com)
2. Ajoutez une **application Web**
3. Copiez la configuration dans votre `.env`

#### Activer l'authentification

Dans la console Firebase : **Authentication > Sign-in method**
- Activez **Email/Mot de passe**
- Activez **Google**

#### Créer la base de données Firestore

Dans la console Firebase : **Firestore Database > Créer une base de données**

Puis ajoutez ces règles de sécurité (**Firestore > Règles**) :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/gallery/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Lancement

```bash
npm run dev
```

## Structure Firestore

```
users/
  {userId}/
    gallery/
      movie-{tmdbId}   → { id, title, posterPath, year, type, overview, addedAt }
      tv-{tmdbId}      → { id, title, posterPath, year, type, overview, addedAt }
```
