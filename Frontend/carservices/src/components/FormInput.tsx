import React from 'react';
import { LucideIcon } from 'lucide-react';

type FormInputProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  icon?: LucideIcon;
  as?: 'input' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
  dir?: 'rtl' | 'ltr';
};

const FormInput: React.FC<FormInputProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  icon: Icon,
  as = 'input',
  options = [],
  dir = 'rtl'
}) => {
  const commonClasses = `form-input ${error ? 'border-red-500' : ''} ${dir}`;
  
  const renderInput = () => {
    switch (as) {
      case 'textarea':
        return (
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className={`${commonClasses} min-h-[100px]`}
            placeholder={placeholder}
            dir={dir}
          />
        );
      
      case 'select':
        return (
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className={commonClasses}
            dir={dir}
          >
            <option value="" disabled>{placeholder}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className={commonClasses}
            placeholder={placeholder}
            dir={dir}
          />
        );
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <div className="relative">
        {renderInput()}
        {Icon && <Icon className="form-icon" size={20} />}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;