
let urlApi = "http://localhost:5678/api";

// Executer le code JS après que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login').addEventListener('submit', function(event) {
    event.preventDefault(); // Pour éviter que le formulaire ne se soumette

     // Récupérer les valeurs du formulaire
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

     // Construire le corps de la requête
    const requestBody = {
        email: email,
         password: password
    };

    // Envoyer la requête POST à l'API
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        // Une fois la réponse reçue, vérifier si le token est présent
        if (data.token) {
            // Stocker le token dans le localStorage
            localStorage.setItem('token', data.token);
            // Rediriger vers la page d'accueil ou effectuer d'autres actions
            window.location.href = 'index.html';

        } else {
            // Gérer les cas d'erreur ou d'authentification incorrecte
            console.log('Erreur de connexion');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    });
});