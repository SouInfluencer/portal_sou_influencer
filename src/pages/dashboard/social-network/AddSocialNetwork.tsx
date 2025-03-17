import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SelectPlatform } from './SelectPlatform.tsx';
import { UsernameStep } from './UsernameStep.tsx';
import { CategoriesStep } from './CategoriesStep.tsx';
import { ValidationInstructionsStep } from './ValidationInstructionsStep.tsx';
import { ValidationStep } from './ValidationStep.tsx';
import { ReviewStep } from './ReviewStep.tsx';
import { SuccessStep } from './SuccessStep.tsx';

interface AddSocialNetworkProps {
  onBack: () => void;
}

export function AddSocialNetwork({ onBack }: AddSocialNetworkProps) {
  const [step, setStep] = useState<'select' | 'username' | 'categories' | 'instructions' | 'validation' | 'review' | 'success'>('select');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [postUrl, setPostUrl] = useState('');
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = () => {
    switch (step) {
      case 'select':
        setStep('username');
        break;
      case 'username':
        setStep('categories');
        break;
      case 'categories':
        setStep('instructions');
        break;
      case 'instructions':
        setStep('validation');
        break;
      case 'validation':
        setStep('review');
        break;
      case 'review':
        setStep('success');
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'username':
        setStep('select');
        break;
      case 'categories':
        setStep('username');
        break;
      case 'validation':
        setStep('instructions');
        break;
      case 'instructions':
        setStep('username');
        break;
      case 'review':
        setStep('validation');
        break;
      default:
        onBack();
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 min-h-[44px] px-3 py-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </button>
          </div>
        </div>

        {/* Steps */}
        {step === 'select' && (
          <SelectPlatform
            selectedPlatform={selectedPlatform}
            onPlatformSelect={setSelectedPlatform}
            onNext={handleNext}
          />
        )}

        {step === 'username' && (
          <UsernameStep
            platform={selectedPlatform!}
            username={username}
            onUsernameChange={setUsername}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 'categories' && (
          <CategoriesStep
            platform={selectedPlatform!}
            username={username}
            selectedCategories={selectedCategories}
            onCategoriesSelect={setSelectedCategories}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 'instructions' && (
          <ValidationInstructionsStep
            platform={selectedPlatform!}
            username={username}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 'validation' && (
          <ValidationStep
            platform={selectedPlatform!}
            username={username}
            postUrl={postUrl}
            onPostUrlChange={setPostUrl}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

      {step === 'review' && (
          <ReviewStep
            platform={selectedPlatform!}
            username={username}
            selectedCategories={selectedCategories}
            postUrl={postUrl}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 'success' && (
          <SuccessStep
            platform={selectedPlatform!}
            username={username}
            onFinish={onBack}
          />
        )}
      </div>
    </div>
  );
}