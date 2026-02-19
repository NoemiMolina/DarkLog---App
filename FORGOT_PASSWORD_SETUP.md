# Fonctionnalité "Mot de Passe Oublié" - Guide de Configuration

## 📋 Résumé de l'implémentation

J'ai ajouté une fonctionnalité complète de réinitialisation de mot de passe à votre application. Voici ce qui a été fait :

## 🔧 Backend

### 1. **Modèle User** (`backend/src/models/User.ts`)
Ajout de deux nouveaux champs :
- `PasswordResetToken`: Stocke le token de réinitialisation hashé
- `PasswordResetExpires`: Date d'expiration du token (1 heure)

### 2. **Service Email** (`backend/src/services/emailService.ts`)
Nouveau service qui :
- Envoie des emails de réinitialisation avec un lien sécurisé
- Utilise Nodemailer pour l'envoi (configurable avec Gmail ou autre service)
- HTML template professionnel

### 3. **Contrôleur Utilisateur** (`backend/src/controllers/userController.ts`)
Trois nouvelles fonctions :

#### `forgotPassword`
- Recherche l'utilisateur par email
- Génère un token de réinitialisation aléatoire
- L'enregistre hashé en base de données
- Envoie un email avec le lien de réinitialisation
- Message de sécurité générique (ne révèle pas si l'email existe)

#### `resetPassword`
- Valide le token et sa date d'expiration
- Hash le nouveau mot de passe avec bcrypt
- Met à jour la base de données
- Nettoie le token et l'expiration

#### `verifyResetToken`
- Vérifie que le token est valide (pour le frontend)
- Retourne un booléen `valid`

### 4. **Routes** (`backend/src/routes/users.ts`)
Trois nouvelles routes POST/GET :
```
POST   /users/forgot-password          - Demander réinitialisation
POST   /users/reset-password/:token    - Réinitialiser le mot de passe
GET    /users/verify-reset-token/:token - Vérifier le token
```

## 🎨 Frontend

### 1. **Page Forgot Password** (`frontend/src/features/pages/ForgotPasswordPage.tsx`)
- Formulaire pour entrer l'email
- Messages de succès/erreur
- Validation email
- Redirection vers login après envoi

### 2. **Page Reset Password** (`frontend/src/features/pages/ResetPasswordPage.tsx`)
- Vérification du token au chargement
- Validation du mot de passe sécurisé (8+ chars, majuscule, chiffre, symbole)
- Confirmation du mot de passe
- Checklist visuelle des critères
- Gestion de l'expiration du lien

### 3. **Lien dans le formulaire de login** 
Ajout d'un lien "Forgot password?" sous le formulaire de connexion

### 4. **Routes** (`frontend/src/App.tsx`)
Deux nouvelles routes :
```
/forgot-password              - Page de demande
/reset-password/:token        - Page de réinitialisation
```

## ⚙️ Configuration Requise

### Variables d'environnement Backend

Créez/mettez à jour votre `.env` dans le dossier `backend/` :

```env
# Email Configuration
EMAIL_SERVICE=gmail          # ou votre service (outlook, yahoo, etc.)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password  # Pour Gmail : use App Password, not password

# Frontend URL (pour générer le lien de réinitialisation)
FRONTEND_URL=http://localhost:5173  # Développement
FRONTEND_URL=https://yourdomain.com # Production
```

### Configuration Gmail (Recommandé)

1. Allez sur [Google Account Security](https://myaccount.google.com/security)
2. Activez "Authentification à 2 facteurs"
3. Génération d'un "App Password" (16 caractères)
4. Utilisez ce mot de passe dans `EMAIL_PASSWORD`

### Installation des dépendances

```bash
cd backend
npm install nodemailer @types/nodemailer
```

## 🚀 Utilisation

### Flow utilisateur:

1. **Page de connexion** → Clic sur "Forgot password?"
2. **Page Forgot Password** → Entrer l'email → Clic "Envoyer le lien"
3. **Email reçu** → Clic sur le lien dans l'email
4. **Page Reset Password** → Entrer nouveau mot de passe (respecter critères)
5. **Confirmation** → Redirection vers login → Se connecter avec nouveau mot de passe

## 🔒 Sécurité

✅ **Tokens sécurisés** : Générés aléatoirement, hashés en base de données
✅ **Expiration** : Les tokens expirent après 1 heure
✅ **Password hashing** : Utilise bcrypt (10 salts)
✅ **Validation** : Mot de passe sécurisé obligatoire (8+ chars, complexité)
✅ **HTTPS** : À utiliser en production
✅ **Message générique** : Ne révèle pas si un email existe

## 📧 Personnalisation de l'email

Pour modifier le template email, éditez le fichier `backend/src/services/emailService.ts` dans la fonction `sendPasswordResetEmail`.

Vous pouvez :
- Changer le sujet
- Modifier le HTML/CSS
- Ajouter un logo
- Personnaliser le message

## 🐛 Dépannage

### L'email n'est pas envoyé
- Vérifiez les variables d'environnement
- Vérifiez la configuration Gmail (App Password)
- Regardez les logs du backend (console.error)
- Vérifiez le spam/dossier promotion

### Le lien n'est pas valide
- Assurez-vous que `FRONTEND_URL` est correct
- Vérifiez que le token n'a pas expiré (1h max)
- Vérifiez que la base de données est à jour

### Mot de passe non validé
- Doit avoir ≥ 8 caractères
- Doit avoir une majuscule (A-Z)
- Doit avoir un chiffre (0-9)
- Doit avoir un symbole spécial (!@#$%^&*)

## 📁 Fichiers modifiés/créés

### Créés :
- `backend/src/services/emailService.ts`
- `frontend/src/features/pages/ForgotPasswordPage.tsx`
- `frontend/src/features/pages/ResetPasswordPage.tsx`

### Modifiés :
- `backend/src/models/User.ts` (+ 2 champs)
- `backend/src/controllers/userController.ts` (+ 3 fonctions)
- `backend/src/routes/users.ts` (+ 3 routes + imports)
- `frontend/src/components/HeaderComponents/LogInForm.tsx` (+ lien forgotten password)
- `frontend/src/App.tsx` (+ 2 routes lazy loaded)
- `backend/package.json` (+ nodemailer)

## ✅ Prochaines étapes

1. **Installer les dépendances** : `npm install` dans `backend/`
2. **Configurer les variables d'environnement** avec vos paramètres email
3. **Tester en développement** avec un email de test
4. **Déployer** en production avec votre domaine

C'est complet et prêt à l'emploi ! N'hésitez pas si vous avez des questions. 🚀
