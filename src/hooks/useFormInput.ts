import React, { useState } from 'react';

interface ChangeableInput<T> {
  value: T;
  onChange: (event: React.ChangeEvent<any>) => void;
}

export function useFormInput<T>(initialValue: T): ChangeableInput<T> {
  const [value, setValue] = useState<T>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (event && event.target) {
      setValue(event.target.value as unknown as T);
    } else {
      setValue("" as unknown as T); // Resetting to an empty string if event is not as expected
    }
  };

  return {
    value,
    onChange: handleChange,
  };
}

export default useFormInput;
