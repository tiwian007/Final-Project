document.addEventListener('DOMContentLoaded', () => {
    // Timer variables
    let isRunning = false;
    let isWorkSession = true;
    let timerInterval = null;
    let workDuration = 25 * 60; // 25 minutes in seconds
    let breakDuration = 5 * 60; // 5 minutes in seconds
    let timeLeft = workDuration;

    // Progress circle variables
    const FULL_DASH_ARRAY = 439.82; // Circumference of the circle (2 * PI * r)

    // DOM elements
    const timerDisplay = document.getElementById('timer');
    const sessionLabel = document.getElementById('session-label');
    const startBtn = document.getElementById('start');
    const pauseBtn = document.getElementById('pause');
    const resetBtn = document.getElementById('reset');
    const musicToggleBtn = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    const progressCircle = document.getElementById('progress');
    const backgroundSelect = document.getElementById('background-select');
    const musicSelect = document.getElementById('music-select');
    const pomodoroBtn = document.getElementById('pomodoro-btn');
    const shortBreakBtn = document.getElementById('shortbreak-btn');
    const longBreakBtn = document.getElementById('longbreak-btn');
    const notificationSound = document.getElementById('notification-sound');
    const alarmSound = document.getElementById('alarm-sound');
    const customMinutesInput = document.getElementById('custom-minutes');
    const setCustomTimeBtn = document.getElementById('set-custom-time');
    const testAlarmBtn = document.getElementById('test-alarm-btn');

    // Session durations (seconds)
    const DURATIONS = {
        pomodoro: 25 * 60,
        shortbreak: 5 * 60,
        longbreak: 15 * 60
    };

    // Set session type and update UI
    function setSession(type) {
        isRunning = false;
        clearInterval(timerInterval);
        if (type === 'pomodoro') {
            isWorkSession = true;
            timeLeft = DURATIONS.pomodoro;
            sessionLabel.textContent = 'Work Session';
        } else if (type === 'shortbreak') {
            isWorkSession = false;
            timeLeft = DURATIONS.shortbreak;
            sessionLabel.textContent = 'Short Break';
        } else if (type === 'longbreak') {
            isWorkSession = false;
            timeLeft = DURATIONS.longbreak;
            sessionLabel.textContent = 'Long Break';
        }
        // Update active button
        pomodoroBtn.classList.remove('active');
        shortBreakBtn.classList.remove('active');
        longBreakBtn.classList.remove('active');
        if (type === 'pomodoro') pomodoroBtn.classList.add('active');
        if (type === 'shortbreak') shortBreakBtn.classList.add('active');
        if (type === 'longbreak') longBreakBtn.classList.add('active');
        updateDisplay();
    }

    // Event listeners for session buttons
    pomodoroBtn.addEventListener('click', () => setSession('pomodoro'));
    shortBreakBtn.addEventListener('click', () => setSession('shortbreak'));
    longBreakBtn.addEventListener('click', () => setSession('longbreak'));

    // Set Pomodoro as default active on load
    pomodoroBtn.classList.add('active');

    // Timer control functions
    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                // Pause background music when time is up
                backgroundMusic.pause();
                // Play kitchen timer alarm for 5 seconds
                alarmSound.currentTime = 0;
                alarmSound.play().catch(e => console.error('Alarm sound error:', e));
                setTimeout(() => {
                    alarmSound.pause();
                    alarmSound.currentTime = 0;
                }, 5000);
                // Switch session
                if (isWorkSession) {
                    setSession('shortbreak');
                } else {
                    setSession('pomodoro');
                }
                updateDisplay();
            }
        }, 1000);
    }

    function pauseTimer() {
        isRunning = false;
        clearInterval(timerInterval);
    }

    function resetTimer() {
        isRunning = false;
        clearInterval(timerInterval);
        isWorkSession = true;
        timeLeft = workDuration;
        sessionLabel.textContent = 'Work Session';
        updateDisplay();
    }

    // Update timer display and progress circle
    function updateDisplay() {
        // Update timer text
        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const seconds = (timeLeft % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${minutes}:${seconds}`;
        // Update progress circle
        let total;
        if (sessionLabel.textContent === 'Work Session') {
            total = DURATIONS.pomodoro;
        } else if (sessionLabel.textContent === 'Short Break') {
            total = DURATIONS.shortbreak;
        } else {
            total = DURATIONS.longbreak;
        }
        const progress = timeLeft / total;
        const offset = FULL_DASH_ARRAY * (1 - progress);
        progressCircle.style.strokeDashoffset = offset;
    }

    // Music controls
    function toggleMusic() {
        if (backgroundMusic.paused) {
            backgroundMusic.muted = false;
            backgroundMusic.volume = 1.0;
            backgroundMusic.play().catch(e => console.error('Audio play error:', e));
            musicToggleBtn.textContent = 'Pause Music';
        } else {
            backgroundMusic.pause();
            musicToggleBtn.textContent = 'Play Music';
        }
    }

    // Event listeners for controls
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    musicToggleBtn.addEventListener('click', toggleMusic);

    // Handle background change
    backgroundSelect.addEventListener('change', function () {
        const value = backgroundSelect.value;
        let bgUrl = '';
        if (value === 'night1') {
            bgUrl = 'https://wallpapers.com/images/hd/minimalist-nature-moa7bxpdh4zuawyb.jpg';
        } else if (value === 'night2') {
            bgUrl = 'https://wallpapers.com/images/hd/1080p-minimalist-mi6b6czbcc2ybhj4.jpg';
        } else if (value === 'night3') {
            bgUrl = 'https://wallpapers.com/images/hd/minimalist-nature-vnaxv49o9a0gappj.jpg';
        } else if (value === 'night4') {
            bgUrl = 'https://wallpapers.com/images/hd/minimalist-nature-3840-x-2160-1iwu4cosdjh9b6l4.jpg';
        }
        document.body.style.background = `url("${bgUrl}") no-repeat center center fixed`;
        document.body.style.backgroundSize = 'cover';
    });

    // Handle music change
    musicSelect.addEventListener('change', function () {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        backgroundMusic.src = musicSelect.value;
        backgroundMusic.load();
        musicToggleBtn.textContent = 'Play Music';
    });

    // Initial display and background
    updateDisplay();
    document.body.style.background = 'url("https://wallpapers.com/images/hd/minimalist-nature-moa7bxpdh4zuawyb.jpg") no-repeat center center fixed';
    document.body.style.backgroundSize = 'cover';
    backgroundSelect.value = 'night1';
}); 