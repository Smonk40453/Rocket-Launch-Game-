const startButton = document.getElementById('startButton');
const launchButton = document.getElementById('launchButton');
const resetBestButton = document.getElementById('resetBestButton');
const statusMessage = document.getElementById('statusMessage');
const bestTimeDisplay = document.getElementById('bestTime');
const lastTimeDisplay = document.getElementById('lastTime');
const pilotRankDisplay = document.getElementById('pilotRank');

let gameState = 'idle';
let launchStartTime = 0;
let launchTimeout = null;
let bestTime = Number(localStorage.getItem('rocketBestTime')) || null;

updateBestTimeDisplay();

function updateBestTimeDisplay() {
  bestTimeDisplay.textContent = bestTime ? `${bestTime} ms` : '-- ms';
}

function setStatus(message) {
  statusMessage.innerHTML = message;
}

function getPilotRank(time) {
  if (time < 220) return 'Rocket Ace';
  if (time < 300) return 'Mission Ready';
  if (time < 400) return 'Pretty Quick';
  if (time < 550) return 'Still on the launchpad';
  return 'Distracted by snacks';
}

function beginMission() {
  clearTimeout(launchTimeout);
  gameState = 'waiting';
  launchStartTime = 0;

  startButton.disabled = true;
  launchButton.disabled = false;
  launchButton.classList.remove('ready');
  launchButton.classList.add('flash');

  const waitingMessages = [
    'Fueling rocket... Stand by.',
    'Running final systems check...',
    'Mission Control is watching...',
    'Securing snacks and launch codes...',
    'Checking weather over the launch pad...'
  ];

  const message = waitingMessages[Math.floor(Math.random() * waitingMessages.length)];
  setStatus(message);

  const randomDelay = Math.floor(Math.random() * 3000) + 2000;

  launchTimeout = setTimeout(() => {
    gameState = 'ready';
    launchStartTime = Date.now();
    launchButton.classList.remove('flash');
    launchButton.classList.add('ready');
    setStatus('<strong>LAUNCH NOW 🚀</strong>');
  }, randomDelay);
}

function handleLaunchClick() {
  if (gameState === 'idle') {
    setStatus('Click <strong>Start Mission</strong> first.');
    return;
  }

  if (gameState === 'waiting') {
    clearTimeout(launchTimeout);
    gameState = 'idle';
    startButton.disabled = false;
    launchButton.disabled = true;
    launchButton.classList.remove('flash', 'ready');
    pilotRankDisplay.textContent = 'False Start';
    lastTimeDisplay.textContent = '-- ms';
    setStatus('<strong>False start!</strong> You launched too early. Mission failed.');
    return;
  }

  if (gameState === 'ready') {
    const reactionTime = Date.now() - launchStartTime;
    gameState = 'idle';
    startButton.disabled = false;
    launchButton.disabled = true;
    launchButton.classList.remove('flash', 'ready');

    lastTimeDisplay.textContent = `${reactionTime} ms`;
    pilotRankDisplay.textContent = getPilotRank(reactionTime);
    setStatus(`<strong>Successful liftoff.</strong> Your reaction time was <strong>${reactionTime} ms</strong>.`);

    if (!bestTime || reactionTime < bestTime) {
      bestTime = reactionTime;
      localStorage.setItem('rocketBestTime', String(bestTime));
      updateBestTimeDisplay();
      setStatus(`<strong>New personal best! 🚀</strong> You launched in <strong>${reactionTime} ms</strong>.`);
    }
  }
}

function resetBestScore() {
  bestTime = null;
  localStorage.removeItem('rocketBestTime');
  updateBestTimeDisplay();
  setStatus('Best score cleared. Mission Control is ready for a new champion.');
}

startButton.addEventListener('click', beginMission);
launchButton.addEventListener('click', handleLaunchClick);
resetBestButton.addEventListener('click', resetBestScore);
