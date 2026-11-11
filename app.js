const camera = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const startBtn = document.getElementById("start");
const captureBtn = document.getElementById("capture");
const stopBtn = document.getElementById("stop");
const statusText = document.getElementById("status");
const placeholder = document.getElementById("placeholder");
const answer = document.getElementById("answer");
const speakBtn = document.getElementById("speak");

let cameraStream = null;
let photoData = null;

startBtn.addEventListener("click", async () => {
try {
cameraStream = await navigator.mediaDevices.getUserMedia({
video: { facingMode: "environment" },
audio: false
});

camera.srcObject = cameraStream;

startBtn.disabled = true;
captureBtn.disabled = false;
stopBtn.disabled = false;
placeholder.hidden = true;

statusText.textContent = "Камера работает!";

} catch (error) {
statusText.textContent =
"Не удалось включить камеру. Проверь разрешение и подключение.";
}
});

captureBtn.addEventListener("click", () => {
if (!camera.videoWidth) {
statusText.textContent = "Подожди, пока камера запустится.";
return;
}

canvas.width = camera.videoWidth;
canvas.height = camera.videoHeight;

const context = canvas.getContext("2d");
context.drawImage(camera, 0, 0);

photoData = canvas.toDataURL("image/jpeg", 0.8);

answer.textContent =
"Фото сделано! Следующий этап — подключение ИИ для анализа изображения.";

speakBtn.disabled = false;
statusText.textContent = "Фотография сделана.";
});

speakBtn.addEventListener("click", () => {
if (!("speechSynthesis" in window)) {
statusText.textContent = "Озвучивание не поддерживается браузером.";
return;
}

const message = new SpeechSynthesisUtterance(answer.textContent);
message.lang = "ru-RU";
speechSynthesis.cancel();
speechSynthesis.speak(message);
});

stopBtn.addEventListener("click", () => {
if (cameraStream) {
cameraStream.getTracks().forEach(track => track.stop());
cameraStream = null;
}

camera.srcObject = null;
startBtn.disabled = false;
captureBtn.disabled = true;
stopBtn.disabled = true;
placeholder.hidden = false;

statusText.textContent = "Камера выключена.";
});

window.addEventListener("beforeunload", () => {
if (cameraStream) {
cameraStream.getTracks().forEach(track => track.stop());
}
});