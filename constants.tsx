import { Project, User, Profile, Message } from './types';

export const PROFILES: Profile[] = [
  { id: 'all', name: 'All Workspaces', icon: '📁' },
  { id: 'p_work', name: 'Work', icon: '💼' },
  { id: 'p_life', name: 'Life', icon: '🏠' },
  { id: 'p_edu', name: 'Education', icon: '🎓' },
];

export const SYSTEM_USERS: User[] = [
  { id: 'u_sara', name: 'Sara', avatarColor: 'bg-zinc-200 text-black', role: 'Owner' },
  { id: 'u1', name: 'Alex', avatarColor: 'bg-emerald-500 text-white', role: 'Ops Lead' },
  { id: 'u2', name: 'Jordan', avatarColor: 'bg-amber-500 text-white', role: 'Vendor Manager' },
  { id: 'u3', name: 'Lina', avatarColor: 'bg-rose-500 text-white', role: 'Designer' },
  { id: 'u4', name: 'Ali', avatarColor: 'bg-sky-500 text-white', role: 'Supplier' },
  { id: 'u5', name: 'Khaled', avatarColor: 'bg-purple-500 text-white', role: 'Developer' },
  { id: 'u6', name: 'Maryam', avatarColor: 'bg-pink-500 text-white' },
  { id: 'u7', name: 'Noora', avatarColor: 'bg-orange-500 text-white' },
  { id: 'u8', name: 'Hind', avatarColor: 'bg-blue-500 text-white' },
];

