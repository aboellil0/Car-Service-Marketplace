import React from 'react';
import { UserCircle } from 'lucide-react';
import { FormData } from '../types';
import FormInput from '../FormInput';
import RegistrationStep from '../RegistrationStep';

type UsernameStepProps = {
  formData: FormData;
  errors: Partial<FormData>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onNext: () => void;
  onBack: () => void;
};

const UsernameStep: React.FC<UsernameStepProps> = ({
  formData,
  errors,
  onChange,
  onNext,
  onBack
}) => {
  return (
    <RegistrationStep
      title="الخطوة 1: اسم المستخدم"
      description="يرجى كتابة اسم تختاره لحسابك."
      onNext={onNext}
      onBack={onBack}
      errors={errors}
      showProgress
      progressPercentage={20}
    >
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-yellow-700">
          <strong>تنبيه هام:</strong> يجب كتابة اسم المستخدم بالحروف الإنجليزية ويجب أن يحتوي على رقم واحد على الأقل. احفظ اسم المستخدم جيداً لأنك ستحتاجه لتسجيل الدخول لاحقاً.
        </p>
      </div>

      <FormInput
        id="username"
        name="username"
        label="اسم المستخدم (بالإنجليزية فقط)"
        value={formData.username}
        onChange={onChange}
        error={errors.username}
        placeholder="Enter username here"
        icon={UserCircle}
        dir="ltr"
      />
    </RegistrationStep>
  );
};

export default UsernameStep;