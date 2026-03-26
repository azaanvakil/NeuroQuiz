import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isActive: boolean;
  onTick?: (timeLeft: number) => void;
}

export const Timer = ({ duration, onTimeUp, isActive, onTick }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        onTick?.(newTime);
        
        if (newTime <= 0) {
          onTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp, onTick]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = (timeLeft / duration) * 100;
  const isUrgent = percentage <= 20;
  const isCritical = percentage <= 10;

  return (
    <Card className={cn(
      "transition-all duration-300",
      isCritical && "border-destructive shadow-lg animate-pulse",
      isUrgent && !isCritical && "border-accent"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-center space-x-2">
          <Clock className={cn(
            "w-5 h-5 transition-colors",
            isCritical ? "text-destructive" : isUrgent ? "text-accent" : "text-primary"
          )} />
          <span className={cn(
            "text-lg font-bold tabular-nums transition-colors",
            isCritical ? "text-destructive" : isUrgent ? "text-accent" : "text-foreground"
          )}>
            {formatTime(timeLeft)}
          </span>
        </div>
        
        <div className="mt-3 w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div 
            className={cn(
              "h-2 rounded-full transition-all duration-1000 ease-linear",
              isCritical 
                ? "bg-gradient-to-r from-destructive to-destructive" 
                : isUrgent 
                ? "bg-gradient-to-r from-accent to-accent" 
                : "bg-gradient-to-r from-primary to-primary-glow"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="mt-2 text-center">
          <span className={cn(
            "text-xs font-medium",
            isCritical ? "text-destructive" : isUrgent ? "text-accent" : "text-muted-foreground"
          )}>
            {isActive ? "Time Remaining" : "Timer Paused"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};