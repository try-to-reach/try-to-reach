// شناسه یکتا برای کاربر
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = generateUserId();
        localStorage.setItem('userId', userId);
    }
    return userId;
}

const userId = getUserId();
const referralLink = `${window.location.origin}?ref=${userId}`;

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function addReferralScore(referrerId) {
    const referrerData = JSON.parse(localStorage.getItem(referrerId));
    if (referrerData) {
        referrerData.score += 10; // امتیازات رفرال
        localStorage.setItem(referrerId, JSON.stringify(referrerData));
    }
}

let energy = 100;
let score = 0;
const maxEnergy = 100;
const energyRecoveryRate = 0.2; // انرژی بازیابی در هر ثانیه
const recoveryInterval = 1000; // 1 ثانیه

document.addEventListener('DOMContentLoaded', (event) => {
    const energyLevel = document.getElementById('energy-level');
    const scoreDisplay = document.getElementById('score');
    const clickableImage = document.getElementById('clickable-image');

    // بررسی لینک رفرال
    const referrerId = getQueryParam('ref');
    if (referrerId) {
        addReferralScore(referrerId);
    }

    // بارگذاری داده‌های کاربر از localStorage
    function loadUserData() {
        const data = JSON.parse(localStorage.getItem(userId));
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
        localStorage.setItem(userId, JSON.stringify(data));
    }

    function updateEnergyBar() {
        energyLevel.style.width = `${(energy / maxEnergy) * 100}%`;
    }

    function updateScore() {
        scoreDisplay.textContent = `${score}`;
    }

    clickableImage.addEventListener('click', () => {
        if (energy > 0) {
            energy = Math.max(0, energy - 1); // جلوگیری از منفی شدن انرژی
            score += 5;
            updateEnergyBar();
            updateScore();
            
            if (score > 1000000) {
                alert("@alirezan5555 بیا پیوی یچیزی بهت بگم");
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

    // نمایش لینک رفرال
    const referralLinkElement = document.createElement('div');
    referralLinkElement.innerHTML = `Referral Link: <a href="${referralLink}">${referralLink}</a>`;
    document.getElementById('app').appendChild(referralLinkElement);
});
