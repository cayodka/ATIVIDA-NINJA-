const music = new Audio("/assets/audio/bgm.mp3");
const somCura = new Audio("/assets/audio/potion.mp3");
const espada = new Audio("/assets/audio/espada1.mp3")
const espada2 = new Audio("assets/audio/espada2.mp3");
const dead = new Audio("assets/audio/dead.mp3");
const win = new Audio("/assets/audio/win.mp3");

let healthPlayer1 = 100;
let healthPlayer2 = 100;
let currentPlayer = null;
let partidaIniciada = false;

const aleatoriedade = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

const atualizaVida = (player, health) => {
    const barra = document.getElementById(player === 1 ? "vida1" : "vida2");
    if (barra) barra.style.width = `${health}%`;
};

const escolherPrimeiroJogador = () => {
    currentPlayer = aleatoriedade(1, 2);
    indicarJogadorAtual();
    if (currentPlayer === 2) setTimeout(decidirAcaoPlayer2, 1000);
};

const indicarJogadorAtual = () => {
    document.getElementById("p1").classList.toggle("ativop1", currentPlayer === 1);
    document.getElementById("p2").classList.toggle("ativop2", currentPlayer === 2);
};

const atualizarDanoNoInput = (dano) => {
    document.getElementById("inputdado").value = `-${dano}`;
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

//===========================================//

document.getElementById("shuriken").addEventListener("click", () => {
    if (currentPlayer === 1) atacar();
});

document.getElementById("cura").addEventListener("click", () => {
    if (currentPlayer === 1) curar();
});

document.getElementById("roubovida").addEventListener("click", () => {
    if (currentPlayer === 1) roubovida();
});


const atacar = () => {
    if (!partidaIniciada || currentPlayer === null) return;

    const dano = aleatoriedade(5, 20);
    atualizarDanoNoInput(dano);
    if (currentPlayer === 1) {
        healthPlayer2 = Math.max(0, healthPlayer2 - dano);
        atualizaVida(2, healthPlayer2);
        animarJogador("p2");
        espada.play();
        tocarSom(2);
    } else {
        healthPlayer1 = Math.max(0, healthPlayer1 - dano);
        atualizaVida(1, healthPlayer1);
        animarJogador("p1");
        espada.play();
        tocarSom(1);
    }
    verificarVitoria();
    setTimeout(alternarJogador, 1000);
};

const curar = () => {
    if (!partidaIniciada || currentPlayer === null) return;

    const cura = 25;
    atualizarDanoNoInput(`+${cura}`);
    if (currentPlayer === 1) {
        healthPlayer1 = Math.min(100, healthPlayer1 + cura);
        atualizaVida(1, healthPlayer1);
    } else {
        healthPlayer2 = Math.min(100, healthPlayer2 + cura);
        atualizaVida(2, healthPlayer2);
    }
    somCura.play();
    setTimeout(alternarJogador, 1000);
};

const roubovida = () => {
    if (!partidaIniciada || currentPlayer === null) return;

    const dano = aleatoriedade(5, 20);
    const cura = 10;
    atualizarDanoNoInput(`${dano}/${cura}`);

    if (currentPlayer === 1) {
        healthPlayer2 = Math.max(0, healthPlayer2 - dano);
        healthPlayer1 = Math.min(100, healthPlayer1 + cura);
        atualizaVida(1, healthPlayer1);
        atualizaVida(2, healthPlayer2);
        animarJogador("p2");
        tocarSom(2);
        espada2.play();
    } else {
        healthPlayer1 = Math.max(0, healthPlayer1 - dano);
        healthPlayer2 = Math.min(100, healthPlayer2 + cura);
        atualizaVida(1, healthPlayer1);
        atualizaVida(2, healthPlayer2);
        animarJogador("p1");
        tocarSom(1);
        espada2.play();
    }

    verificarVitoria();
    setTimeout(alternarJogador, 1000);
};

//===============================================//

const alternarJogador = () => {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    indicarJogadorAtual();
    if (currentPlayer === 2) setTimeout(decidirAcaoPlayer2, 1000);
};

const decidirAcaoPlayer2 = () => {
    if (!partidaIniciada) return;
    const escolha = Math.random();

    if (escolha < 0.33) {
        atacar();
    } else if (escolha < 0.66) {
        curar();
    } else {
        roubovida();
    }
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
        morte.play();

        setTimeout(() => {
            let vencedor = healthPlayer1 === 0 ? "Jogador 2 venceu!" : "Jogador 1 venceu!";

            if (healthPlayer1 === 0) {
                dead.play();
                document.getElementById("gameOverScreen").style.display = "flex";
            } else {
                win.play();
                document.getElementById("gamewinScreen").style.display = "flex"; 
            }
            setTimeout(() => {
                document.getElementById("gameOverScreen").style.display = "none";
                document.getElementById("gamewinScreen").style.display = "none";
                reiniciarPartida();
            }, 6000);
        }, 1000);
    }
};

//========================================================//

const reiniciarPartida = () => {
    healthPlayer1 = 100;
    healthPlayer2 = 100;
    atualizaVida(1, healthPlayer1);
    atualizaVida(2, healthPlayer2);
    partidaIniciada = false;
    currentPlayer = null;
    document.getElementById("p1").classList.remove("ativop1");
    document.getElementById("p2").classList.remove("ativop2");
    document.getElementById("play").style.visibility = "visible";
};

const tocarSom = (jogador) => {
    let som = new Audio(jogador === 1 ? "/assets/audio/red.mp3" : "/assets/audio/blue.mp3");
    som.play();
};

document.getElementById("play").addEventListener("click", () => {
    if (!partidaIniciada) {
        escolherPrimeiroJogador();
        partidaIniciada = true;
        music.play();
        document.getElementById("play").style.visibility = "hidden";
        document.getElementById("inputdado").style.visibility = "visible";
    }
});
