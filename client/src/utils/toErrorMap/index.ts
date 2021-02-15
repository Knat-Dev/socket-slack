export interface FieldError {
  field: string;
  message: string;
}

export const toErrorMap = (errors: FieldError[]): Record<string, string> => {
  const errorMap: Record<string, string> = {};

  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });

  return errorMap;
};
