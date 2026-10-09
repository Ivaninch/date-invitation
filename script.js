document.addEventListener('DOMContentLoaded', () => {
    // --- Screen Elements ---
    const screens = [
        document.getElementById('screen-1'),
        document.getElementById('screen-2'),
        document.getElementById('screen-3'),
        document.getElementById('screen-4'),
        document.getElementById('screen-5')
    ];

    // --- Data Storage ---
    let selectedDate = '';
    let selectedTime = '';
    let selectedFood = '';

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

    // Set minimum date to today
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    if (btnNext3) {
        btnNext3.addEventListener('click', () => {
            if (dateInput.value && timeInput.value) {
                selectedDate = dateInput.value;
                selectedTime = timeInput.value;
                errorMsg.classList.add('hidden');
                showScreen(3); // Go to Screen 4
            } else {
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

            // Transition to Screen 5 after a tiny delay
            setTimeout(() => {
                finishAndShowScreen5();
            }, 300);
        });
    });

    // --- Screen 5 Logic (Final) ---
    function finishAndShowScreen5() {
        // Format date (e.g. 2023-10-25 to 25.10.2023)
        const dateParts = selectedDate.split('-');
        const formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

        document.getElementById('final-date').textContent = formattedDate;
        document.getElementById('final-time').textContent = selectedTime;
        document.getElementById('final-food').textContent = selectedFood;

        showScreen(4); // Go to Screen 5
        startEmojiAnimation();
    }

    function startEmojiAnimation() {
        const container = document.getElementById('emoji-container');
        container.classList.remove('hidden');

        const emojis = ['💙', '✨', '💖', '🥰', '🍕', '🍱', '🍔'];

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