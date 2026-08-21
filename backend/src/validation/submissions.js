export const submissionTypes = ['company', 'opportunity', 'event', 'community'];

export function validateSubmission(type, data) {
  const requiredText = type === 'event' ? data.title : data.name;
  if (typeof requiredText !== 'string' || !requiredText.trim()) return 'A name or title is required.';
  if (['opportunity', 'event'].includes(type) && typeof data.description !== 'string') return 'A description is required.';
  if (typeof data.description === 'string' && data.description.length > 200) return 'Description must be 200 characters or fewer.';
  return null;
}
