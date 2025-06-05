import React from 'react';
import { MapPin } from 'lucide-react';
import { FormData } from '../types';
import FormInput from '../FormInput';
import RegistrationStep from '../RegistrationStep';

type CityStepProps = {
  formData: FormData;
  errors: Partial<FormData>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onNext: () => void;
  onBack: () => void;
  cities: string[];
};

const CityStep: React.FC<CityStepProps> = ({
  formData,
  errors,
  onChange,
  onNext,
  onBack,
  cities
}) => {
  return (
    <RegistrationStep
      title={formData.userType === 'workshop' ? 'المدينة' : 'الخطوة 4 من 4: مدينتك'}
      description={
        formData.userType === 'workshop'
          ? 'يرجى اختيار المدينة التي تقع فيها ورشتك.'
          : 'يرجى اختيار المدينة التي تسكن بها.'
      }
      onNext={onNext}
      onBack={onBack}
      errors={errors}
      showProgress
      progressPercentage={100}
    >
      <FormInput
        id="city"
        name="city"
        label="المدينة"
        value={formData.city}
        onChange={onChange}
        error={errors.city}
        placeholder="اختر المدينة"
        icon={MapPin}
        as="select"
        options={cities.map(city => ({ value: city, label: city }))}
      />
    </RegistrationStep>
  );
};

export default CityStep;