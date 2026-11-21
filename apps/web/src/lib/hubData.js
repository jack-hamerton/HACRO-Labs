import pb from '@/lib/pocketbaseClient';

export const HUB_COLLECTIONS = {
  areas: 'hub_areas',
  preferences: 'hub_member_preferences',
  stakeholders: 'hub_stakeholders',
  projects: 'hub_projects',
  collaborations: 'hub_collaborations',
  assessments: 'hub_assessments',
  responses: 'hub_assessment_responses',
  outcomes: 'hub_outcomes',
};

export const getMemberHomeArea = (member) => String(member?.hub_area || member?.location || '').trim();

export const getHubAreaOptions = (areas, member) => {
  const options = new Map();
  for (const area of areas || []) {
    const value = String(area.location || area.name || '').trim();
    if (value) options.set(value.toLowerCase(), { value, record: area });
  }
  const homeArea = getMemberHomeArea(member);
  if (homeArea && !options.has(homeArea.toLowerCase())) {
    options.set(homeArea.toLowerCase(), { value: homeArea, record: null });
  }
  return [...options.values()].sort((a, b) => a.value.localeCompare(b.value));
};

export const readHubCollection = async (name, options = {}) => {
  return pb.collection(name).getFullList({ sort: '-created', $autoCancel: false, ...options });
};

export const isHubSchemaMissing = (error) => error?.status === 404 || error?.response?.code === 404;
