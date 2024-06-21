document.addEventListener('DOMContentLoaded', () => {
    const scoreElement = document.getElementById('score');
    const clickableImage = document.getElementById('clickable-image');
    const energyLevel = document.getElementById('energy-level');

    let score = parseFloat(localStorage.getItem('userScore')) || 0;
    let clickPower = parseInt(localStorage.getItem('clickLevel')) || 1;
    let maxEnergy = 100 + (parseInt(localStorage.getItem('capacityLevel')) || 1) * 50;
    let currentEnergy = parseInt(localStorage.getItem('userEnergy')) || maxEnergy;
    let energyRefillRate = 1 + (parseInt(localStorage.getItem('speedLevel')) || 1) * 0.8;
    let demonLevel = parseInt(localStorage.getItem('demonLevel')) || 1;

    function updateDisplay() {
        scoreElement.textContent = score.toFixed(1);
        energyLevel.style.width = `${(currentEnergy / maxEnergy) * 100}%`;
    }

    function click() {
        if (currentEnergy >= 10) {
            score += clickPower;
            currentEnergy -= 10;
            localStorage.setItem('userScore', score);
            localStorage.setItem('userEnergy', currentEnergy);
            updateDisplay();
        }
    }

    function refillEnergy() {
        if (currentEnergy < maxEnergy) {
            currentEnergy = Math.min(maxEnergy, currentEnergy + energyRefillRate);
            localStorage.setItem('userEnergy', currentEnergy);
            energyLevel.innerHTML=currentEnergy

            updateDisplay();
        }
    }

    function demonIncome() {
        score += 0.1 * demonLevel;
        localStorage.setItem('userScore', score);
        updateDisplay();
    }

    clickableImage.addEventListener('click', click);

    setInterval(refillEnergy, 1000);
    setInterval(demonIncome, 1000);

    updateDisplay();

    // Calculate offline progress
    const lastOnline = parseInt(localStorage.getItem('lastOnline')) || Date.now();
    const offlineTime = (Date.now() - lastOnline) / 1000; // in seconds
    const offlineIncome = (0.1 * demonLevel * offlineTime);
    const offlineEnergy = Math.min(maxEnergy, currentEnergy + energyRefillRate * offlineTime);

    score += offlineIncome;
    currentEnergy = offlineEnergy;
    localStorage.setItem('userScore', score);
    localStorage.setItem('userEnergy', currentEnergy);

    alert(`در زمان آفلاین شما ${offlineIncome.toFixed(1)} سکه دریافت کردید!`);

    // Update last online time
    setInterval(() => {
        localStorage.setItem('lastOnline', Date.now());
    }, 10000);
    function calculateUserLevel() {
    const demonLevel = parseInt(localStorage.getItem('demonLevel')) || 1;
    const clickLevel = parseInt(localStorage.getItem('clickLevel')) || 1;
    const capacityLevel = parseInt(localStorage.getItem('capacityLevel')) || 1;
    const speedLevel = parseInt(localStorage.getItem('speedLevel')) || 1;

    const totalLevels = demonLevel + clickLevel + capacityLevel + speedLevel;
    const userLevel = Math.floor(totalLevels / 10);

    const icons = ['🍌mozy','⚔️', '🔥', '👑', '🏰', '🍑', '🎭', '🗿', '🐊', '🐉', '🧬', '💢','👙'];
    let userIcon = '';

    for (let i = 0; i < userLevel && i < icons.length; i++) {
        userIcon = icons[i];
    }

    localStorage.setItem('userLevel', userLevel);
    localStorage.setItem('userIcon', userIcon);

    // به‌روزرسانی نمایش در صفحه
    const levelElement = document.getElementById('level');
    if (levelElement) {
        levelElement.textContent = `${userLevel} ${userIcon}`;
    }
}    
            
calculateUserLevel();
});

