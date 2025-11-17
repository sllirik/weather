const heroBg = document.querySelector('.hero__bg');

// Проверяем, поддерживается ли гироскоп
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation);
}

function handleOrientation(event) {
    const { beta, gamma } = event; // beta - наклон вперёд/назад, gamma - влево/вправо

    // Ограничиваем диапазон для плавности
    const x = Math.min(Math.max(gamma, -30), 30);
    const y = Math.min(Math.max(beta, -30), 30);

    // Вычисляем смещение
    const moveX = x / 2; 
    const moveY = y / 2;

    heroBg.style.transform =
    `translate(${moveX}px, ${moveY}px) scale(1.1)`; // scale для "глубины"
}

// === 🖱 Параллакс через мышь (ПК) ===
// document.addEventListener('mousemove', (e) => {
//     const { innerWidth, innerHeight } = window;
//     const x = (e.clientX / innerWidth - 0.5) * 20; // чувствительность по X
//     const y = (e.clientY / innerHeight - 0.5) * 20; // чувствительность по Y

//     heroBg.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
// });

// === 🚫 Сброс при выходе курсора за экран ===
// document.addEventListener('mouseleave', () => {
//     heroBg.style.transform = 'translate(0, 0) scale(1.0)';
// });