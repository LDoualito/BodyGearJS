    # BodyGear - Dashboard de Suivi d'Activité

Bienvenue sur **BodyGear**, votre tableau de bord personnel pour suivre vos entraînements, vos progrès et atteindre vos objectifs.

**Lien en ligne du projet :**
https://ldoual.fr/

**Auteur :**
- DOUAL Lucas

## Fonctionnalités
- **Authentification Sécurisée** : Inscription et connexion via Supabase.
- **Gestion des Entraînements** : Ajoutez, modifiez et supprimez vos séances. Filtrez l'historique par activité.
- **Profil** : Renseignez votre poids pour un calcul précis des calories brûlées.
- **Tableau de Bord** :
  - Historique complet des séances.
  - Graphiques de répartition des activités (Chart.js).
  - Suivi des objectifs hebdomadaires avec alertes visuelles.
- **Objectifs** : Définissez vos cibles (Calories ou Nombre de séances) et suivez votre progression en temps réel.

## Installation

1.  **Prérequis** : Node.js installé.
2.  **Cloner le projet** :
    ```bash
    git clone <votre-url-git>
    cd fitness-dashboard
    ```
3.  **Installer les dépendances** :
    ```bash
    npm install
    ```
4.  **Configuration Supabase** :
    - Créez un projet sur [Supabase](https://supabase.com).
    - Copiez le contenu de `schema.sql` dans l'éditeur SQL de Supabase pour créer les tables.
    - Créez un fichier `.env` à la racine et ajoutez vos clés :
      ```env
      VITE_SUPABASE_URL=votre_url
      VITE_SUPABASE_ANON_KEY=votre_clé_anon
      ```
5.  **Lancer l'application** :
    ```bash
    npm run dev
    ```

## Choix Techniques
- **Web Components (Vanilla JS)** : Utilisation de `HTMLElement` pour une architecture modulaire et performante sans framework lourd.
- **Supabase** : Backend-as-a-Service pour l'authentification et la base de données PostgreSQL temps réel.
- **Chart.js** : Pour la visualisation des données.
- **Style** : CSS personnalisé avec une esthétique "Old School" Noir & Blanc (BodyGear).

## Structure
- `/src`
  - `/components` : Web Components réutilisables (`auth-form`, `workout-list`, `chart-component`, etc.)
  - `/services` : Logique métier et appels API (`auth-service`, `workout-service`, etc.)
  - `style.css` : Styles globaux et variables CSS.
