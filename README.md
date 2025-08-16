# 📰 Documentation de déploiement – Lorem News

Cette documentation décrit en détail les étapes nécessaires pour déployer **Lorem News** en **local** et en **production**, ainsi que le fonctionnement de l’intégration continue et du déploiement continu (**CI/CD**) via **GitHub Actions**.

---

## 1. Déploiement en local (mode développement)

### 1.1 Prérequis
Avant de démarrer, assurez-vous d’avoir installé :
- **Docker** et **Docker Compose**
- **Git**

Vous devez également configurer les fichiers d’environnement :

- `./.env`  
  Contient les variables globales (DB, pgAdmin, secrets).  

- `./frontend/.env.local`  
  Exemple :  
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:8080
  NEXTAUTH_URL=http://localhost
  AUTH_SECRET=...
  ```

- `./backend/.env`  
  Contient la configuration de la base de données, Redis, CORS et la clé JWT :  
  ```env
  DATABASE_URL=...
  REDIS_URL=...
  JWT_PASSPHRASE=...
  CORS_ALLOW_ORIGIN=...
  ```

---

### 1.2 Lancement
Pour démarrer l’environnement local avec hot-reload (frontend + backend), exécutez :  
```bash
docker compose -f docker-compose.dev.yml up -d --build
```

---

### 1.3 Services accessibles
Une fois les conteneurs démarrés :
- **Frontend (Next.js)** : [http://localhost](http://localhost)  
- **API Symfony (via Nginx)** : [http://localhost:8080](http://localhost:8080)  
- **pgAdmin** : [http://localhost:89](http://localhost:89)  
- **PostgreSQL** : port `5432`  

---

### 1.4 Vérification et logs
```bash
docker compose ps
docker compose logs -f nginx
docker compose logs -f frontend
docker compose logs -f php
```

---

### 1.5 Mise à jour du projet
Pour récupérer les dernières modifications et reconstruire :  
```bash
git pull
docker compose -f docker-compose.dev.yml up -d --build
```

---

## 2. Déploiement en production

### 2.1 Prérequis
- Un **serveur VPS** ou dédié avec **Docker** et **Git** installés.  
- Les mêmes fichiers `.env` configurés que pour le développement, mais adaptés à la production (secrets, URLs publiques, CORS…).  

---

### 2.2 Lancement
Sur le serveur :  
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

### 2.3 Services accessibles
- **Frontend** : http://`IP_SERVEUR`  
- **API Symfony** : http://`IP_SERVEUR`:8080  
- **pgAdmin** : http://`IP_SERVEUR`:89  

---

### 2.4 Vérification
```bash
docker compose ps
docker compose logs -f nginx
```

---

## 3. Intégration Continue & Déploiement Continu (CI/CD)

Le projet utilise **GitHub Actions** pour automatiser :  
- **Les tests** (unitaires, intégration, end-to-end).  
- **L’analyse de code** (PHPStan, SonarCloud, ESLint).  
- **Le build des images Docker**.  
- **Le déploiement automatique en production**.  

---

### 3.1 Workflows GitHub Actions

#### 🔹 Déploiement (`deploy.yml`)
- Déclenché sur **push sur `main`**.  
- Étapes :  
  1. Connexion au serveur via SSH.  
  2. Récupération des dernières images Docker.  
  3. Redémarrage avec :  
     ```bash
     docker compose pull
     docker compose up -d --build
     ```

---

#### 🔹 Frontend (Next.js)
- **`frontend-develop.yml`**  
  - Déclenché sur **push sur `develop`**.  
  - Exécute lint + tests unitaires (Vitest) + build.  

- **`frontend-main.yml`**  
  - Déclenché sur **push sur `main`**.  
  - Exécute lint + tests unitaires + build.  
  - Construit et publie l’image Docker sur DockerHub/GHCR.  

---

#### 🔹 Backend (Symfony + API Platform)
- **`backend-develop.yml`**  
  - Déclenché sur **push sur `develop`**.  
  - Exécute lint + tests PHPUnit + analyse PHPStan + vérifie les migrations DB.  

- **`backend-main.yml`**  
  - Déclenché sur **push sur `main`**.  
  - Exécute lint + tests + analyse qualité (SonarCloud).  
  - Construit et publie l’image Docker sur DockerHub/GHCR.  

---

### 3.2 Cycle complet CI/CD
1. **Push sur `develop`** → tests et builds (frontend & backend).  
2. **Pull Request vers `main`** → CI complète (lint + tests + SonarCloud).  
3. **Merge sur `main`** → build des images Docker + publication + déploiement auto.  

---

## 4. Schéma du workflow CI/CD

```mermaid
flowchart TD
    A[Push sur develop] --> B[CI : lint + tests + build]
    B --> C[Pull Request vers main]
    C --> D[CI complète : lint + tests + SonarCloud]
    D --> E[Merge sur main]
    E --> F[Build images Docker]
    F --> G[Push vers DockerHub/GHCR]
    G --> H[Déploiement auto via deploy.yml]
    H --> I[Serveur prod mis à jour]
```

---

## 5. Bonnes pratiques de maintenance

- Vérifier régulièrement les logs :  
  ```bash
  docker compose logs -f
  ```
- Mettre à jour les dépendances via GitHub Actions (tests automatiques garantissent la stabilité).  
- Surveiller la qualité du code avec **SonarCloud**.  
- Toujours passer par des **PR vers `main`** pour déclencher le pipeline complet.  

---

## 6. Résumé

- **Local** → `docker-compose.dev.yml` (hot-reload, debug).  
- **Production** → `docker-compose.prod.yml` (images optimisées).  
- **CI/CD** → GitHub Actions pour la qualité, les tests, le build et le déploiement.  
- **Automatisation** → déploiement auto après merge sur `main`.  

✅ Cette documentation couvre l’ensemble du cycle de vie : du développement local au déploiement automatisé en production.
