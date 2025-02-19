import React, { useEffect, useRef, useState } from 'react';
import './Popup.css';
import Landing, { UserVoiceSample } from '../../containers/Landing';
import axios from 'axios';

const Popup = () => {
  const [selectedUserVoiceSample, setSelectedUserVoiceSample] =
    useState<UserVoiceSample | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const handleMediumContent = async () => {
    try {
      // First request permissions
      // const granted = await chrome.permissions.request({
      //   permissions: ['activeTab', 'scripting'],
      // });

      // if (!granted) {
      //   console.error('Permissions not granted');
      //   return;
      // }

      // Query the active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab) {
        console.error('No active tab found');
        return;
      }

      if (tab.url?.includes('medium.com')) {
        // Execute script in the Medium page context
        const result = await chrome.scripting.executeScript({
          target: { tabId: tab.id as number },
          func: (playIcon, pauseIcon, loadingIcon) => {
            const audioButtons = document.querySelectorAll(
              '[data-testid="audioPlayButton"]'
            );

            const button = audioButtons[0];
            if (
              button.parentElement &&
              !button.parentElement.querySelector('[data-custom-player]')
            ) {
              const customIcon = document.createElement('button');
              customIcon.innerHTML = playIcon;
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

              customIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();

                const currentState =
                  customIcon.getAttribute('data-player-state');
                if (currentState === 'play') {
                  customIcon.innerHTML = pauseIcon;
                  customIcon.setAttribute('data-player-state', 'pause');

                  const paragraphs = document.querySelectorAll(
                    '.pw-post-body-paragraph'
                  );
                  const textContent = Array.from(paragraphs).map(
                    (p) => p.textContent
                  );

                  chrome.runtime.sendMessage({
                    type: 'SYNTHESIZE_TEXT',
                    text: textContent[0],
                  });
                } else if (currentState === 'pause') {
                  customIcon.innerHTML = playIcon;
                  customIcon.setAttribute('data-player-state', 'play');
                  chrome.runtime.sendMessage({ type: 'PAUSE_AUDIO' });
                }
              });

              button.parentElement.appendChild(customIcon);
            }
            return audioButtons.length;
          },
          args: [renderPlayIcon(), renderPauseIcon(), renderLoadingIcon()],
        });
        console.log('Script executed, found buttons:', result[0].result);

        // // Listen for messages from content script
        // chrome.runtime.onMessage.addListener(async (message) => {
        //   if (message.type === 'SYNTHESIZE_TEXT') {
        //     debugger;
        //     if (audioRef.current) {
        //       audioRef.current.play();
        //     } else {
        //       audioRef.current = new Audio(
        //         'https://firebasestorage.googleapis.com/v0/b/nusic-ai-agent.firebasestorage.app/o/audio%20(11).wav?alt=media'
        //       );
        //       audioRef.current.play();
        //     }
        //     // startListening(message.text);
        //   } else if (message.type === 'PAUSE_AUDIO') {
        //     audioRef.current?.pause();
        //   }
        // });
      } else {
        console.log('Not a Medium page');
      }
    } catch (error) {
      console.error('Error in handleMediumContent:', error);
    }
  };

  //   const startListening = async (text: string) => {
  //     setIsLoading(true);
  //     try {
  //       const response = await axios.post(
  //         'http://localhost:8080/llasa-voice-synthesizer',
  //         { text }
  //       );
  //       const data = response.data;
  //       const url = data.url;
  //       audioRef.current = new Audio(url);
  //       audioRef.current.play();

  //       // Update icon to pause when audio starts playing
  //       await chrome.scripting.executeScript({
  //         target: {
  //           tabId: (
  //             await chrome.tabs.query({ active: true, currentWindow: true })
  //           )[0].id as number,
  //         },
  //         func: (pauseIcon) => {
  //           const customIcon = document.querySelector(
  //             '[data-custom-player]'
  //           ) as HTMLElement;
  //           if (customIcon) {
  //             customIcon.innerHTML = pauseIcon;
  //             customIcon.setAttribute('data-player-state', 'pause');
  //           }
  //         },
  //         args: [renderPauseIcon()],
  //       });
  //     } catch (error) {
  //       console.error('Error synthesizing text:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const initializeAudio = (url: string) => {
    if (!url) {
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = new Audio(url);

    // Add event listeners
    audioRef.current.addEventListener('canplaythrough', () => {
      console.log('Audio ready to play');
      audioRef.current?.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    });

    audioRef.current.addEventListener('ended', async () => {
      setIsPlaying(false);
      // Reset the play button
      chrome.scripting.executeScript({
        target: {
          tabId: (
            await chrome.tabs.query({ active: true, currentWindow: true })
          )[0].id as number,
        },
        func: (playIcon) => {
          const customIcon = document.querySelector(
            '[data-custom-player]'
          ) as HTMLElement;
          if (customIcon) {
            customIcon.innerHTML = playIcon;
            customIcon.setAttribute('data-player-state', 'play');
          }
        },
        args: [renderPlayIcon()],
      });
    });

    // Load the audio
    audioRef.current.load();
  };

  useEffect(() => {
    // Set up message listener
    const messageListener = (message: any) => {
      if (message.type === 'SYNTHESIZE_TEXT') {
        setIsPlaying(true);
        initializeAudio(
          'https://firebasestorage.googleapis.com/v0/b/nusic-ai-agent.firebasestorage.app/o/audio%20(11).wav?alt=media'
        );
      } else if (message.type === 'PAUSE_AUDIO') {
        setIsPlaying(false);
        audioRef.current?.pause();
      }
    };

    // Add the listener
    chrome.runtime.onMessage.addListener(messageListener);

    // Cleanup function to remove the listener when component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []); // Empty dependency array since we only want to set up the listener once

  //   useEffect(() => {
  //     const initializeMediumPage = async () => {
  //       try {
  //         const [tab] = await chrome.tabs.query({
  //           active: true,
  //           currentWindow: true,
  //         });

  //         if (!tab || !tab.url?.includes('medium.com')) {
  //           console.log('Not a Medium page');
  //           return;
  //         }

  //         await chrome.scripting.executeScript({
  //           target: { tabId: tab.id as number },
  //           files: ['content.js'],
  //         });
  //       } catch (error) {
  //         console.error('Error initializing Medium page:', error);
  //       }
  //     };

  //     initializeMediumPage();
  //   }, []);

  return (
    <div
      className="App"
      style={{
        backgroundColor: '#1a1a1a',
        minWidth: '300px',
        minHeight: '400px',
      }}
    >
      <Landing
        selectedUserVoiceSample={selectedUserVoiceSample}
        setSelectedUserVoiceSample={setSelectedUserVoiceSample}
      />
    </div>
  );
};

export default Popup;
