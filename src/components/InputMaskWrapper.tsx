import React, { forwardRef } from 'react';
import InputMask from 'react-input-mask';

interface InputMaskWrapperProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const InputMaskWrapper = forwardRef<HTMLInputElement, InputMaskWrapperProps>(
  function InputMaskWrapper({ mask, value, onChange, className, ...props }, ref) {
    return (
      <InputMask
        mask={mask}
        value={value}
        onChange={onChange}
        {...props}
      >
        {() => (
          <input
            ref={ref}
            className={className}
            {...props}
          />
        )}
      </InputMask>
    );
  }
);