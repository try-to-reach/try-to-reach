let energy = 100;
let score = 0;
const maxEnergy = 100;
const energyRecoveryRate = 0.2; // انرژی بازیابی در هر ثانیه
const recoveryInterval = 1000; // 1 ثانیه

document.addEventListener('DOMContentLoaded', (event) => {
    const energyLevel = document.getElementById('energy-level');
    const scoreDisplay = document.getElementById('score');
    const clickableImage = document.getElementById('clickable-image');

    // بارگذاری داده‌های کاربر از localStorage
    function loadUserData() {
        const data = JSON.parse(localStorage.getItem('userData'));
        if (data) {
            energy = data.energy;
            score = data.score;
            const currentTime = new Date().getTime();
            const elapsedTime = (currentTime - data.lastActiveTime) / 1000; // تبدیل میلی‌ثانیه به ثانیه
            energy = Math.min(maxEnergy, energy + elapsedTime * energyRecoveryRate);
        }
        updateEnergyBar();
        updateScore();
    }

    // ذخیره‌سازی داده‌های کاربر در localStorage
    function saveUserData() {
        const data = {
            energy: energy,
            score: score,
            lastActiveTime: new Date().getTime()
        };
        localStorage.setItem('userData', JSON.stringify(data));
    }

    function updateEnergyBar() {
        energyLevel.style.width = `${(energy / maxEnergy) * 100}%`;
    }

    function updateScore() {
        scoreDisplay.textContent = ` ${score}`;
    }

    clickableImage.addEventListener('click', () => {
        if (energy > 0) {
            energy = Math.max(0, energy - 1); // جلوگیری از منفی شدن انرژی
            score += 5;
            updateEnergyBar();
            updateScore();
             if (score > 10) {
    alert("بیا پیوی یچیزی بهت بگم");}
            saveUserData();
        
    });

    function recoverEnergy() {
        if (energy < maxEnergy) {
            energy = Math.min(maxEnergy, energy + energyRecoveryRate);
            updateEnergyBar();
            saveUserData(); // ذخیره‌سازی انرژی به روز شده
        }
    }

    setInterval(recoverEnergy, recoveryInterval);

    // ذخیره‌سازی داده‌های کاربر هنگام ترک صفحه
    window.addEventListener('beforeunload', saveUserData);

    // بارگذاری داده‌های کاربر هنگام بارگذاری صفحه
    loadUserData();
});
