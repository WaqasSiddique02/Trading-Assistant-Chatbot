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
    <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
      <div className="flex items-start gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400 mt-0.5" />
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {loadingSteps[currentStep]?.text}
          </p>
          <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            {progress}% complete
          </p>
        </div>
      </div>
    </Card>
  );
}
