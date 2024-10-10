// Создание сцены, камеры и рендера
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Освещение
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5).normalize();
scene.add(light);

// Персонаж
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.z = -5;
scene.add(player);

// Пол (дорожка)
const floorGeometry = new THREE.PlaneGeometry(10, 200);
const floorMaterial = new THREE.MeshStandardMaterial({color: 0x228B22});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.z = -100;
scene.add(floor);

// Переменные для логики игры
let obstacles = [];
let speed = 0.1;
let obstacleTimer = 0;
const obstacleInterval = 100;

// Функция для создания препятствий
function createObstacle() {
    const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
    const obstacleMaterial = new THREE.MeshStandardMaterial({color: 0x000000});
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.set(Math.random() * 4 - 2, 0.5, -200); // Рандомное смещение по оси X
    obstacles.push(obstacle);
    scene.add(obstacle);
}

// Управление
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') {
        player.position.x -= 0.5;
    }
    if (e.code === 'ArrowRight') {
        player.position.x += 0.5;
    }
});

// Основной игровой цикл
function animate() {
    requestAnimationFrame(animate);

    // Движение игрока вперед
    player.position.z -= speed;

    // Создание препятствий через определенные интервалы времени
    obstacleTimer++;
    if (obstacleTimer % obstacleInterval === 0) {
        createObstacle();
    }

    // Движение и удаление препятствий
    obstacles.forEach((obstacle, index) => {
        obstacle.position.z += speed;

        // Проверка на столкновение
        if (
            player.position.x < obstacle.position.x + 0.5 &&
            player.position.x + 0.5 > obstacle.position.x &&
            player.position.z < obstacle.position.z + 0.5 &&
            player.position.z + 0.5 > obstacle.position.z
        ) {
            alert("Game Over!");
            obstacles = [];
            player.position.z = -5;
        }

        // Удаление препятствий за пределами видимости
        if (obstacle.position.z > camera.position.z) {
            scene.remove(obstacle);
            obstacles.splice(index, 1);
        }
    });

    // Камера следует за игроком
    camera.position.set(player.position.x, player.position.y + 2, player.position.z + 5);
    camera.lookAt(player.position);

    renderer.render(scene, camera);
}

// Запуск игры
animate();

// Обновление размера при изменении окна
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});