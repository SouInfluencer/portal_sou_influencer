import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { Campaign } from '../../../../types';
import { getStepDetails } from '../utils';

interface NextActionProps {
  step: string;
  campaign: Campaign;
  onAction: () => void;
}

export function NextAction({ step, campaign, onAction }: NextActionProps) {
  const stepDetails = getStepDetails(step, campaign);
  
  if (!stepDetails) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-xl border border-indigo-100/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-indigo-600 mr-2" />
          <h3 className="text-sm font-medium text-indigo-900">{stepDetails.nextAction.title}</h3>
        </div>
      </div>
      <p className="text-base text-indigo-700 mb-6">
        {stepDetails.nextAction.description}
      </p>
      <button
        onClick={onAction}
        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {stepDetails.nextAction.buttonText}
        <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </div>
  );
}