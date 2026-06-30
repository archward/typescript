export const isRealDate = (value: string): boolean => {
  const date = new Date(value);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
};

export const today = (): string => new Date().toISOString().slice(0, 10);
