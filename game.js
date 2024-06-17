document.addEventListener('DOMContentLoaded', (event) => {
    const energyLevel = document.getElementById('energy-level');
    const scoreDisplay = document.getElementById('score');
    const clickableImage = document.getElementById('clickable-image');
    
    let energy = 100;
    const maxEnergy = 100;
    const energyRecoveryRate = 0.2; // انرژی بازیابی در هر ثانیه
    const recoveryInterval = 1000; // 1 ثانیه
    const maxScorePerMinute = 20000; // حداکثر امتیاز در هر دقیقه

    // تعریف متغیرهای خصوصی و تابع‌های دسترسی درون IIFE
    const scoreManager = (function() {
        let _score = 0;
        let scoreLog = []; // آرایه‌ای برای ذخیره زمان و امتیازهای ثبت شده

        function checkScoreRate() {
            const currentTime = new Date().getTime();
            // حذف امتیازاتی که بیش از یک دقیقه از زمان آن‌ها گذشته است
            scoreLog = scoreLog.filter(log => currentTime - log.time <= 60000);
            // محاسبه مجموع امتیازهای کسب شده در یک دقیقه اخیر
            const totalScoreLastMinute = scoreLog.reduce((total, log) => total + log.score, 0);
            return totalScoreLastMinute <= maxScorePerMinute;
        }

        return {
            addScore: function(points) {
                scoreLog.push({ time: new Date().getTime(), score: points });
                if (!checkScoreRate()) {
                    alert('بیش از حد مجاز امتیاز کسب کردید. امتیاز شما صفر شد.');
                    _score = 0;
                    scoreLog = []; // ریست کردن آرایه امتیازات
                } else {
                    _score += points;
                }
                this.updateScore();
                saveUserData(); // ذخیره‌سازی داده‌های کاربر
            },
            getScore: function() {
                return _score;
            },
            updateScore: function() {
                scoreDisplay.textContent = ` ${_score}`;
            },
            loadScore: function(score) {
                _score = score;
                this.updateScore();
            }
        };
    })();

    // بارگذاری داده‌های کاربر از localStorage
    function loadUserData() {
        const data = JSON.parse(localStorage.getItem('userData'));
        if (data) {
            energy = data.energy;
            scoreManager.loadScore(data.score);
            const currentTime = new Date().getTime();
            const elapsedTime = (currentTime - data.lastActiveTime) / 1000; // تبدیل میلی‌ثانیه به ثانیه
            energy = Math.min(maxEnergy, energy + elapsedTime * energyRecoveryRate);
        }
        updateEnergyBar();
    }

    // ذخیره‌سازی داده‌های کاربر در localStorage
    function saveUserData() {
        const data = {
            energy: energy,
            score: scoreManager.getScore(),
            lastActiveTime: new Date().getTime()
        };
        localStorage.setItem('userData', JSON.stringify(data));
    }

    function updateEnergyBar() {
        energyLevel.style.width = `${(energy / maxEnergy) * 100}%`;
    }

    clickableImage.addEventListener('click', () => {
        if (energy > 0) {
            energy = Math.max(0, energy - 1); // جلوگیری از منفی شدن انرژی
            scoreManager.addScore(5); // اضافه کردن امتیاز به جای افزایش مستقیم
            updateEnergyBar();
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
