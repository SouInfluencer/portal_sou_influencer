import React from 'react';
import InputMask from 'react-input-mask';

interface MaskedInputProps {
  mask: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
}

export function MaskedInput({ mask, id, value, onChange, placeholder, error }: MaskedInputProps) {
  return (
    <InputMask
      mask={mask}
      value={value}
      onChange={onChange}
      maskChar={null}
      className={`block w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400 hover:bg-white focus:bg-white transform hover:translate-y-[-1px] ${
        error
          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
      }`}
      placeholder={placeholder}
      id={id}
    />
  );
}