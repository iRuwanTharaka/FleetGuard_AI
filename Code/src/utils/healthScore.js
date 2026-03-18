export const healthColor = (score) => {
  if (score >= 80) return '#70AD47';
  if (score >= 60) return '#FFC000';
  return '#C00000';
};

export const healthLabel = (score) => {
  if (score >= 80) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Poor';
};

export const healthFromDamages = (damages) => {
  const deductions = { low: 5, medium: 15, high: 30 };
  const total = (damages || []).reduce((acc, d) => acc + (deductions[d.severity] || 5), 0);
  return Math.max(100 - total, 0);
};
