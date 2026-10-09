document.addEventListener('DOMContentLoaded', () => {
    // Screens
    const screen1 = document.getElementById('screen1');
    const screen2 = document.getElementById('screen2');
    const screen3 = document.getElementById('screen3');
    const screen4 = document.getElementById('screen4');
    const screen5 = document.getElementById('screen5');

    // Buttons
    const btnYes1 = document.getElementById('btnYes1');
    const btnYes2 = document.getElementById('btnYes2');
    const btnNext3 = document.getElementById('btnNext3');

    // Helper function to switch screens
    function showScreen(hideScreen, showScreen) {
        hideScreen.classList.remove('active');

        // Wait for opacity transition to finish before actually hiding
        setTimeout(() => {
            hideScreen.classList.add('hidden');
            showScreen.classList.remove('hidden');

            // Small delay to allow display:block to apply before animating opacity
            setTimeout(() => {
                showScreen.classList.add('active');
            }, 50);
        }, 500); // match transition duration
    }

    // --- Evasive "No" Button Logic ---
    const btnNo = document.getElementById('btnNo');

    function moveButton() {
        // Change position absolute relative to the body/viewport
        btnNo.style.position = 'fixed';

        const btnRect = btnNo.getBoundingClientRect();

        // Calculate max x and y ensuring button stays within viewport
        const maxX = window.innerWidth - btnRect.width - 20;
        const maxY = window.innerHeight - btnRect.height - 20;

        // Ensure minimum 20px from edge
        const randomX = Math.max(20, Math.floor(Math.random() * maxX));
        const randomY = Math.max(20, Math.floor(Math.random() * maxY));

        btnNo.style.left = `${randomX}px`;
        btnNo.style.top = `${randomY}px`;
        btnNo.style.right = 'auto'; // clear initial right positioning
        btnNo.style.transform = 'none'; // clear initial translate
    }

    // Trigger on both hover (desktop) and touch (mobile)
    btnNo.addEventListener('mouseover', moveButton);
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault(); // prevent click
        moveButton();
    });

    // --- Data Capture Logic ---
    let selectedDate = '';
    let selectedTime = '';
    let selectedFood = '';

    const dateInput = document.getElementById('dateInput');
    const timeInput = document.getElementById('timeInput');

    function checkDateTimeInputs() {
        if (dateInput.value && timeInput.value) {
            btnNext3.disabled = false;
        } else {
            btnNext3.disabled = true;
        }
    }

    dateInput.addEventListener('change', checkDateTimeInputs);
    timeInput.addEventListener('change', checkDateTimeInputs);

    // Navigation logic
    btnYes1.addEventListener('click', () => {
        showScreen(screen1, screen2);
    });

    btnYes2.addEventListener('click', () => {
        showScreen(screen2, screen3);
    });

    btnNext3.addEventListener('click', () => {
        selectedDate = dateInput.value;
        selectedTime = timeInput.value;

        // Format date to be nicer
        const dateObj = new Date(selectedDate);
        selectedDate = dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

        showScreen(screen3, screen4);
    });

    // Food selection
    const foodCards = document.querySelectorAll('.food-card');
    foodCards.forEach(card => {
        card.addEventListener('click', function() {
            selectedFood = this.getAttribute('data-food');

            // Proceed to next screen
            showFinalScreen();
        });
    });

    function showFinalScreen() {
        // Populate final data
        document.getElementById('finalDate').textContent = selectedDate;
        document.getElementById('finalTime').textContent = selectedTime;
        document.getElementById('finalFood').textContent = selectedFood;

        showScreen(screen4, screen5);
        startHeartsAnimation();
    }

    // --- Hearts Animation Logic ---
    function startHeartsAnimation() {
        const heartsContainer = document.getElementById('heartsContainer');
        heartsContainer.classList.remove('hidden');

        setInterval(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart');

            // Random horizontal position
            heart.style.left = Math.random() * 100 + 'vw';

            // Random animation duration between 3s and 6s
            heart.style.animationDuration = Math.random() * 3 + 3 + 's';

            // Remove heart after animation completes to avoid memory leak
            heart.addEventListener('animationend', () => {
                heart.remove();
            });

            heartsContainer.appendChild(heart);
        }, 300); // create a new heart every 300ms
    }

});
