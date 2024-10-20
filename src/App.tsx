import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Zap, BarChart2, Coffee, Settings as SettingsIcon } from 'lucide-react';
import { Stats } from '@/components/Stats';
import { Settings } from '@/components/Settings';

function App() {
  const [skipSpeed, setSkipSpeed] = useState(2);
  const [isEnabled, setIsEnabled] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoSkipAds, setAutoSkipAds] = useState(true);
  const [disableOnNonVideo, setDisableOnNonVideo] = useState(false);
  const [stats, setStats] = useState({
    totalTimeSaved: 0,
    videosWatched: 0,
    averageSkipSpeed: 0,
    timeSavedPerVideo: 0
  });

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id!, { action: 'updateSettings', skipSpeed, isEnabled });
      });
    } else {
      console.log('Chrome extension APIs not available. Running in development mode.');
    }
  }, [skipSpeed, isEnabled]);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id!, { action: 'getStats' }, (response) => {
          if (response) {
            setStats({
              totalTimeSaved: response.totalTimeSaved,
              videosWatched: response.videosWatched,
              averageSkipSpeed: response.totalSkipTime / response.videosWatched,
              timeSavedPerVideo: response.totalTimeSaved / response.videosWatched
            });
          }
        });
      });
    } else {
      console.log('Chrome extension APIs not available. Using mock data.');
      setStats({
        totalTimeSaved: 13500, // 3h 45m in seconds
        videosWatched: 127,
        averageSkipSpeed: 2.7,
        timeSavedPerVideo: 135 // 2m 15s in seconds
      });
    }
  }, []);

  return (
    <TooltipProvider>
      <div className="w-80 bg-gray-900 text-white p-4 rounded-lg max-h-[600px] overflow-y-auto">
        {!showStats && !showSettings ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Zap className="text-orange-500 mr-2" />
                <h1 className="text-xl font-bold">fastfwd</h1>
              </div>
              <Switch
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
                className="bg-orange-500"
              />
            </div>

            <div className="bg-gray-800 rounded-full p-4 mb-4">
              <div className="text-center">
                <span className="text-4xl font-bold">{skipSpeed}x</span>
                <p className="text-sm text-gray-400">Skip Speed</p>
              </div>
            </div>

            <Slider
              value={[skipSpeed]}
              onValueChange={(value) => setSkipSpeed(value[0])}
              min={1}
              max={16}
              step={0.5}
              className="mb-6"
            />
          </>
        ) : showStats ? (
          <Stats {...stats} />
        ) : (
          <Settings
            defaultSkipSpeed={skipSpeed}
            setDefaultSkipSpeed={setSkipSpeed}
            autoSkipAds={autoSkipAds}
            setAutoSkipAds={setAutoSkipAds}
            disableOnNonVideo={disableOnNonVideo}
            setDisableOnNonVideo={setDisableOnNonVideo}
          />
        )}

        <div className="flex justify-between mt-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => {
                setShowStats(false);
                setShowSettings(false);
              }}>
                <Zap className="h-5 w-5 text-orange-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>FastFwd</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => {
                setShowStats(true);
                setShowSettings(false);
              }}>
                <BarChart2 className="h-5 w-5 text-orange-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Statistics</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => window.open('https://ko-fi.com/yourkofilink', '_blank')}>
                <Coffee className="h-5 w-5 text-orange-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Support on Ko-fi</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => {
                setShowSettings(true);
                setShowStats(false);
              }}>
                <SettingsIcon className="h-5 w-5 text-orange-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;