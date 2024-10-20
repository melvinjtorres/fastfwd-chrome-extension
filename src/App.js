import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
                chrome.tabs.sendMessage(tabs[0].id, { action: 'updateSettings', skipSpeed, isEnabled });
            });
        }
        else {
            console.log('Chrome extension APIs not available. Running in development mode.');
        }
    }, [skipSpeed, isEnabled]);
    useEffect(() => {
        if (typeof chrome !== 'undefined' && chrome.tabs) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'getStats' }, (response) => {
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
        }
        else {
            console.log('Chrome extension APIs not available. Using mock data.');
            setStats({
                totalTimeSaved: 13500, // 3h 45m in seconds
                videosWatched: 127,
                averageSkipSpeed: 2.7,
                timeSavedPerVideo: 135 // 2m 15s in seconds
            });
        }
    }, []);
    return (_jsx(TooltipProvider, { children: _jsxs("div", { className: "w-80 bg-gray-900 text-white p-4 rounded-lg max-h-[600px] overflow-y-auto", children: [!showStats && !showSettings ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Zap, { className: "text-orange-500 mr-2" }), _jsx("h1", { className: "text-xl font-bold", children: "fastfwd" })] }), _jsx(Switch, { checked: isEnabled, onCheckedChange: setIsEnabled, className: "bg-orange-500" })] }), _jsx("div", { className: "bg-gray-800 rounded-full p-4 mb-4", children: _jsxs("div", { className: "text-center", children: [_jsxs("span", { className: "text-4xl font-bold", children: [skipSpeed, "x"] }), _jsx("p", { className: "text-sm text-gray-400", children: "Skip Speed" })] }) }), _jsx(Slider, { value: [skipSpeed], onValueChange: (value) => setSkipSpeed(value[0]), min: 1, max: 16, step: 0.5, className: "mb-6" })] })) : showStats ? (_jsx(Stats, { ...stats })) : (_jsx(Settings, { defaultSkipSpeed: skipSpeed, setDefaultSkipSpeed: setSkipSpeed, autoSkipAds: autoSkipAds, setAutoSkipAds: setAutoSkipAds, disableOnNonVideo: disableOnNonVideo, setDisableOnNonVideo: setDisableOnNonVideo })), _jsxs("div", { className: "flex justify-between mt-4", children: [_jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => {
                                            setShowStats(false);
                                            setShowSettings(false);
                                        }, children: _jsx(Zap, { className: "h-5 w-5 text-orange-500" }) }) }), _jsx(TooltipContent, { children: _jsx("p", { children: "FastFwd" }) })] }), _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => {
                                            setShowStats(true);
                                            setShowSettings(false);
                                        }, children: _jsx(BarChart2, { className: "h-5 w-5 text-orange-500" }) }) }), _jsx(TooltipContent, { children: _jsx("p", { children: "Statistics" }) })] }), _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => window.open('https://ko-fi.com/yourkofilink', '_blank'), children: _jsx(Coffee, { className: "h-5 w-5 text-orange-500" }) }) }), _jsx(TooltipContent, { children: _jsx("p", { children: "Support on Ko-fi" }) })] }), _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => {
                                            setShowSettings(true);
                                            setShowStats(false);
                                        }, children: _jsx(SettingsIcon, { className: "h-5 w-5 text-orange-500" }) }) }), _jsx(TooltipContent, { children: _jsx("p", { children: "Settings" }) })] })] })] }) }));
}
export default App;
