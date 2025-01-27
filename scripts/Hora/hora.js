import { CONFIG } from '../config.js'; // Certifique-se de ter configurado este arquivo corretamente.

function atualizarRelogio() {
    const clockDate = document.getElementById("date");
    const clockTime = document.getElementById("time");

    const agora = new Date();

    // Formatando a data
    const dia = String(agora.getDate()).padStart(2, "0");
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const ano = agora.getFullYear();

    // Obtendo horas, minutos e segundos
    const horas = String(agora.getHours()).padStart(2, "0");
    const minutos = String(agora.getMinutes()).padStart(2, "0");
    const segundos = String(agora.getSeconds()).padStart(2, "0");

    // Atualizando a data e hora
    clockDate.textContent = `${dia}/${mes}/${ano}`;
    clockTime.textContent = `${horas}:${minutos}:${segundos}`;
}

// Função para obter localização e buscar a cidade via API
async function obterCidade() {
    const clockLocation = document.getElementById("location");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                // Fazendo a chamada para a API OpenWeatherMap
                const response = await fetch(
                    `${CONFIG.API_URL}?lat=${latitude}&lon=${longitude}&appid=${CONFIG.API_KEY}&lang=pt_br`
                );

                if (response.ok) {
                    const data = await response.json();
                    const cidade = data.city?.name || "Local desconhecido";
                    clockLocation.textContent = cidade;
                } else {
                    clockLocation.textContent = "Erro ao buscar cidade";
                }
            } catch (error) {
                clockLocation.textContent = "Erro de conexão";
                console.error("Erro ao buscar cidade:", error);
            }
        }, 
        (error) => {
            console.error("Erro na geolocalização:", error);
            clockLocation.textContent = "Localização desativada";
        });
    } else {
        clockLocation.textContent = "Geolocalização não suportada";
    }
}

// Atualiza o relógio e obtém a localização
setInterval(atualizarRelogio, 1000);
atualizarRelogio();
obterCidade();
