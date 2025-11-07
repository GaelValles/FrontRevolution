export const getMinDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0,16);
};

export const validateDates = (fechaInicio, fechaFin) => {
  const now = new Date();
  const inicioDate = new Date(fechaInicio);
  const finDate = new Date(fechaFin);

  if (inicioDate < now) {
    return { isValid: false, error: 'La fecha de inicio no puede ser anterior a la actual' };
  }

  if (finDate <= inicioDate) {
    return { isValid: false, error: 'La fecha de fin debe ser posterior a la fecha de inicio' };
  }

  return { isValid: true };
};