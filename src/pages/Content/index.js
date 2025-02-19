import { printLine } from './modules/print';

const renderPlayIcon = () => `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#2ecc71">
    <path d="M8 5v14l11-7z"/>
  </svg>
`;

const renderPauseIcon = () => `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#2ecc71">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
`;

const renderLoadingIcon = () => `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#2ecc71" class="loading-spinner">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
    <path d="M12 2v4" class="spinner-path"/>
  </svg>
`;

let audioElement = null;

function initializeAudioPlayer() {
  const audioButtons = document.querySelectorAll(
    '[data-testid="audioPlayButton"]'
  );

  const button = audioButtons[0];
  if (
    button?.parentElement &&
    !button.parentElement.querySelector('[data-custom-player]')
  ) {
    const customIcon = document.createElement('button');
    customIcon.innerHTML = renderPlayIcon();
    customIcon.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      cursor: pointer;
      z-index: 10;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
    `;
    customIcon.setAttribute('data-custom-player', 'ava-player');
    customIcon.setAttribute('data-player-state', 'play');

    button.parentElement.style.position = 'relative';

    customIcon.addEventListener('click', handlePlayerClick);
    button.parentElement.appendChild(customIcon);
  }
}

function handlePlayerClick(e) {
  e.stopPropagation();
  e.preventDefault();

  const customIcon = e.currentTarget;
  const currentState = customIcon.getAttribute('data-player-state');

  if (currentState === 'play') {
    customIcon.innerHTML = renderPauseIcon();
    customIcon.setAttribute('data-player-state', 'pause');

    const paragraphs = document.querySelectorAll('.pw-post-body-paragraph');
    const textContent = Array.from(paragraphs).map((p) => p.textContent);

    // For now, using a sample URL - you'll want to replace this with your actual audio URL
    playAudio(
      'https://firebasestorage.googleapis.com/v0/b/nusic-ai-agent.firebasestorage.app/o/audio%20(11).wav?alt=media'
    );
  } else if (currentState === 'pause') {
    customIcon.innerHTML = renderPlayIcon();
    customIcon.setAttribute('data-player-state', 'play');
    pauseAudio();
  }
}

function playAudio(url) {
  if (!audioElement) {
    audioElement = new Audio(url);
    audioElement.addEventListener('ended', handleAudioEnded);
  }
  audioElement.play();
}

function pauseAudio() {
  audioElement?.pause();
}

function handleAudioEnded() {
  const customIcon = document.querySelector('[data-custom-player]');
  if (customIcon) {
    customIcon.innerHTML = renderPlayIcon();
    customIcon.setAttribute('data-player-state', 'play');
  }
}

// // Replace the direct initialization with a more robust approach
// function waitForContent() {
//   // Create a MutationObserver to watch for changes in the DOM
//   const observer = new MutationObserver((mutations, obs) => {
//     const audioButton = document.querySelector(
//       '[data-testid="audioPlayButton"]'
//     );
//     if (audioButton) {
//       initializeAudioPlayer();
//       obs.disconnect(); // Stop observing once we've initialized
//     }
//   });

//   // Start observing the document with the configured parameters
//   observer.observe(document, {
//     childList: true,
//     subtree: true,
//   });

//   // Also try to initialize immediately in case the content is already there
//   if (document.querySelector('[data-testid="audioPlayButton"]')) {
//     initializeAudioPlayer();
//   }
// }

// // Start watching for content
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAudioPlayer);
} else {
  initializeAudioPlayer();
}

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

// function init() {
//   // Check if root already exists
//   if (document.getElementById('my-extension-root')) {
//     return;
//   }

//   // Create root element
//   const root = document.createElement('div');
//   root.id = 'my-extension-root';
//   document.body.appendChild(root);

//   //   // Load your React app
//   //   import('./inject.jsx')
//   //     .then((module) => {
//   //       module.default();
//   //     })
//   //     .catch((err) => {
//   //       console.error('Failed to load React app:', err);
//   //     });
// }

// // Make sure the DOM is fully loaded
