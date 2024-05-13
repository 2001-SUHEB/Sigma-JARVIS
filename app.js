// Selectors
const talkButton = document.querySelector('.talk');
const contentElement = document.querySelector('.content');

// Speech Synthesis
const speechSynthesis = window.speechSynthesis;
const speechUtterance = new SpeechSynthesisUtterance('');

function speak(text) {
    speechUtterance.text = text;
    speechUtterance.voice = getMaleUKEnglishVoice();
    speechUtterance.rate = 0.9;
    speechUtterance.volume = 1;
    speechUtterance.pitch = 1.2;
    speechSynthesis.speak(speechUtterance);
}

function getMaleUKEnglishVoice() {
    return speechSynthesis.getVoices().find(voice => voice.name === 'Google UK English Male');
}

// Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    contentElement.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

// Initialize JARVIS on load
window.addEventListener('load', () => {
    speak("Initializing JARVIS..");
    wishMe();
});

// Button click event
talkButton.addEventListener('click', () => {
    contentElement.textContent = "Listening....";
    recognition.start();
});

// Greeting function
function wishMe() {
    const currentTime = new Date();
    const hour = currentTime.getHours();

    if (hour >= 0 && hour < 12) {
        speak(GREETING_MORNING);
    } else if (hour >= 12 && hour < 17) {
        speak(GREETING_AFTERNOON);
    } else {
        speak(GREETING_EVENING);
    }
}

// Modify takePicture function to prompt for save or delete
function takePicture() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            // Create video element
            const video = document.createElement('video');
            document.body.appendChild(video);
            video.srcObject = stream;
            video.onloadedmetadata = function (e) {
                video.play();
            };
            // Prompt user to save or delete
            const confirmation = confirm("Do you want to save the picture?");
            setTimeout(function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const image = canvas.toDataURL('image/jpeg');
                if (confirmation) {
                    // Do something with the image data (e.g., upload to a server)
                    speak("Picture saved.");
                } else {
                    speak("Picture deleted.");
                }
                closeCamera(); // Close the camera after taking the picture
            }, 3000); // Adjust the delay as needed
        })
        .catch(function (err) {
            console.error('Error accessing camera: ', err);
        });
}




// JARVIS Turn On Camera
function turnOnCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            const video = document.createElement('video');
            document.body.appendChild(video);

            video.srcObject = stream;
            video.onloadedmetadata = function (e) {
                video.play();
            };
        })
        .catch(function (err) {
            console.error('Error accessing camera: ', err);
        });
}


// Function to close the camera or video stream
function closeCamera() {
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(video => {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.parentElement.removeChild(video);
    });
}


function playMusic(url) {
    const audio = new Audio(url);
    audio.play();
}










const GREETING_MORNING = "Good Morning Suheb...";
const GREETING_AFTERNOON = "Good Afternoon Master...";
const GREETING_EVENING = "Good Evening Sir...";

// Command processing function
function takeCommand(message) {
    switch (true) {
        case message.includes('hey') || message.includes('hello'):
            speak("Hello Sir, How May I Help You?");
            break;
        case message.includes("open google"):
            openUrl("https://google.com");
            speak("Opening Google...");
            break;
        case message.includes("open youtube"):
            openUrl("https://youtube.com");
            speak("Opening Youtube...");
            break;
        case message.includes("open facebook"):
            openUrl("https://facebook.com");
            speak("Opening Facebook...");
            break;
        case message.includes('what is') || message.includes('who is') || message.includes('what are'):
            searchGoogle(message);
            break;
        case message.includes('wikipedia'):
            openWikipedia(message);
            break;
        case message.includes('time'):
            speak(getCurrentTime());
            break;
        case message.includes('date'):
            speak(getCurrentDate());
            break;
        case message.includes('calculator'):
            openUrl('Calculator:///');
            speak("Opening Calculator");
            break;
        case (message.includes('who') && message.includes('made') && message.includes('you')) || (message.includes('who') && message.includes('created') && message.includes('you')):
            openUrl("https://suheb-portfolio.vercel.app/");
            speak("My journey started on May 10th, 2024, under Syed Sha Suheb's guidance at SigmaCodingWithSuheb, delving into MERN stack, software engineering, and data science.");
            break;
        case message.includes('open chat gpt'):
            openUrl('https://chatgpt.com/?oai-dm=1');
            speak("Welcome to ChatGPT, your digital companion for exploration, inquiry, and conversation. How may I assist you today?");
            break;
        case message.includes('shutdown'):
            speak("Goodbye, Sir.");
            setTimeout(() => {
                window.close(); // Close the window after saying goodbye
            }, 2000); // Delay closing for 2 seconds (adjust as needed)
            break;
        case message.includes('take a picture'):
            takePicture();
            break;
        case message.includes('turn on camera'):
            turnOnCamera();
            break;
        case message.includes('play music'):
            // playMusic('C:\Users\ASUS\Desktop\My-Projects\JARVIS 1.0 Html Css Js\JARVIS 1.0 Html Css Js\luis_fonsi_despacito.mp3');
            playMusic('luis_fonsi_despacito.mp3');

            break;
        case message.includes('turn off camera') || message.includes('close camera'):
            closeCamera();
            break;


        default:
            searchGoogle(message);
            break;
    }
}

function openUrl(url) {
    window.open(url, "_blank");
}

function searchGoogle(query) {
    const searchQuery = query.replace(" ", "+");
    openUrl(`https://www.google.com/search?q=${searchQuery}`);
    const defaultText = `I found some information for ${query} on Google`;
    speak(defaultText);
}

function openWikipedia(query) {
    const searchQuery = query.replace("wikipedia", "").replace(" ", "_");
    openUrl(`https://en.wikipedia.org/wiki/${searchQuery}`);
    const wikiText = `This is what I found on Wikipedia regarding ${query}`;
    speak(wikiText);
}

function getCurrentTime() {
    return new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
}

function getCurrentDate() {
    return new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
}
