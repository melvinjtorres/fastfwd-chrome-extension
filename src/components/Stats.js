import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Zap, Play, Clock, FastForward } from 'lucide-react';
export function Stats({ totalTimeSaved, videosWatched, averageSkipSpeed, timeSavedPerVideo }) {
    const [activeTab, setActiveTab] = useState('time');
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };
    return (_jsxs("div", { className: "w-full space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Zap, { className: "text-orange-500 mr-2" }), _jsx("h1", { className: "text-xl font-bold", children: "fastfwd" })] }), _jsx("span", { className: "text-sm text-gray-400", children: "Statistics" })] }), _jsxs(Tabs, { value: activeTab, onValueChange: (value) => setActiveTab(value), children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2 bg-gray-800 rounded-full", children: [_jsx(TabsTrigger, { value: "time", className: `rounded-full ${activeTab === 'time' ? 'bg-orange-500 text-white' : 'text-gray-400'}`, children: "Time Saved" }), _jsx(TabsTrigger, { value: "videos", className: `rounded-full ${activeTab === 'videos' ? 'bg-orange-500 text-white' : 'text-gray-400'}`, children: "Videos" })] }), _jsxs(TabsContent, { value: "time", className: "space-y-4 mt-4", children: [_jsx(StatCard, { icon: _jsx(Clock, { className: "text-orange-500" }), title: "Total Time Saved", value: formatTime(totalTimeSaved), subtitle: "This week" }), _jsx(StatCard, { icon: _jsx(FastForward, { className: "text-orange-500" }), title: "Avg. Time / Video", value: formatTime(timeSavedPerVideo), subtitle: "Based on last 50 videos" })] }), _jsxs(TabsContent, { value: "videos", className: "space-y-4 mt-4", children: [_jsx(StatCard, { icon: _jsx(Play, { className: "text-orange-500" }), title: "Videos Watched", value: videosWatched.toString(), subtitle: "This month" }), _jsx(StatCard, { icon: _jsx(FastForward, { className: "text-orange-500" }), title: "Avg. Skip Speed", value: `${averageSkipSpeed.toFixed(1)}x`, subtitle: "Most used: 2x, 4x" })] })] })] }));
}
function StatCard({ icon, title, value, subtitle }) {
    return (_jsxs("div", { className: "bg-gray-800 rounded-lg p-4 space-y-2", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [icon, _jsx("span", { className: "text-sm text-gray-400", children: title })] }), _jsx("div", { className: "text-2xl font-bold", children: value }), _jsx("div", { className: "text-xs text-gray-500", children: subtitle })] }));
}
