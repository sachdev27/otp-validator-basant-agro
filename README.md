# Seed Package Verification Frontend

This project is a mobile-friendly frontend for a seed package verification system. Users scan a QR code on a seed package, enter a 10-digit mobile number, verify it via OTP, and gain access to a PDF with package details, a WhatsApp chat link, and a direct phone call option.

## Features
- **Responsive Design**: Optimized for mobile and desktop using Tailwind CSS.
- **Mobile Number Validation**: Ensures a 10-digit mobile number with real-time error feedback.
- **OTP Verification**: Integrates with a Lambda backend to send and verify OTPs, with a 60-second resend timer.
- **Post-Verification Actions**: Provides links to a PDF, WhatsApp chat, and direct phone call upon successful verification.
- **Professional UI**: Clean, modern interface with animations (e.g., shake effect for errors).

## Project Structure
The project is modular, with separate files for HTML, CSS, and JavaScript:
- `index.html`: Defines the page structure and links to CSS/JavaScript.
- `styles.css`: Custom styles for the background gradient and error shake animation.
- `script.js`: Handles form validation, API calls, OTP timer, and UI updates.

## Prerequisites
- A modern web browser (Chrome, Firefox, Safari, etc.).
- An HTTP server to serve the files (e.g., `live-server`, AWS S3, or any static hosting service).
- A backend Lambda function to handle OTP sending and verification (not included in this frontend).

## Setup Instructions
1. **Clone or Download the Project**:
   - Clone this repository or download the `index.html`, `styles.css`, and `script.js` files.
   - Ensure all files are in the same directory.

2. **Update Placeholder URLs**:
   - In `index.html`, replace the following placeholders with your actual endpoints:
     - `https://your-lambda-endpoint.aws`: Your Lambda endpoint for sending OTPs.
     - `https://your-lambda-endpoint.aws/verify`: Your Lambda endpoint for verifying OTPs.
     - `https://example.com/package.pdf`: The URL to your package details PDF.
     - `https://wa.me/+1234567890`: Your WhatsApp number (format: `+<country-code><number>`).
     - `tel:+1234567890`: Your phone number for direct calls.

3. **Host the Files**:
   - **Local Testing**: Use a tool like `live-server` (install via `npm install -g live-server`, then run `live-server` in the project directory).
   - **Production**: Upload the files to a static hosting service (e.g., AWS S3, Netlify, Vercel) and ensure `styles.css` and `script.js` are accessible relative to `index.html`.

4. **Test the Application**:
   - Open the page in a browser (via `http://localhost:8080` for `live-server` or your hosted URL).
   - Test the mobile number input, OTP flow, and post-verification links across devices.

## Usage
1. **Scan QR Code**: Users scan the QR code on the seed package, which directs them to the hosted `index.html` page.
2. **Enter Mobile Number**: Input a 10-digit mobile number and click "Send OTP". Invalid inputs trigger an error.
3. **Verify OTP**: Enter the OTP received via SMS. A 60-second timer prevents resending until it expires.
4. **Access Links**: After successful verification, users see buttons to:
   - View the package details PDF.
   - Start a WhatsApp chat.
   - Make a direct phone call.

## Dependencies
- **Tailwind CSS**: Included via CDN (`https://cdn.tailwindcss.com`) for responsive styling.
- No additional JavaScript libraries are required.

## Customization
- **Styling**: Modify `styles.css` to change the background gradient, fonts, or animations. Tailwind classes in `index.html` can be adjusted for different colors or layouts.
- **Validation**: Update the regex in `script.js` (e.g., `/^\d{10}$/`) to support different phone number formats.
- **Timer**: Adjust the `timeLeft` variable in `script.js` to change the OTP resend timer duration.
- **API Integration**: Replace the `fetch` URLs in `script.js` with your Lambda endpoints and handle any custom response formats.

## Notes
- The backend Lambda functions for OTP sending and verification are not included. Ensure your backend returns appropriate HTTP status codes (e.g., 200 for success, 400 for errors).
- Test the WhatsApp and phone call links with valid numbers to ensure they work on mobile devices.
- For production, consider minifying assets or using a build tool (e.g., Vite) to optimize performance.

## Troubleshooting
- **CSS/JS Not Loading**: Verify that `styles.css` and `script.js` are in the same directory as `index.html` and accessible via the correct paths.
- **API Errors**: Check the Lambda endpoint URLs and ensure the backend is operational. Log errors in the browser console for debugging.
- **Responsive Issues**: Test on multiple devices and adjust Tailwind classes in `index.html` if needed.

## Future Improvements
- Add accessibility features (e.g., ARIA labels, keyboard navigation).
- Implement a loading spinner during API calls.
- Support multiple languages for the UI.
- Add unit tests for the JavaScript logic using a framework like Jest.

## License
This project is for demonstration purposes. Update this section with your preferred license (e.g., MIT, Apache) if distributing.