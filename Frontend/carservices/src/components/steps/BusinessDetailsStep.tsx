import React from 'react';
import { Building2, MapPin, Link } from 'lucide-react';
import { FormData } from '../types';
import FormInput from '../FormInput';
import RegistrationStep from '../RegistrationStep';

type BusinessDetailsStepProps = {
  formData: FormData;
  errors: Partial<FormData>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onNext: () => void;
  onBack: () => void;
  states: string[];
};

const BusinessDetailsStep: React.FC<BusinessDetailsStepProps> = ({
  formData,
  errors,
  onChange,
  onNext,
  onBack,
  states
}) => {
  return (
    <RegistrationStep
      title="معلومات الورشة"
      description="يرجى إدخال معلومات ورشتك."
      onNext={onNext}
      onBack={onBack}
      errors={errors}
      showProgress
      progressPercentage={80}
    >
      <FormInput
        id="businessName"
        name="businessName"
        label="اسم الورشة"
        value={formData.businessName || ''}
        onChange={onChange}
        error={errors.businessName}
        placeholder="ادخل اسم الورشة"
        icon={Building2}
      />

      <FormInput
        id="address"
        name="address"
        label="عنوان الورشة"
        value={formData.address || ''}
        onChange={onChange}
        error={errors.address}
        placeholder="ادخل العنوان التفصيلي للورشة"
        as="textarea"
      />

      <FormInput
        id="state"
        name="state"
        label="المنطقة"
        value={formData.state || ''}
        onChange={onChange}
        error={errors.state}
        placeholder="اختر المنطقة"
        icon={MapPin}
        as="select"
        options={states.map(state => ({ value: state, label: state }))}
      />

      <FormInput
        id="mapLink"
        name="mapLink"
        label="رابط الموقع على الخريطة (اختياري)"
        value={formData.mapLink || ''}
        onChange={onChange}
        placeholder="https://maps.google.com/..."
        icon={Link}
        dir="ltr"
      />
    </RegistrationStep>
  );
};

export default BusinessDetailsStep;