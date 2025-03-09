import React from 'react';
import { BarChart2 } from 'lucide-react';
import type { Campaign } from '../../../../types';
import { getStepDetails } from '../utils';

interface StepMetricsProps {
  step: string;
  campaign: Campaign;
}

export function StepMetrics({ step, campaign }: StepMetricsProps) {
  const stepDetails = getStepDetails(step, campaign);
  
  if (!stepDetails) return null;

  return (
    <div className="grid grid-cols-3 gap-4">
      {stepDetails.metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-xl p-4 border border-gray-200/80 hover:border-indigo-200 transition-all duration-200">
          <div className="flex items-center justify-between mb-2">
            <metric.icon className={`h-5 w-5 ${metric.color || 'text-gray-400'}`} />
            <BarChart2 className="h-4 w-4 text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-900">{metric.value}</p>
          <p className="text-xs text-gray-500">{metric.label}</p>
        </div>
      ))}
    </div>
  );
}