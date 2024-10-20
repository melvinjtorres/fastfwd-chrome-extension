import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Cog, Shield, FileText, MessageSquare, AlertTriangle, ChevronRight } from 'lucide-react';

interface SettingsProps {
  defaultSkipSpeed: number;
  setDefaultSkipSpeed: (value: number) => void;
  autoSkipAds: boolean;
  setAutoSkipAds: (value: boolean) => void;
  disableOnNonVideo: boolean;
  setDisableOnNonVideo: (value: boolean) => void;
}

export function Settings({
  defaultSkipSpeed,
  setDefaultSkipSpeed,
  autoSkipAds,
  setAutoSkipAds,
  disableOnNonVideo,
  setDisableOnNonVideo
}: SettingsProps) {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center space-x-2">
        <Cog className="text-orange-500" />
        <h2 className="text-xl font-bold">fastfwd Settings</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400">Default Skip Speed</label>
          <div className="flex items-center space-x-2">
            <Slider
              value={[defaultSkipSpeed]}
              onValueChange={(value) => setDefaultSkipSpeed(value[0])}
              min={1}
              max={16}
              step={0.1}
              className="flex-grow"
            />
            <span className="text-sm font-medium">{defaultSkipSpeed.toFixed(1)}x</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="text-orange-500" />
            <span>Auto-skip Ads</span>
          </div>
          <Switch checked={autoSkipAds} onCheckedChange={setAutoSkipAds} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="text-orange-500" />
            <span>Disable on non-video pages</span>
          </div>
          <Switch checked={disableOnNonVideo} onCheckedChange={setDisableOnNonVideo} />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-400">Information</h3>
        <Button variant="ghost" className="w-full justify-between text-white hover:text-orange-500 hover:bg-gray-800">
          <div className="flex items-center space-x-2">
            <Shield className="text-orange-500" />
            <span>Privacy Policy</span>
          </div>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" className="w-full justify-between text-white hover:text-orange-500 hover:bg-gray-800">
          <div className="flex items-center space-x-2">
            <FileText className="text-orange-500" />
            <span>Terms and Conditions</span>
          </div>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-400">Feedback & Support</h3>
        <Button variant="ghost" className="w-full justify-between text-white hover:text-orange-500 hover:bg-gray-800">
          <div className="flex items-center space-x-2">
            <MessageSquare className="text-orange-500" />
            <span>Send Feedback</span>
          </div>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" className="w-full justify-between text-white hover:text-orange-500 hover:bg-gray-800">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-orange-500" />
            <span>Report an Issue</span>
          </div>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Button variant="destructive" className="w-full bg-orange-500 hover:bg-orange-600">
        Reset All Settings
      </Button>

      <div className="text-center text-xs text-gray-500">
        fastfwd v1.0.0
      </div>
    </div>
  );
}
