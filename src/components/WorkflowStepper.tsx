import React from 'react';
import { cn } from '../lib/utils';
import { WORKFLOW_STAGES } from '../types';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface WorkflowStepperProps {
  currentStageId: number;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({ currentStageId }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Case Journey</h3>
      <div className="relative">
        {(WORKFLOW_STAGES || []).map((stage, index) => {
          const isCompleted = stage.id < currentStageId;
          const isCurrent = stage.id === currentStageId;
          
          return (
            <div key={stage.id} className="flex items-start gap-3 mb-6 last:mb-0 relative">
              {index !== (WORKFLOW_STAGES || []).length - 1 && (
                <div 
                  className={cn(
                    "absolute left-[9px] top-[22px] w-[2px] h-[calc(100%+8px)]",
                    isCompleted ? "bg-blue-500" : "bg-gray-200"
                  )}
                />
              )}
              
              <div className="relative z-10 mt-1">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-500 bg-white" />
                ) : isCurrent ? (
                  <Clock className="w-5 h-5 text-blue-600 bg-white animate-pulse" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 bg-white" />
                )}
              </div>
              
              <div className="flex flex-col">
                <span className={cn(
                  "text-sm font-semibold",
                  isCurrent ? "text-blue-700 underline underline-offset-4 decoration-2" : 
                  isCompleted ? "text-gray-700" : "text-gray-400"
                )}>
                  {stage?.name}
                </span>
                <span className="text-[10px] text-gray-400 font-medium uppercase">
                  {stage?.dept}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
