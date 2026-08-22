import { apiRequest, createAuthHeaders } from './api.js';

export const submissionConfig = {
  company: {
    label: 'Company',
    title: 'Suggest a Company',
    description: 'Share a company that belongs in the Nepal technology directory.',
    fields: [
      { key: 'name', label: 'Company name', required: true },
      { key: 'country', label: 'Country' },
      { key: 'address', label: 'Address' },
      { key: 'home_page', label: 'Home page URL', type: 'url' },
      { key: 'career_page', label: 'Career page URL', type: 'url' },
    ],
  },
  opportunity: {
    label: 'Opportunity',
    title: 'Suggest an Opportunity',
    description: 'Share a program or pathway that should be visible to the ecosystem.',
    fields: [
      { key: 'name', label: 'Opportunity name', required: true },
      { key: 'description', label: 'Description', component: 'textarea', maxLength: 200, required: true },
      { key: 'company_id', label: 'Company ID (optional)' },
      { key: 'organizer_url', label: 'Official organizer URL', type: 'url' },
      { key: 'opportunity_type', label: 'Opportunity type', component: 'select', options: ['internship', 'fellowship', 'bootcamp', 'traineeship', 'apprenticeship'] },
      { key: 'work_mode', label: 'Work mode', component: 'select', options: ['onsite', 'remote', 'hybrid'] },
      { key: 'incentivized', label: 'Incentivized opportunity', component: 'checkbox' },
    ],
  },
  event: {
    label: 'Event',
    title: 'Suggest an Event',
    description: 'Share a technology event or meetup with the community.',
    fields: [
      { key: 'title', label: 'Event title', required: true },
      { key: 'description', label: 'Description', component: 'textarea', maxLength: 200, required: true },
      { key: 'organizer_url', label: 'Official organizer URL', type: 'url' },
      { key: 'event_type', label: 'Event type', component: 'select', options: ['hackathon', 'conference', 'meetup', 'workshop', 'tech_talk', 'webinar'] },
      { key: 'format', label: 'Event format', component: 'select', options: ['online', 'onsite', 'hybrid'] },
    ],
  },
  community: {
    label: 'Community',
    title: 'Suggest a Community',
    description: 'Share a Nepali technology community that people should know about.',
    fields: [
      { key: 'name', label: 'Community name', required: true },
      { key: 'description', label: 'Description', component: 'textarea', maxLength: 200 },
      { key: 'discord_url', label: 'Discord URL', type: 'url' },
    ],
  },
};

export function buildSubmissionData(type, values) {
  if (type === 'company') {
    const { home_page: homePage, career_page: careerPage, ...companyValues } = values;
    return { ...companyValues, websites: { home_page: homePage || null, career_page: careerPage || null } };
  }

  if (type === 'opportunity') {
    const { opportunity_type: opportunityType, incentivized, work_mode: workMode, ...opportunityValues } = values;
    if (!opportunityValues.company_id) delete opportunityValues.company_id;
    return { ...opportunityValues, details: { type: opportunityType || null, incentivized: Boolean(incentivized), work_mode: workMode || null } };
  }

  if (type === 'event') {
    const { event_type: eventType, format, ...eventValues } = values;
    return { ...eventValues, event_type: { type: eventType || null, format: format || null } };
  }

  return values;
}

export function submitSuggestion(type, values, session) {
  return apiRequest('/api/submissions', {
    method: 'POST',
    headers: createAuthHeaders(session),
    body: JSON.stringify({ type, data: buildSubmissionData(type, values) }),
  });
}
