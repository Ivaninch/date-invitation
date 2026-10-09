document.addEventListener('DOMContentLoaded', () => {
    // --- Screen Elements ---
    const screens = [
        document.getElementById('screen-1'),
        document.getElementById('screen-2'),
        document.getElementById('screen-3'),
        document.getElementById('screen-4'),
        document.getElementById('screen-location'),
        document.getElementById('screen-5')
    ];

    // --- Data Storage ---
    let selectedDate = '';
    let selectedTime = '';
    let selectedFood = '';
    let selectedLocation = '';
    let isMeetingPoint = false;

    // --- Helper function for screen transition ---
    function showScreen(index) {
        // Hide all screens
        screens.forEach((screen, i) => {
            if (screen) {
                if (i === index) {
                    screen.classList.remove('hidden');
                    // Small delay to allow display:block to apply before animating opacity/scale
                    setTimeout(() => {
                        screen.classList.remove('opacity-0', 'scale-95');
                        screen.classList.add('opacity-100', 'scale-100', 'active');
                    }, 50);
                } else {
                    screen.classList.remove('opacity-100', 'scale-100', 'active');
                    screen.classList.add('opacity-0', 'scale-95');
                    // Wait for transition to finish before hiding
                    setTimeout(() => {
                        if (!screen.classList.contains('active')) {
                            screen.classList.add('hidden');
                        }
                    }, 500); // matches duration-500
                }
            }
        });
    }

    // --- Screen 1 Logic (Dodging Button) ---
    const btnNo = document.getElementById('btn-no');
    const btnYes1 = document.getElementById('btn-yes-1');

    if (btnNo) {
        // When mouse enters the No button, move it to a random position
        btnNo.addEventListener('mouseenter', () => {
            // Get viewport dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Get button dimensions
            const btnRect = btnNo.getBoundingClientRect();

            // Calculate max available space so it doesn't go off screen
            const maxX = viewportWidth - btnRect.width;
            const maxY = viewportHeight - btnRect.height;

            // Generate random position
            const randomX = Math.floor(Math.random() * maxX);
            const randomY = Math.floor(Math.random() * maxY);

            // Apply new position fixed to viewport
            btnNo.style.position = 'fixed';
            btnNo.style.left = randomX + 'px';
            btnNo.style.top = randomY + 'px';
            btnNo.style.transform = 'none'; // Remove translation
            btnNo.style.margin = '0'; // Remove margin
        });

        // Touch devices: tap to move
        btnNo.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent click
            // Trigger mouseenter logic
            const event = new Event('mouseenter');
            btnNo.dispatchEvent(event);
        });
    }

    if (btnYes1) {
        btnYes1.addEventListener('click', () => {
            showScreen(1); // Go to Screen 2
        });
    }

    // --- Screen 2 Logic ---
    const btnYes2 = document.getElementById('btn-yes-2');
    if (btnYes2) {
        btnYes2.addEventListener('click', () => {
            showScreen(2); // Go to Screen 3
        });
    }

    // --- Screen 3 Logic (Date/Time) ---
    const btnNext3 = document.getElementById('btn-next-3');
    const dateInput = document.getElementById('date-input');
    const timeInput = document.getElementById('time-input');
    const errorMsg = document.getElementById('datetime-error');

    // Set minimum date
    if (dateInput) {
        dateInput.setAttribute('min', '2026-10-12');
    }

    if (btnNext3) {
        btnNext3.addEventListener('click', () => {
            if (dateInput.value && timeInput.value) {
                if (dateInput.value < '2026-10-12' || timeInput.value < '18:30') {
                    errorMsg.textContent = 'Пожалуйста, выбери дату не раньше 12.10.2026 и время не раньше 18:30!';
                    errorMsg.classList.remove('hidden');
                } else {
                    selectedDate = dateInput.value;
                    selectedTime = timeInput.value;
                    errorMsg.classList.add('hidden');
                    showScreen(3); // Go to Screen 4
                }
            } else {
                errorMsg.textContent = 'Пожалуйста, выбери дату и время!';
                errorMsg.classList.remove('hidden');
            }
        });
    }

    // --- Screen 4 Logic (Food Selection) ---
    const foodCards = document.querySelectorAll('.food-card');
    foodCards.forEach(card => {
        card.addEventListener('click', () => {
            selectedFood = card.getAttribute('data-food');

            // Update UI to show selection (optional before transition)
            foodCards.forEach(c => c.classList.remove('border-blue-500', 'bg-blue-100'));
            card.classList.add('border-blue-500', 'bg-blue-100');

            // Transition to Location Screen after a tiny delay
            setTimeout(() => {
                showScreen(4); // Go to Location Screen
            }, 300);
        });
    });

    // --- Screen Location Logic ---
    const locationToggle = document.getElementById('location-toggle');
    const locationTitle = document.getElementById('location-title');
    const locationInput = document.getElementById('location-input');
    const btnNextLocation = document.getElementById('btn-next-location');

    if (locationToggle && locationTitle && locationInput) {
        locationToggle.addEventListener('change', (e) => {
            isMeetingPoint = e.target.checked;
            if (isMeetingPoint) {
                locationTitle.textContent = 'Где встретимся? 📍';
                locationInput.placeholder = 'Введи место встречи...';
            } else {
                locationTitle.textContent = 'Куда за тобой заехать? 🚗';
                locationInput.placeholder = 'Введи адрес или ориентир...';
            }
        });
    }

    if (locationInput && btnNextLocation) {
        locationInput.addEventListener('input', (e) => {
            if (e.target.value.trim() !== '') {
                btnNextLocation.removeAttribute('disabled');
                btnNextLocation.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                btnNextLocation.setAttribute('disabled', 'true');
                btnNextLocation.classList.add('opacity-50', 'cursor-not-allowed');
            }
        });

        async function sendToTelegram() {
            const locationType = isMeetingPoint ? 'Место встречи' : 'Заехать за ней';
            const text = `🎉 Ответ на приглашение!\n\n📅 Дата: ${selectedDate}\n⏰ Время: ${selectedTime}\n🍕 Планы: ${selectedFood}\n📍 Локация: ${selectedLocation}\n(Тип локации: ${locationType})`;

            try {
                await fetch('https://api.telegram.org/bot8857367796:AAGkrw1-j7VlMQTSDdvji45K-3ilzrZCNpk/sendMessage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id: '820307875',
                        text: text
                    })
                });
            } catch (error) {
                console.error('Ошибка отправки в Telegram:', error);
            }
        }

        btnNextLocation.addEventListener('click', async () => {
            selectedLocation = locationInput.value.trim();

            const originalText = btnNextLocation.textContent;
            btnNextLocation.textContent = 'Сохраняем...';
            btnNextLocation.setAttribute('disabled', 'true');
            btnNextLocation.classList.add('opacity-50', 'cursor-not-allowed');

            await sendToTelegram();

            finishAndShowScreen5();
        });
    }

    // --- Screen 5 Logic (Final) ---
    function finishAndShowScreen5() {
        // Format date (e.g. 2023-10-25 to 25.10.2023)
        const dateParts = selectedDate.split('-');
        const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

        document.getElementById('final-date').textContent = formattedDate;
        document.getElementById('final-time').textContent = selectedTime;
        document.getElementById('final-food').textContent = selectedFood;

        const locationStatus = document.getElementById('final-location-status');
        if (isMeetingPoint) {
            locationStatus.textContent = `Место встречи: ${selectedLocation}`;
        } else {
            locationStatus.textContent = `Заеду за тобой: ${selectedLocation}`;
        }

        showScreen(5); // Go to Screen 5 (index 5)
        startEmojiAnimation();
    }

    function startEmojiAnimation() {
        const container = document.getElementById('emoji-container');
        container.classList.remove('hidden');

        const emojis = ['💙', '✨', '💖', '🥰', '🍕', '🍱', '🍔', '🚶‍♀️', '🌳', '🎡', '🎢'];

        // Create an emoji every 300ms
        setInterval(() => {
            const emojiEl = document.createElement('div');
            emojiEl.classList.add('emoji');

            // Random emoji
            emojiEl.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            // Random horizontal position
            emojiEl.style.left = Math.random() * 100 + 'vw';

            // Random size variation
            const size = 1.5 + Math.random() * 1.5;
            emojiEl.style.fontSize = size + 'rem';

            // Random animation duration
            const duration = 4 + Math.random() * 3;
            emojiEl.style.animationDuration = duration + 's';

            container.appendChild(emojiEl);

            // Remove after animation finishes
            setTimeout(() => {
                emojiEl.remove();
            }, duration * 1000);

        }, 300);
    }
});