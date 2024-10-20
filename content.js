// FastFwd Content Script

const STORAGE_KEYS = {
  STATS: 'FastFwd_Stats',
  SETTINGS: 'FastFwd_Settings',
  DEVICE_ID: 'FastFwd_DeviceId'
};

let videoEnhancementState = { isEnhanced: false, enhancementStartTime: 0 };
let currentVideoUrl = '';

// Utility Functions
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function getOrCreateDeviceId() {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_KEYS.DEVICE_ID, (result) => {
      let deviceId = result[STORAGE_KEYS.DEVICE_ID];
      if (!deviceId) {
        deviceId = generateUUID();
        chrome.storage.local.set({ [STORAGE_KEYS.DEVICE_ID]: deviceId }, () => {
          resolve(deviceId);
        });
      } else {
        resolve(deviceId);
      }
    });
  });
}

async function updateStats(timeSaved) {
  const deviceId = await getOrCreateDeviceId();
  const currentStats = await getStats();
  const updatedStats = {
    totalTimeSaved: currentStats.totalTimeSaved + timeSaved,
    videosWatched: currentStats.videosWatched + 1,
    averageSkipSpeed: (currentStats.averageSkipSpeed * currentStats.videosWatched + timeSaved) / (currentStats.videosWatched + 1),
    timeSavedPerVideo: (currentStats.totalTimeSaved + timeSaved) / (currentStats.videosWatched + 1)
  };

  chrome.storage.local.set({ [STORAGE_KEYS.STATS]: updatedStats });

  // You can implement an API call here to update stats on your server if needed
  // fetch('https://api.fastfwd.com/v1/updateStats', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ deviceId, stats: updatedStats })
  // });

  return updatedStats;
}

// Video Enhancement Detection and Handling
function setupVideoEnhancement() {
  const videoPlayer = document.querySelector('#movie_player');
  if (!videoPlayer) return;

  const videoObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const shouldEnhance = videoPlayer.classList.contains('ad-showing') || videoPlayer.classList.contains('ad-interrupting');
        handleVideoStateChange(shouldEnhance);
      }
    }
  });

  videoObserver.observe(videoPlayer, {
    attributes: true,
    attributeFilter: ['class']
  });
}

async function handleVideoStateChange(shouldEnhance) {
  const video = document.querySelector('video');
  if (!video) return;

  const settings = await getSettings();
  if (!settings.isEnabled) return;

  if (shouldEnhance && !videoEnhancementState.isEnhanced) {
    videoEnhancementState.isEnhanced = true;
    videoEnhancementState.enhancementStartTime = Date.now();
    applyVideoEnhancements(video, settings);
  } else if (!shouldEnhance && videoEnhancementState.isEnhanced) {
    const timeSaved = (Date.now() - videoEnhancementState.enhancementStartTime) * (settings.skipSpeed - 1) / 1000;
    videoEnhancementState.isEnhanced = false;
    resetVideoPlayback(video);
    updateStats(timeSaved);
  }
}

function applyVideoEnhancements(video, settings) {
  video.playbackRate = settings.skipSpeed;
  if (settings.autoSkipAds) {
    const skipButton = document.querySelector('.ytp-ad-skip-button');
    if (skipButton) skipButton.click();
  }
}

function resetVideoPlayback(video) {
  const storedRate = sessionStorage.getItem('yt-player-playback-rate');
  const storedVolume = sessionStorage.getItem('yt-player-volume');
  
  if (storedRate) {
    const rate = JSON.parse(storedRate).data || 1;
    video.playbackRate = Number(rate);
  }
  
  if (storedVolume) {
    const volume = JSON.parse(storedVolume).data;
    video.volume = volume ? JSON.parse(volume).volume : 1;
  }
}

// Settings Management
async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_KEYS.SETTINGS, (result) => {
      resolve(result[STORAGE_KEYS.SETTINGS] || { skipSpeed: 2, isEnabled: true, autoSkipAds: true, disableOnNonVideo: false });
    });
  });
}

async function updateSettings(newSettings) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: newSettings }, () => {
      resolve();
    });
  });
}

async function getStats() {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_KEYS.STATS, (result) => {
      resolve(result[STORAGE_KEYS.STATS] || { totalTimeSaved: 0, videosWatched: 0, averageSkipSpeed: 0, timeSavedPerVideo: 0 });
    });
  });
}

// Initialize
if (window.location.href.includes('youtube.com/watch')) {
  setupVideoEnhancement();
}

// Message Handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'updateSettings':
      updateSettings(message.settings).then(() => {
        const video = document.querySelector('video');
        if (video && videoEnhancementState.isEnhanced) {
          applyVideoEnhancements(video, message.settings);
        }
      });
      break;
    case 'getStats':
      getStats().then(sendResponse);
      return true; // Indicates async response
  }
});

// Additional functionality for Twitch (if needed)
if (window.location.href.includes('twitch.tv')) {
  setupTwitchEnhancement();
}

function setupTwitchEnhancement() {
  // Implement Twitch-specific enhancement logic here
  console.log('Twitch enhancement setup');
}