const createMsg = (sender: User | 'Rima', content: string, timeOffset: number = 0): Message => ({
  id: `m_${Date.now()}_${Math.random()}`,
  sender,
  content,
  timestamp: new Date(Date.now() - (timeOffset * 60000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
});

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Euro Trip 2026',
    description: '10-day multi-city trip with the ladies. Organizing Paris, Milan, and Rome.',
    theme: 'sky',
    profileId: 'p_life',
    progress: 35,
    lastActivity: 'Draft plan for Rome created',
    members: [SYSTEM_USERS[0], SYSTEM_USERS[6], SYSTEM_USERS[7], SYSTEM_USERS[8]],
    messages: [
      createMsg(SYSTEM_USERS[0], "Hey ladies! April Europe trip is officially happening 🇪🇺✨", 120),
      createMsg(SYSTEM_USERS[6], "Finally!! I'm so excited 😭", 115),
      createMsg(SYSTEM_USERS[7], "10 days right? We said April but not exact dates yet.", 110),
      createMsg(SYSTEM_USERS[8], "Can we do Paris + Milan + Rome? Dream combo.", 105),
      createMsg(SYSTEM_USERS[0], "Yes! I'm adding RIMA here to help us organize because my brain can't handle this 😂 @RIMA we're planning a 10-day Europe trip in April 2026.", 100),
      createMsg('Rima', "Love this plan ✨ I can help you keep everything organized. Since you mentioned multiple cities, would you like me to create city rooms (Paris, Milan, Rome) and one room for bookings?", 95),
      createMsg(SYSTEM_USERS[0], "Yes please, do it.", 90),
      createMsg('Rima', "✅ Done. I've created the rooms. We'll keep this main room for general planning and decisions.", 85),
    ],
    channels: [
      { 
        id: 'c1', 
        title: 'Paris', 
        description: 'Style: relaxed, museums, cafés, shopping.', 
        members: [SYSTEM_USERS[0], SYSTEM_USERS[6], SYSTEM_USERS[7]], 
        messages: [
          createMsg(SYSTEM_USERS[0], "Okay Paris girls 🇫🇷 How many days should we stay?", 60),
          createMsg(SYSTEM_USERS[6], "At least 3 nights. I want museums + cafés.", 55),
          createMsg(SYSTEM_USERS[7], "Same. And shopping.", 50),
          createMsg(SYSTEM_USERS[8], "And no rushing please 😂", 45),
          createMsg('Rima', "📍 Paris (Draft Plan)\n• Duration: 3 nights\n• Style: relaxed, museums, cafés, shopping", 40),
        ] 
      },
      { id: 'c2', title: 'Milan', description: 'Shopping + lake day.', members: [SYSTEM_USERS[0], SYSTEM_USERS[7]], messages: [] },
      { id: 'c3', title: 'Bookings', description: 'Flights, Hotels, and Documents.', members: [SYSTEM_USERS[0]], messages: [] },
    ]
  },
  {
    id: 'p3',
    title: 'Dubai Reefs',
    description: 'Environmental operations and survey management hub.',
    theme: 'rust',
    profileId: 'p_work',
    progress: 68,
    lastActivity: 'Site deployment timeline updated',
    members: [SYSTEM_USERS[0], SYSTEM_USERS[1], SYSTEM_USERS[2], SYSTEM_USERS[4]],
    messages: [
      createMsg(SYSTEM_USERS[1], "Morning everyone, deployment timeline for Phase 1 is getting tight.", 200),
      createMsg(SYSTEM_USERS[4], "We still haven’t finalized the reef module locations. We need updated bathymetry.", 195),
      createMsg(SYSTEM_USERS[2], "Also, FYI, the fabrication vendor needs confirmation by end of week or pricing changes.", 190),
      createMsg(SYSTEM_USERS[0], "Okay... one thing at a time please 😂 @RIMA can you capture the open items from today?", 185),
      createMsg('Rima', "Captured so far:\n1. Reef module locations pending bathymetry update\n2. Fabrication pricing confirmation deadline — end of week\n3. Phase 1 deployment timeline at risk", 180),
    ],
    budget: '$450k',
    deadline: '12 Dec',
    phase: 'Surveying',
    channels: [
      { id: 'c7', title: 'Site Deployment', description: 'Deep sea mapping and data points.', members: [SYSTEM_USERS[0], SYSTEM_USERS[1], SYSTEM_USERS[4]], unreadCount: 2, messages: [
        createMsg(SYSTEM_USERS[4], "We need the updated bathymetric survey before we lock coordinates.", 30),
        createMsg(SYSTEM_USERS[1], "Survey team said “early next week” but no exact date.", 25),
        createMsg(SYSTEM_USERS[0], "@RIMA when was the last time they gave us a firm date?", 20),
        createMsg('Rima', "Last confirmed update from the survey team was 12 days ago, with “early next week” mentioned twice since then without a date.", 15),
      ] },
      { id: 'c8', title: 'Permits', description: 'Legal and regulatory documents.', isPrivate: true, members: [SYSTEM_USERS[0]], messages: [] },
      { id: 'c9', title: 'Vendors', description: 'Logistics and on-site scheduling.', members: [SYSTEM_USERS[0], SYSTEM_USERS[2]], messages: [
        createMsg(SYSTEM_USERS[2], "Fabrication cost might increase 8–10% if we don’t confirm quantities by Friday.", 10),
      ] },
    ]
  },
  {
    id: 'p5',
    title: 'Jewelry Startup',
    description: 'Design and supply chain workspace for brand launch.',
    theme: 'gold',
    profileId: 'p_work',
    progress: 42,
    lastActivity: 'Material comparison requested',
    members: [SYSTEM_USERS[0], SYSTEM_USERS[3], SYSTEM_USERS[4], SYSTEM_USERS[5]],
    messages: [
      createMsg(SYSTEM_USERS[0], "Okay RIMA… I feel like I’m doing 10 jobs at the same time 😵‍💫", 300),
      createMsg('Rima', "That’s normal at this stage. I can help you keep things clear. Would you like me to organize work into focused rooms with the people involved?", 295),
      createMsg(SYSTEM_USERS[0], "Yes please. I’m losing track already.", 290),
      createMsg('Rima', "Based on what you’re working on, I suggest: Suppliers & Materials, Design & Collection, Website & Operations.", 285),
    ],
    budget: '$25k',
    deadline: '01 Jun',
    phase: 'Branding',
    channels: [
      { id: 'c12', title: 'Suppliers', description: 'Contact list and vendor quotes.', members: [SYSTEM_USERS[0], SYSTEM_USERS[4], SYSTEM_USERS[3]], messages: [
        createMsg(SYSTEM_USERS[4], "We can do gold-plated brass, MOQ 100 pieces per design.", 50),
        createMsg(SYSTEM_USERS[3], "I’m worried about tarnishing. Can we test samples?", 45),
        createMsg(SYSTEM_USERS[0], "Ali, how long for samples?", 40),
        createMsg(SYSTEM_USERS[4], "About 10 days.", 35),
        createMsg('Rima', "Noted: Material option gold-plated brass, MOQ 100, lead time 10 days. Sara, this may impact your planned launch window.", 30),
      ] },
      { id: 'c13', title: 'Design', description: 'CAD files and material moodboards.', members: [SYSTEM_USERS[0], SYSTEM_USERS[3]], unreadCount: 12, messages: [] },
    ]
  },
  {
    id: 'p2',
    title: 'Family Hub',
    description: 'Coordinating schedules and school life for the kids.',
    theme: 'emerald',
    profileId: 'p_life',
    progress: 90,
    lastActivity: 'Schedule updated for Weekend',
    members: [SYSTEM_USERS[0]],
    messages: [
      createMsg(SYSTEM_USERS[0], "Good morning RIMA ☕ I feel like this week is going to be crazy.", 400),
      createMsg('Rima', "Good morning Sara 🌸 Here’s a quick overview for this week:\n• Omar: Math exam Thursday\n• Hessa: Science project due Wednesday\n• Salem: School trip Tuesday\nYou have 2 overlapping items on Wednesday afternoon.", 395),
    ],
    channels: [
      { id: 'c4', title: 'Schedules', description: 'Family calendar integration.', members: [SYSTEM_USERS[0]], messages: [] },
      { id: 'c5', title: 'Omar', description: 'High school, football, exams.', members: [SYSTEM_USERS[0]], unreadCount: 5, messages: [
        createMsg(SYSTEM_USERS[0], "Hey Omar, how’s school going this week?", 20),
        createMsg('Rima', "Omar, according to your schedule: Math exam Thursday. You studied Math for 30 minutes on Sunday. Would you like me to help you plan short study sessions around football?", 15),
      ] },
      { id: 'c6', title: 'Hessa', description: 'Middle school, creative, easily stressed.', members: [SYSTEM_USERS[0]], messages: [] },
    ]
  },
  {
    id: 'p4',
    title: 'My Health',
    description: 'Private health companion and workout log.',
    theme: 'rose',
    profileId: 'p_life',
    progress: 100,
    lastActivity: 'Exercise summary for November generated',
    members: [SYSTEM_USERS[0]],
    messages: [
      createMsg(SYSTEM_USERS[0], "Did a 40-minute walk today. Felt good but a bit tired at the end.", 50),
      createMsg('Rima', "Logged ✅ 40-minute walk — moderate intensity. Noted: fatigue at the end.", 45),
      createMsg(SYSTEM_USERS[0], "Uploading my blood test results.", 10),
      createMsg('Rima', "Thanks, Sara. I’ve reviewed your report. Key notes: Vitamin D slightly below optimal, Iron within normal, Cholesterol stable. I'll flag any patterns between low energy and workout intensity.", 5),
    ],
    channels: []
  }
];
