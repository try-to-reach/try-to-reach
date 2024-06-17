let energy = 100;
let score = 0;
const maxEnergy = 100;
const energyRecoveryRate = 0.2; // انرژی بازیابی در هر ثانیه
const recoveryInterval = 1000; // 1 ثانیه
const maxScorePerMinute = 20000; // حداکثر امتیاز در هر دقیقه

document.addEventListener('DOMContentLoaded', (event) => {
    const energyLevel = document.getElementById('energy-level');
    const scoreDisplay = document.getElementById('score');
    const clickableImage = document.getElementById('clickable-image');
    let scoreLog = []; // آرایه‌ای برای ذخیره زمان و امتیازهای ثبت شده

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

    function checkScoreRate() {
        const currentTime = new Date().getTime();
        // حذف امتیازاتی که بیش از یک دقیقه از زمان آن‌ها گذشته است
        scoreLog = scoreLog.filter(log => currentTime - log.time <= 60000);
        // محاسبه مجموع امتیازهای کسب شده در یک دقیقه اخیر
        const totalScoreLastMinute = scoreLog.reduce((total, log) => total + log.score, 0);
        return totalScoreLastMinute <= maxScorePerMinute;
    }

    clickableImage.addEventListener('click', () => {
        if (energy > 0) {
            energy = Math.max(0, energy - 1); // جلوگیری از منفی شدن انرژی
            scoreLog.push({ time: new Date().getTime(), score: 5 });
            score += 5;

            if (!checkScoreRate()) {
                alert('بیش از حد مجاز امتیاز کسب کردید. امتیاز شما صفر شد.');
                score = 0;
                scoreLog = []; // ریست کردن آرایه امتیازات
            }

            updateEnergyBar();
            updateScore();
            
            if (score > 1000000) {
                alert(" @alirezan5555 بیا پیوی یچیزی بهت بگم");
            }
            saveUserData(); // ذخیره‌سازی داده‌های کاربر
        }
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
