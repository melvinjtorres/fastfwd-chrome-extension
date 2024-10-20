import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Zap, Play, Clock, FastForward } from 'lucide-react';

interface StatsProps {
  totalTimeSaved: number;
  videosWatched: number;
  averageSkipSpeed: number;
  timeSavedPerVideo: number;
}

export function Stats({ totalTimeSaved, videosWatched, averageSkipSpeed, timeSavedPerVideo }: StatsProps) {
  const [activeTab, setActiveTab] = useState<'time' | 'videos'>('time');

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Zap className="text-orange-500 mr-2" />
          <h1 className="text-xl font-bold">fastfwd</h1>
        </div>
        <span className="text-sm text-gray-400">Statistics</span>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'time' | 'videos')}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-800 rounded-full">
          <TabsTrigger value="time" className={`rounded-full ${activeTab === 'time' ? 'bg-orange-500 text-white' : 'text-gray-400'}`}>
            Time Saved
          </TabsTrigger>
          <TabsTrigger value="videos" className={`rounded-full ${activeTab === 'videos' ? 'bg-orange-500 text-white' : 'text-gray-400'}`}>
            Videos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="time" className="space-y-4 mt-4">
          <StatCard
            icon={<Clock className="text-orange-500" />}
            title="Total Time Saved"
            value={formatTime(totalTimeSaved)}
            subtitle="This week"
          />
          <StatCard
            icon={<FastForward className="text-orange-500" />}
            title="Avg. Time / Video"
            value={formatTime(timeSavedPerVideo)}
            subtitle="Based on last 50 videos"
          />
        </TabsContent>
        <TabsContent value="videos" className="space-y-4 mt-4">
          <StatCard
            icon={<Play className="text-orange-500" />}
            title="Videos Watched"
            value={videosWatched.toString()}
            subtitle="This month"
          />
          <StatCard
            icon={<FastForward className="text-orange-500" />}
            title="Avg. Skip Speed"
            value={`${averageSkipSpeed.toFixed(1)}x`}
            subtitle="Most used: 2x, 4x"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}

function StatCard({ icon, title, value, subtitle }: StatCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-2">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm text-gray-400">{title}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  );
}