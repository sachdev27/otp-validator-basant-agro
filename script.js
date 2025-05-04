const mobileInput = document.getElementById('mobile-number');
const submitButton = document.getElementById('submit-button');
const errorMessage = document.getElementById('error-message');
const inputSection = document.getElementById('input-section');
const otpSection = document.getElementById('otp-section');
const otpInput = document.getElementById('otp-input');
const verifyButton = document.getElementById('verify-button');
const successSection = document.getElementById('success-section');
const timer = document.getElementById('timer');
const countdown = document.getElementById('countdown');
const resendButton = document.getElementById('resend-button');
const otpError = document.getElementById('otp-error');

let countdownTimer;

// Restrict input to numbers only and enforce 10-digit limit
mobileInput.addEventListener('input', () => {
    // Remove non-numeric characters
    mobileInput.value = mobileInput.value.replace(/[^0-9]/g, '');
    // Enforce 10-digit limit
    if (mobileInput.value.length > 10) {
        mobileInput.value = mobileInput.value.slice(0, 10);
    }
});

// Block non-numeric keypresses (e.g., 'e', '+', '-')
mobileInput.addEventListener('keypress', (e) => {
    const charCode = e.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
        e.preventDefault();
    }
});

submitButton.addEventListener('click', async () => {
    const mobile = mobileInput.value.trim();
    if (!/^\d{10}$/.test(mobile)) {
        errorMessage.classList.remove('hidden');
        mobileInput.classList.add('error-shake');
        setTimeout(() => mobileInput.classList.remove('error-shake'), 300);
        return;
    }

    errorMessage.classList.add('hidden');
    try {
        const response = await fetch('https://your-lambda-endpoint.aws', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile })
        });
        if (response.ok) {
            inputSection.classList.add('hidden');
            otpSection.classList.remove('hidden');
            startTimer();
        } else {
            errorMessage.textContent = 'Failed to send OTP. Try again.';
            errorMessage.classList.remove('hidden');
        }
    } catch (error) {
        errorMessage.textContent = 'Network error. Please try again.';
        errorMessage.classList.remove('hidden');
    }
});

verifyButton.addEventListener('click', async () => {
    const otp = otpInput.value.trim();
    if (!/^\d{4,6}$/.test(otp)) {
        otpError.classList.remove('hidden');
        otpInput.classList.add('error-shake');
        setTimeout(() => otpInput.classList.remove('error-shake'), 300);
        return;
    }

    try {
        const response = await fetch('https://your-lambda-endpoint.aws/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile: mobileInput.value, otp })
        });
        if (response.ok) {
            otpSection.classList.add('hidden');
            successSection.classList.remove('hidden');
            clearInterval(countdownTimer);
        } else {
            otpError.classList.remove('hidden');
        }
    } catch (error) {
        otpError.textContent = 'Network error. Please try again.';
        otpError.classList.remove('hidden');
    }
});

resendButton.addEventListener('click', async () => {
    resendButton.classList.add('hidden');
    timer.classList.remove('hidden');
    await submitButton.click();
});

function startTimer() {
    let timeLeft = 60;
    countdown.textContent = timeLeft;
    countdownTimer = setInterval(() => {
        timeLeft--;
        countdown.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            timer.classList.add('hidden');
            resendButton.classList.remove('hidden');
        }
    }, 1000);
}