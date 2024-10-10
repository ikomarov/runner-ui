//	1.	Персонаж: Персонаж прыгает по нажатию на пробел. Добавлен гравитационный эффект для симуляции падения, а также проверка на столкновение с землей.
// 	2.	Препятствия: Каждые 90 кадров добавляется новое препятствие. Они движутся слева направо. Если они выходят за границу экрана, то удаляются из массива.
// 	3.	Столкновения: Если персонаж сталкивается с препятствием, выводится сообщение “Game Over!” и игра сбрасывается.
// 	4.	Главный игровой цикл: Выполняет обновление состояния игры и перерисовывает всё на экране каждую итерацию.

// Можно улучшить
//  •   Изменение скорости и сложности с течением времени.
// 	•	Добавление счётчика очков.
// 	•	Улучшение графики и анимации персонажа.
// 	•	Добавление сбора монет или бонусов.

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Параметры персонажа
const player = {
    x: 50,
    y: 300,
    width: 50,
    height: 50,
    color: "red",
    dy: 0,
    gravity: 0.5,
    jumpStrength: -10,
    onGround: true
};

// Препятствия
const obstacles = [];
const obstacleWidth = 20;
const obstacleHeight = 40;
let obstacleTimer = 0;
const obstacleInterval = 90; // Каждые 90 кадров добавляется препятствие

// Управление
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && player.onGround) {
        player.dy = player.jumpStrength;
        player.onGround = false;
    }
});

// Функция обновления состояния игры
function update() {
    // Обновление состояния персонажа
    player.dy += player.gravity;
    player.y += player.dy;

    // Проверка на касание земли
    if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.onGround = true;
    }

    // Генерация препятствий
    if (obstacleTimer === 0) {
        const obstacleX = canvas.width;
        const obstacleY = canvas.height - obstacleHeight;
        obstacles.push({ x: obstacleX, y: obstacleY, width: obstacleWidth, height: obstacleHeight });
    }
    obstacleTimer = (obstacleTimer + 1) % obstacleInterval;

    // Движение препятствий и проверка на столкновения
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= 5;

        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            alert("Game Over!");
            obstacles.splice(0, obstacles.length); // Очистка массива препятствий
            player.y = 300;
            player.dy = 0;
            return;
        }

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
        }
    });
}

// Функция отрисовки игры
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовка персонажа
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Отрисовка препятствий
    obstacles.forEach((obstacle) => {
        ctx.fillStyle = "black";
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Главный игровой цикл
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Запуск игры
gameLoop();