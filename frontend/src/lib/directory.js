export const directoryConfig = {
  companies: {
    label: 'Directory',
    title: 'Companies',
    description: 'Explore technology companies operating in Nepal.',
    empty: 'No companies have been published yet.',
    fields: (item) => [item.country, item.address].filter(Boolean),
    link: (item) => item.websites?.home_page,
  },
  opportunities: {
    label: 'Career pathways',
    title: 'Opportunities',
    description: 'Find published programs and opportunities from the ecosystem.',
    empty: 'No opportunities have been published yet.',
    fields: (item) => [item.details?.type, item.details?.work_mode].filter(Boolean),
    link: (item) => item.organizer_url,
  },
  events: {
    label: 'Gatherings',
    title: 'Events',
    description: 'Keep up with published technology events and meetups.',
    empty: 'No events have been published yet.',
    fields: (item) => [item.event_type?.type, item.event_type?.format].filter(Boolean),
    link: (item) => item.organizer_url,
  },
  communities: {
    label: 'Connect',
    title: 'Communities',
    description: 'Discover useful Nepali technology communities.',
    empty: 'No communities have been published yet.',
    fields: () => [],
    link: (item) => item.discord_url,
  },
};
