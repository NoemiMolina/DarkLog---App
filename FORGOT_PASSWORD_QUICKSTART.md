# 🔐 Implémentation - "Mot de Passe Oublié" - Guide Rapide

## ✅ Ce qui a été fait

J'ai implémenté une **fonctionnalité complète de réinitialisation de mot de passe** avec :

### Backend
- ✅ Service d'email (Nodemailer)
- ✅ Génération de tokens sécurisés avec expiration (1h)
- ✅ Endpoints pour demander et réinitialiser le mot de passe
- ✅ Validation et hashing du mot de passe
- ✅ Mise à jour en base de données

### Frontend  
- ✅ Page "Forgot Password" (demande email)
- ✅ Page "Reset Password" (réinitialisation sécurisée)
- ✅ Lien "Forgot password?" dans le formulaire de login
- ✅ Validation visuelle du mot de passe sécurisé
- ✅ Gestion des tokens expirés

## 🚀 4 Étapes pour démarrer

### 1️⃣ Installer les dépendances
```bash
cd backend
npm install
```

### 2️⃣ Configurer les variables d'environnement
Éditez `backend/.env` (créez-le s'il n'existe pas) :

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

**⚠️ IMPORTANT pour Gmail :**
1. Allez sur https://myaccount.google.com/security
2. Activez "Authentification à 2 facteurs"
3. Créez un "App Password" (16 caractères)
4. Utilisez ce mot de passe dans `EMAIL_PASSWORD`

### 3️⃣ Redémarrer le serveur backend
```bash
npm run dev  # ou npm start
```

### 4️⃣ Tester le flux
1. Allez sur la page de login
2. Cliquez sur "Forgot password?"
3. Entrez votre email de test
4. Allez voir votre email (vérifiez aussi le spam!)
5. Cliquez sur le lien du mail
6. Entrez un nouveau mot de passe sécurisé

## 📋 Détails techniques

### 🔗 Routes créées
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/users/forgot-password` | Demander réinitialisation |
| POST | `/users/reset-password/:token` | Réinitialiser le password |
| GET | `/users/verify-reset-token/:token` | Vérifier validité du token |

### 🔒 Critères de mot de passe sécurisé
- ✓ Minimum 8 caractères
- ✓ Au moins une majuscule (A-Z)
- ✓ Au moins un chiffre (0-9)
- ✓ Au moins un symbole spécial (!@#$%^&*)

### 📊 Fichiers créés/modifiés
**Créés (3 fichiers):**
- `backend/src/services/emailService.ts`
- `frontend/src/features/pages/ForgotPasswordPage.tsx`
- `frontend/src/features/pages/ResetPasswordPage.tsx`

**Modifiés (5 fichiers):**
- `backend/src/models/User.ts` (+ 2 champs)
- `backend/src/controllers/userController.ts` (+ 3 fonctions)
- `backend/src/routes/users.ts` (+ 3 routes)
- `frontend/src/components/HeaderComponents/LogInForm.tsx` (+ lien)
- `frontend/src/App.tsx` (+ 2 routes)

**Documentation:**
- `FORGOT_PASSWORD_SETUP.md` (guide complet)
- `backend/.env.example` (template d'env)

## 🐛 Dépannage rapide

### ❌ L'email n'arrive pas
- Vérifiez variables d'environnement
- Vérifiez le dossier spam/promotion
- Activez "App Password" pour Gmail
- Regardez les logs du backend

### ❌ Le lien n'est pas valide
- Vérifiez `FRONTEND_URL` dans `.env`
- Le lien expire après 1 heure
- Vérifiez la base de données

### ❌ Mot de passe rejeté
- Doit faire ≥ 8 caractères
- Doit avoir une MAJUSCULE
- Doit avoir un chiffre (0-9)
- Doit avoir un symbole (!@#$%^&*)

## 📧 Personnaliser l'email

Le template d'email est dans `backend/src/services/emailService.ts`. Vous pouvez:
- Changer le sujet
- Modifier le design HTML
- Ajouter votre logo
- Adapter le message

## 🔒 Sécurité

✅ Tokens hashés en BD  
✅ Expiration automatique (1h)  
✅ Bcrypt pour les mots de passe  
✅ HTTPS recommandé en production  
✅ Pas d'énumération d'emails  

## ❓ Questions ?

Consultez la documentation complète dans `FORGOT_PASSWORD_SETUP.md`

C'est prêt à l'emploi ! 🚀
