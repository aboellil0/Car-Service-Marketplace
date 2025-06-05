import React from 'react';
import { Lock } from 'lucide-react';
import { FormData } from '../types';
import FormInput from '../FormInput';
import RegistrationStep from '../RegistrationStep';

type PasswordStepProps = {
  formData: FormData;
  errors: Partial<FormData>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onNext: () => void;
  onBack: () => void;
};

const PasswordStep: React.FC<PasswordStepProps> = ({
  formData,
  errors,
  onChange,
  onNext,
  onBack
}) => {
  return (
    <RegistrationStep
      title="الخطوة 2: كلمة المرور"
      description="يرجى كتابة كلمة سر قوية لحسابك."
      onNext={onNext}
      onBack={onBack}
      errors={errors}
      showProgress
      progressPercentage={40}
    >
      <FormInput
        id="password"
        name="password"
        type="password"
        label="كلمة المرور"
        value={formData.password}
        onChange={onChange}
        error={errors.password}
        placeholder="ادخل كلمة السر هنا"
        icon={Lock}
      />
      
      <FormInput
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="تأكيد كلمة المرور"
        value={formData.confirmPassword}
        onChange={onChange}
        error={errors.confirmPassword}
        placeholder="أعد كتابة كلمة السر للتأكيد"
        icon={Lock}
      />
    </RegistrationStep>
  );
};

export default PasswordStep;