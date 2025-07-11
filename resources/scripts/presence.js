// resources/scripts/presence.js

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURACIÓN ---
    // Pega aquí tu ID de usuario de Discord.
    const DISCORD_ID = '1307155802674565170';
    // -------------------

    const presenceCard = document.querySelector('.presence-card');
    const userNameEl = document.getElementById('presence_user_name'); // Añadido
    const statusEl = document.getElementById('presence_status');
    const detailsEl = document.getElementById('presence_details');
    const appIconEl = document.getElementById('presence_app_icon');
    const presenceAvatarEl = document.getElementById('presence_avatar'); // Añadido
    const statusIcon = document.querySelector('.status-icon');

    const lanyardUrl = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;

    function updatePresence() {
        fetch(lanyardUrl)
            .then(response => response.json())
            .then(data => {
                if (!data.success || !data.data) {
                    showOfflineStatus("Error al cargar");
                    return;
                }

                const userData = data.data;

                // Actualizar nombre de usuario
                userNameEl.textContent = userData.discord_user.global_name || userData.discord_user.username;

                // Actualizar avatar de perfil de Discord
                if (userData.discord_user.avatar) {
                    presenceAvatarEl.src = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${userData.discord_user.avatar}.png?size=128`;
                } else {
                    presenceAvatarEl.src = 'resources/main/star.webp'; // Fallback si no hay avatar de Discord
                }

                // Si está offline
                if (userData.discord_status === 'offline') {
                    showOfflineStatus();
                    return;
                }

                // Si está online
                presenceCard.classList.remove('offline');
                statusIcon.style.backgroundColor = '#23a559'; // Verde online

                // Si está escuchando Spotify
                if (userData.listening_to_spotify) {
                    const spotifyData = userData.spotify;
                    statusEl.textContent = "Spotify";
                    detailsEl.innerHTML = `Escuchando <strong>${spotifyData.song}</strong> de <strong>${spotifyData.artist}</strong>`;
                    appIconEl.src = spotifyData.album_art_url;
                    return;
                }

                // Si no hay actividades
                if (userData.activities.length === 0) {
                    statusEl.textContent = "En línea";
                    detailsEl.textContent = "Sin actividad específica";
                    appIconEl.src = 'resources/icons/discord.svg'; // Un ícono genérico de Discord
                    return;
                }

                // Si hay actividades (Juegos, VSCode, etc.)
                const mainActivity = userData.activities.find(activity => activity.type === 0) || userData.activities[0];

                statusEl.textContent = mainActivity.name;
                detailsEl.textContent = mainActivity.details || mainActivity.state || "Sin detalles";

                // Construir la URL del ícono de la actividad
                if (mainActivity.assets && mainActivity.assets.large_image) {
                    const appId = mainActivity.application_id;
                    const assetId = mainActivity.assets.large_image;
                    appIconEl.src = `https://cdn.discordapp.com/app-assets/${appId}/${assetId}.png`;
                } else {
                    appIconEl.src = 'resources/icons/discord.svg'; // Ícono por defecto
                }
            })
            .catch(error => {
                console.error("Error fetching Lanyard data:", error);
                showOfflineStatus("Desconectado");
            });
    }

    function showOfflineStatus(message = "Desconectado") {
        presenceCard.classList.add('offline');
        statusIcon.style.backgroundColor = '#80848e'; // Gris offline
        userNameEl.textContent = '! Yuuruii'; // Cambia el nombre también a "Usuario Desconectado"
        statusEl.textContent = message;
        detailsEl.textContent = "No se pudo obtener el estado";
        presenceAvatarEl.src = userData.discord_user.avatar; // Volver al avatar por defecto si está offline
        appIconEl.src = 'resources/icons/discord.svg'; // Ícono genérico
    }

    // Actualizar cada 10 segundos
    setInterval(updatePresence, 5000);
    // Carga inicial
    updatePresence();
});