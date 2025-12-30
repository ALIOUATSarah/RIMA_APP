
import { Project, User, Profile } from './types';

export const PROFILES: Profile[] = [
  { id: 'all', name: 'All Workspaces', icon: '📁' },
  { id: 'p_work', name: 'Work', icon: '💼' },
  { id: 'p_life', name: 'Life', icon: '🏠' },
  { id: 'p_health', name: 'Health', icon: '❤️' },
];

export const SYSTEM_USERS: User[] = [
  { id: 'u_sara', name: 'Sara', avatarColor: 'bg-zinc-200 text-black', role: 'Owner' },
  { id: 'u1', name: 'Alex', avatarColor: 'bg-emerald-500 text-white' },
  { id: 'u2', name: 'Jordan', avatarColor: 'bg-amber-500 text-white' },
  { id: 'u3', name: 'Lina', avatarColor: 'bg-rose-500 text-white' },
  { id: 'u4', name: 'Ali', avatarColor: 'bg-sky-500 text-white' },
  { id: 'u5', name: 'Khaled', avatarColor: 'bg-purple-500 text-white' },
];

const welcomeMessage = (name: string) => ({
  id: 'm1',
  sender: 'Rima' as const,
  content: `Welcome to the ${name} workspace. I've synthesized the latest trip details for your group.`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
});

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'room_trip_main',
    title: 'Europe Trip with the Ladies',
    description: 'Main planning room for 10-day multi-city Europe trip.',
    category: 'LIFE',
    categoryColor: '#22D1EE',
    schedule: 'APR 5–15 2026',
    tags: ['Flights', 'Hotels', 'Itinerary'],
    progress: 30,
    progressExplanation: 'Cities defined; bookings and visas still open.',
    profileId: 'p_life',
    members: [SYSTEM_USERS[0], SYSTEM_USERS[1], SYSTEM_USERS[2], SYSTEM_USERS[3]],
    messages: [welcomeMessage('Europe Trip with the Ladies')],
    budget: '$12,000',
    deadline: '05 Apr',
    phase: 'Planning',
    channels: [
      { id: 'c_itinerary', title: 'Itinerary', description: 'Day-by-day breakdown.', members: [SYSTEM_USERS[0], SYSTEM_USERS[1]], messages: [] },
      { id: 'c_group_chat', title: 'Group Chat', description: 'General discussions.', members: [SYSTEM_USERS[0], SYSTEM_USERS[1], SYSTEM_USERS[2], SYSTEM_USERS[3]], messages: [] },
    ]
  },
  {
    id: 'room_paris',
    title: 'Paris',
    description: 'City plan: 3 nights focused on cafés, museums and shopping.',
    category: 'LIFE',
    categoryColor: '#22D1EE',
    schedule: '3 Nights',
    progress: 45,
    progressExplanation: 'Theme decided; hotel options under review.',
    profileId: 'p_life',
    members: [SYSTEM_USERS[0], SYSTEM_USERS[3]],
    messages: [welcomeMessage('Paris')],
    tags: ['Museums', 'Cafés', 'Shopping'],
    channels: [
      { id: 'c_louvre', title: 'Museums', description: 'Tickets and timing.', members: [SYSTEM_USERS[0]], messages: [] },
    ]
  },
  {
    id: 'room_milan',
    title: 'Milan',
    description: '2-night stay with shopping and a possible lake day.',
    category: 'LIFE',
    categoryColor: '#22D1EE',
    schedule: '2 Nights',
    progress: 40,
    progressExplanation: 'Planning in progress; Noora leading activities.',
    profileId: 'p_life',
    members: [SYSTEM_USERS[0], SYSTEM_USERS[2]],
    messages: [welcomeMessage('Milan')],
    tags: ['Shopping', 'Day Trip', 'Leisure'],
    channels: []
  },
  {
    id: 'room_rome',
    title: 'Rome',
    description: '4-night plan centered on history, food, and walking tours.',
    category: 'LIFE',
    categoryColor: '#22D1EE',
    schedule: '4 Nights',
    progress: 55,
    progressExplanation: 'Structure defined; awaiting hotel confirmation.',
    profileId: 'p_life',
    members: [SYSTEM_USERS[0], SYSTEM_USERS[1], SYSTEM_USERS[2]],
    messages: [welcomeMessage('Rome')],
    tags: ['History', 'Food', 'Tours'],
    channels: []
  },
  {
    id: 'room_bookings',
    title: 'Bookings',
    description: 'Central space for flights, trains, hotels, and visa uploads.',
    category: 'LIFE',
    categoryColor: '#22D1EE',
    schedule: 'APR 2026',
    progress: 25,
    progressExplanation: 'No bookings confirmed yet; cost tracking enabled.',
    profileId: 'p_life',
    members: [SYSTEM_USERS[0]],
    messages: [welcomeMessage('Bookings')],
    tags: ['Flights', 'Hotels', 'Visas'],
    channels: [
      { id: 'c_visas', title: 'Visas', description: 'Document checklist.', members: [SYSTEM_USERS[0]], messages: [] },
    ]
  }
];
