import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FormData } from './types';

type RegistrationStepProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  onBack: () => void;
  onNext: () => void;
  showProgress?: boolean;
  progressPercentage?: number;
  errors?: Partial<FormData>;
};

const RegistrationStep: React.FC<RegistrationStepProps> = ({
  title,
  description,
  children,
  onBack,
  onNext,
  showProgress = false,
  progressPercentage = 0,
  errors = {}
}) => {
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div>
      {showProgress && (
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-2 text-primary-900">{title}</h1>
      {description && <p className="mb-6 text-gray-600">{description}</p>}

      {children}

      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="btn-outline flex items-center">
          <ArrowLeft size={16} className="ml-1" />
          رجوع
        </button>
        <button 
          onClick={onNext} 
          className={`btn-primary flex items-center ${hasErrors ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={hasErrors}
        >
          التالي
          <ArrowRight size={16} className="mr-1" />
        </button>
      </div>
    </div>
  );
};

export default RegistrationStep;