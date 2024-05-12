 // Selectors
const talkButton = document.querySelector('.talk');
const contentElement = document.querySelector('.content');

// Speech synthesis function (male voice)
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    // Use a male UK English voice
    utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === 'Google UK English Male');
    // Set speech parameters
    utterance.rate = 0.9; // Slightly slower rate
    utterance.volume = 1;
    utterance.pitch = 1.2; // Slightly higher pitch
    window.speechSynthesis.speak(utterance);
}

// Greeting function
function wishMe() {
    const currentTime = new Date();
    const hour = currentTime.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Suheb...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

// Initialize JARVIS on load
window.addEventListener('load', () => {
    speak("Initializing JARVIS..");
    wishMe();
});

// Speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    contentElement.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

// Button click event
talkButton.addEventListener('click', () => {
    contentElement.textContent = "Listening....";
    recognition.start();
});

// Command processing function
function takeCommand(message) {
    // Use a switch statement for better readability and maintainability
    switch (true) {
        case message.includes('hey') || message.includes('hello'):
            speak("Hello Sir, How May I Help You?");
            break;
        case message.includes("open google"):
            window.open("https://google.com", "_blank");
            speak("Opening Google...");
            break;
        case message.includes("open youtube"):
            window.open("https://youtube.com", "_blank");
            speak("Opening Youtube...");
            break;
        case message.includes("open facebook"):
            window.open("https://facebook.com", "_blank");
            speak("Opening Facebook...");
            break;
        case message.includes('what is') || message.includes('who is') || message.includes('what are'):
            window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
            const finalText = `This is what I found on the internet regarding ${message}`;
            speak(finalText);
            break;
        case message.includes('wikipedia'):
            window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`, "_blank");
            const wikiText = `This is what I found on Wikipedia regarding ${message}`;
            speak(wikiText);
            break;
        case message.includes('time'):
            const currentTime = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
            speak(currentTime);
            break;
        case message.includes('date'):
            const currentDate = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
            speak(currentDate);
            break;
        case message.includes('calculator'):
            window.open('Calculator:///');
            speak("Opening Calculator");
            break;
        case message.includes('who') || message.includes('made') || message.includes('you'):
            window.open("https://suheb-portfolio.vercel.app/", "_blank");
            speak("My journey started on May 10th, 2024, under Syed Sha Suheb's guidance at SigmaCodingWithSuheb, delving into MERN stack, software engineering, and data science.");
            break;
        default:
            window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
            const defaultText = `I found some information for ${message} on Google`;
            speak(defaultText);
    }
}
