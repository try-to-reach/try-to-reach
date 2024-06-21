document.addEventListener('DOMContentLoaded', () => {
    const balanceElement = document.getElementById('balance');
    const turboCountElement = document.getElementById('turbo-count');
    const fullEnergyCountElement = document.getElementById('full-energy-count');
    const clickLevelElement = document.getElementById('click-level');
    const capacityLevelElement = document.getElementById('capacity-level');
    const speedLevelElement = document.getElementById('speed-level');
    const demonLevelElement = document.getElementById('demon-level');

    let score = parseFloat(localStorage.getItem('userScore')) || 0;
    let turboUses = parseInt(localStorage.getItem('turboUses')) || 3;
    let fullEnergyUses = parseInt(localStorage.getItem('fullEnergyUses')) || 3;
    let clickLevel = parseInt(localStorage.getItem('clickLevel')) || 1;
    let clickPrice = parseInt(localStorage.getItem('clickPrice')) || 100;
    let capacityLevel = parseInt(localStorage.getItem('capacityLevel')) || 1;
    let capacityPrice = parseInt(localStorage.getItem('capacityPrice')) || 100;
    let speedLevel = parseInt(localStorage.getItem('speedLevel')) || 1;
    let speedPrice = parseInt(localStorage.getItem('speedPrice')) || 100;
    let demonLevel = parseInt(localStorage.getItem('demonLevel')) || 1;
    let demonPrice = parseInt(localStorage.getItem('demonPrice')) || 1000;

    function updateDisplay() {
        balanceElement.textContent = score.toFixed(1);
        turboCountElement.textContent = `${turboUses}/به زودی !!!!`;
        fullEnergyCountElement.textContent = `${fullEnergyUses}/به زودی !!!!`;
        clickLevelElement.textContent = `سطح ${clickLevel}`;
        capacityLevelElement.textContent = `سطح ${capacityLevel}`;
        speedLevelElement.textContent = `سطح ${speedLevel}`;
        demonLevelElement.textContent = `سطح ${demonLevel}`;
    }

    function buyUpgrade(type) {
        let price, level;
        switch(type) {
            case 'click':
                price = clickPrice;
                level = clickLevel;
                break;
            case 'capacity':
                price = capacityPrice;
                level = capacityLevel;
                break;
            case 'speed':
                price = speedPrice;
                level = speedLevel;
                break;
            case 'demon':
                price = demonPrice;
                level = demonLevel;
                break;
        }

        if (score >= price) {
            score -= price;
            level++;
            price *=2;

            localStorage.setItem('userScore', score);
            localStorage.setItem(`${type}Level`, level);
            localStorage.setItem(`${type}Price`, price);

            if (type === 'click') {
                clickLevel = level;
                clickPrice = price;
            } else if (type === 'capacity') {
                capacityLevel = level;
                capacityPrice = price;
            } else if (type === 'speed') {
                speedLevel = level;
                speedPrice = price;
            } else if (type === 'demon') {
                demonLevel = level;
                demonPrice = price*1.4;
            }

            updateDisplay();
        } else {
            alert('سکه کافی ندارید!');
        }
    }

    document.querySelectorAll('.upgrade').forEach(button => {
        button.addEventListener('click', () => {
            buyUpgrade(button.dataset.type);
        });
    });

    updateDisplay();
});

