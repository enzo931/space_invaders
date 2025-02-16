// script.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const continueScreen = document.getElementById('continueScreen'); // Tela de Continue
const finalScoreDisplay = document.getElementById('finalScore');

canvas.width = 800;
canvas.height = 600;

let score = 0;
let gameOver = false;

// 🌌 Criando fundo animado (estrelas)
const stars = [];
for (let i = 0; i < 100; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    speed: Math.random() * 1.5 + 0.5
  });
}

// 🚀 Configurações do Jogador
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  speed: 6,
  color: "cyan"
};

// 🔫 Configurações do Tiro
const bullets = [];
const bulletSpeed = 7;
let canShoot = true;
const shootCooldown = 500; // 500ms de cooldown entre os tiros

// 👾 Configuração dos Inimigos
const invaders = [];
const invaderRows = 3;
const invaderColumns = 8;
const invaderWidth = 50;
const invaderHeight = 40;
let invaderDirection = 1;
let invaderSpeed = 3;

// 🔹 Criar Invasores
function createInvaders() {
  for (let row = 0; row < invaderRows; row++) {
    for (let col = 0; col < invaderColumns; col++) {
      invaders.push({
        x: col * (invaderWidth + 10) + 50,
        y: row * (invaderHeight + 10) + 50,
        width: invaderWidth,
        height: invaderHeight,
        color: "red"
      });
    }
  }
}

// 🚀 Atualizar fundo animado
function updateBackground() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = 'white';
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
    star.y += star.speed;
    
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });
}

// 🎮 Controles do Jogador (Movimento)
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && player.x > 0) {
    player.x -= player.speed;
  }
  if (event.key === "ArrowRight" && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }
});

// 🔫 Disparar tiros com cooldown
function shoot() {
  if (canShoot) {
    bullets.push({ x: player.x + player.width / 2 - 3, y: player.y, width: 6, height: 15, color: "yellow" });
    canShoot = false;
    setTimeout(() => { canShoot = true; }, shootCooldown);
  }
}

// 🚀 Atualizar os tiros
function updateBullets() {
  bullets.forEach((bullet, index) => {
    bullet.y -= bulletSpeed;

    if (bullet.y < 0) bullets.splice(index, 1);

    invaders.forEach((invader, invIndex) => {
      if (
        bullet.x < invader.x + invader.width &&
        bullet.x + bullet.width > invader.x &&
        bullet.y < invader.y + invader.height &&
        bullet.y + bullet.height > invader.y
      ) {
        bullets.splice(index, 1);
        invaders.splice(invIndex, 1);
        score += 10;
        scoreDisplay.innerText = score;
      }
    });
  });
}

// 🚀 Atualizar os inimigos
function updateInvaders() {
  invaders.forEach(invader => {
    invader.x += invaderDirection * invaderSpeed;
  });

  // Mover os inimigos para baixo e inverter a direção
  if (invaders.some(invader => invader.x + invader.width >= canvas.width || invader.x <= 0)) {
    invaderDirection = -invaderDirection;
    invaders.forEach(invader => invader.y += invaderHeight);
  }

  // Verificar se algum inimigo tocou o jogador
  invaders.forEach(invader => {
    if (
      invader.x < player.x + player.width &&
      invader.x + invader.width > player.x &&
      invader.y < player.y + player.height &&
      invader.y + invader.height > player.y
    ) {
      gameOver = true;
      showGameOverScreen();
    }
  });
}

// 🔄 Desenhar elementos
function draw() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  bullets.forEach(bullet => {
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  invaders.forEach(invader => {
    ctx.fillStyle = invader.color;
    ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
  });
}

// Função para mostrar a tela de "Game Over"
function showGameOverScreen() {
  gameOverScreen.style.display = 'flex';
  finalScore.innerText = score; // Exibe a pontuação final
}

// 🔄 Loop Principal do Jogo
function gameLoop() {
  if (!gameOver) {
    updateBackground();
    updateBullets();
    updateInvaders();
    draw();
    
    // Verifica se todos os inimigos foram eliminados
    if (invaders.length === 0) {
      showContinueScreen();
    }

    requestAnimationFrame(gameLoop);
  }
}

// Função para mostrar a tela de "Você Venceu!"
function showContinueScreen() {
  continueScreen.style.display = 'flex';
  finalScoreDisplay.innerText = score; // Exibe a pontuação final
}

// Função para reiniciar o jogo
function restartGame() {
  score = 0;
  invaders.length = 0; // Limpa os inimigos
  createInvaders(); // Cria os inimigos novamente
  gameOver = false;
  gameOverScreen.style.display = 'none';
  continueScreen.style.display = 'none';
  scoreDisplay.innerText = score;
  gameLoop();
}

// Função para continuar jogando
function continueGame() {
  invaderSpeed += 0.2; // Aumenta a velocidade dos inimigos
  createInvaders(); // Cria novos inimigos
  continueScreen.style.display = 'none'; // Fecha a tela de continuar jogando
}

// Iniciar o jogo
createInvaders();
gameLoop();

// Evento para disparar
document.addEventListener("keydown", (event) => {
  if (event.key === " " && !gameOver) { // Tecla de espaço para atirar
    shoot();
  }
});
