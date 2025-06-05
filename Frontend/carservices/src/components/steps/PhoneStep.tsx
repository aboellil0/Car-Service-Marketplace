import React from 'react';
import { Phone } from 'lucide-react';
import { FormData } from '../types';
import FormInput from '../FormInput';
import RegistrationStep from '../RegistrationStep';

type PhoneStepProps = {
  formData: FormData;
  errors: Partial<FormData>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onNext: () => void;
  onBack: () => void;
};

const PhoneStep: React.FC<PhoneStepProps> = ({
  formData,
  errors,
  onChange,
  onNext,
  onBack
}) => {
  return (
    <RegistrationStep
      title="الخطوة 3: رقم الهاتف"
      description="يرجى كتابة رقم هاتفك للتواصل معك."
      onNext={onNext}
      onBack={onBack}
      errors={errors}
      showProgress
      progressPercentage={60}
    >
      <FormInput
        id="phone"
        name="phone"
        type="tel"
        label="رقم الهاتف"
        value={formData.phone}
        onChange={onChange}
        error={errors.phone}
        placeholder="ادخل رقم الهاتف هنا"
        icon={Phone}
      />
    </RegistrationStep>
  );
};

export default PhoneStep;