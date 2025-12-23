'use client';

import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Loader2 } from 'lucide-react';

const loadingSteps = [
  { text: 'Connecting to trading bot...', duration: 1000 },
  { text: 'Fetching market data...', duration: 2000 },
  { text: 'Analyzing news data...', duration: 2500 },
  { text: 'Fetching past user trends...', duration: 3000 },
  { text: 'Processing request...', duration: 4000 },
  { text: 'Generating response...', duration: 5000 },
];

export function LoadingMessage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const currentDuration = loadingSteps[currentStep]?.duration || 1000;
    const stepProgress = (progress / 100) * 6000;
    
    let newStep = 0;
    let accumulatedDuration = 0;
    
    for (let i = 0; i < loadingSteps.length; i++) {
      accumulatedDuration += loadingSteps[i].duration;
      if (stepProgress < accumulatedDuration) {
        newStep = i;
        break;
      }
      newStep = i;
    }
    
    setCurrentStep(Math.min(newStep, loadingSteps.length - 1));
  }, [progress]);

  return (
    <div className="flex gap-2 sm:gap-3">
      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 text-white animate-spin" />
      </div>
      <Card className="flex-1 p-3 sm:p-4 bg-white border-gray-200 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-700 font-medium">
              {loadingSteps[currentStep]?.text}
            </p>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Step {currentStep + 1} of {loadingSteps.length}
            </p>
            <p className="text-xs text-gray-500">
              {progress}%
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
