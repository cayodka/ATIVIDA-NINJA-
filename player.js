const music = new Audio("/assets/audio/bgm.mp3");
const morte = new Audio("/assets/audio/morte.mp3");

let healthPlayer1 = 100;
let healthPlayer2 = 100;
let numeroAtual = 0;
let partidaIniciada = false;
let intervalo;

const aleatoriedade = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const escolherJogador = () => Math.random() < 0.5 ? 1 : 2;

const atualizaVida = (player, health) => {
    const barra = document.getElementById(player === 1 ? "vida1" : "vida2");
    if (barra) barra.style.width = `${health}%`;
};

const aplicarDanoComNumero = () => {
    if (!partidaIniciada) return;

    const dano = numeroAtual;
    const jogadorEscolhido = escolherJogador();

    if (jogadorEscolhido === 1) {
        healthPlayer1 = Math.max(0, healthPlayer1 - dano);
        atualizaVida(1, healthPlayer1);
        animarJogador("p1");
        tocarSom(1);
    } else {
        healthPlayer2 = Math.max(0, healthPlayer2 - dano);
        atualizaVida(2, healthPlayer2);
        animarJogador("p2");
        tocarSom(2);
    }
    
    verificarVitoria();
};

const animarJogador = (playerId) => {
    const player = document.getElementById(playerId);
    if (player) {
        player.classList.add("shakeAndRotate");
        setTimeout(() => {
            player.classList.remove("shakeAndRotate");
        }, 500);
    }
};

const verificarVitoria = () => {
    if (healthPlayer1 === 0 || healthPlayer2 === 0) {
        partidaIniciada = false;
        clearInterval(intervalo);
        morte.play();

        setTimeout(() => {
            let vencedor = healthPlayer1 === 0 ? "Jogador 2 venceu!" : "Jogador 1 venceu!";
            alert(vencedor);
            reiniciarPartida();
        }, 1000);
    }
};

const reiniciarPartida = () => {
    healthPlayer1 = 100;
    healthPlayer2 = 100;
    atualizaVida(1, healthPlayer1);
    atualizaVida(2, healthPlayer2);

    document.getElementById("inputdado").value = "";
    clearInterval(intervalo);
    partidaIniciada = false;
};

const tocarSom = (jogador) => {
    let som = new Audio(jogador === 1 ? "/assets/audio/red.mp3" : "/assets/audio/blue.mp3");
    som.play();
};

document.getElementById("play").addEventListener("click", () => {
    if (partidaIniciada) {
        clearInterval(intervalo);
        partidaIniciada = false;
    } else {
        const inputdado = document.getElementById("inputdado");
        inputdado.style.visibility = "visible";

        partidaIniciada = true;
        intervalo = setInterval(() => {
            numeroAtual = aleatoriedade(5, 20);
            inputdado.value = numeroAtual;
            aplicarDanoComNumero();
        }, 1500);
        
        music.play();
    }
});
