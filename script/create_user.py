import requests
import time
import random
import string

# Configuration
API_URL = "http://localhost:8080/api/users"
NUM_USERS = 10  # Nombre d'utilisateurs à créer
ROLES = []
HEADERS = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    # "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}

def random_string(length=8):
    """Génère une chaîne aléatoire."""
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def create_user(index):
    username = f"user{index}"
    email = f"{username}@example.com"
    password = "azerty123"
    
    if ROLES:
        payload = {
            "username": username,
            "email": email,
            "roles": ROLES,
            "password": password
        }
    else:
        payload = {
            "username": username,
            "email": email,
            "password": password
        }

    try:
        response = requests.post(API_URL, json=payload, headers=HEADERS)
        if response.status_code in [200, 201]:
            print(f"[{index}] Utilisateur créé : {username}")
            return "OK"
        else:
            print(f"[{index}] Échec ({response.status_code}): {response.text}")
            return "ERREUR"
    except requests.exceptions.RequestException as e:
        print(f"[{index}] Erreur de connexion : {e}")
        return "ERREUR"

def main():
    for i in range(1, NUM_USERS + 1):
        if create_user(i) == "ERREUR":
            return
        time.sleep(0.5)  # Pause entre les requêtes pour éviter de surcharger l'API
        print("***user créer***")

if __name__ == "__main__":
    main()
