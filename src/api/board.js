const boardData = {
  columns: [
    {
      id: 'discovery',
      title: 'Project Discovery',
      rows: [
        { 
          title: 'WIP',
          cards: [
            {
              id: 'card1',
              title: 'Conduct stakeholder interviews for new CRM feature',
              priority: true,
              tags: [{ name: 'Research', color: 'bg-red-100 text-red-600' }],
              date: 'Aug 10'
            },
          ]
        },
        { 
          title: 'Planned',
          cards: [
            {
              id: 'card2',
              title: 'Research competitor CRM features and user feedback',
              tags: [{ name: 'Research', color: 'bg-blue-100 text-blue-600' }],
              date: 'Aug 12'
            }
          ]
        },
        { 
          title: 'Done',
          cards: [
            {
              id: 'card3',
              title: 'Define user personas and journey maps for improved UX',
              tags: [{ name: 'UX', color: 'bg-green-100 text-green-600' }],
              date: 'Aug 14',
              completed: true
            }
          ]
        }
      ]
    },
    {
      id: 'design',
      title: 'Design & Prototyping',
      rows: [
        { 
          title: 'WIP',
          cards: [
            {
              id: 'card4',
              title: 'Sketch initial wireframes for CRM dashboard UI',
              tags: [{ name: 'Design', color: 'bg-purple-100 text-purple-600' }],
              date: 'Aug 15'
            }
          ]
        },
        { 
          title: 'Planned',
          cards: [
            {
              id: 'card5',
              title: 'Create high-fidelity mockups for core CRM functionalities',
              tags: [{ name: 'Design', color: 'bg-purple-100 text-purple-600' }],
              date: 'Aug 18'
            }
          ]
        },
        { title: 'Done', cards: [] }
      ]
    },
    {
      id: 'development',
      title: 'Development Backlog',
      rows: [
        { 
          title: 'WIP',
          cards: [
            {
              id: 'card6',
              title: 'Implement user authentication module (API & UI)',
              tags: [{ name: 'Backend', color: 'bg-yellow-100 text-yellow-700' }],
              date: 'Aug 20'
            }
          ]
        },
        { 
          title: 'Planned',
          cards: [
            {
              id: 'card7',
              title: 'Develop task management features (CRUD operations)',
              tags: [{ name: 'Frontend', color: 'bg-orange-100 text-orange-600' }],
              date: 'Aug 22'
            }
          ]
        },
        { 
          title: 'Done',
          cards: [
            {
              id: 'card8',
              title: 'Integrate external payment gateway for subscription model',
              tags: [{ name: 'Integration', color: 'bg-pink-100 text-pink-600' }],
              date: 'Aug 25'
            }
          ]
        }
      ]
    },
    {
      id: 'testing',
      title: 'Testing & QA',
      rows: [
        { 
          title: 'WIP',
          cards: [
            {
              id: 'card9',
              title: 'Write unit tests for authentication and task APIs',
              tags: [{ name: 'QA', color: 'bg-teal-100 text-teal-600' }],
              date: 'Aug 28'
            }
          ]
        },
        { 
          title: 'Planned',
          cards: [
            {
              id: 'card10',
              title: 'Perform end-to-end testing of CRM workflow',
              tags: [{ name: 'E2E', color: 'bg-indigo-100 text-indigo-600' }],
              date: 'Aug 30'
            }
          ]
        },
        { title: 'Done', cards: [] }
      ]
    },
    {
      id: 'deployment',
      title: 'Deployment',
      rows: [
        { title: 'WIP', cards: [] },
        { title: 'Planned', cards: [] },
        { title: 'Done', cards: [] },
      ]
    }
  ],
  availableTags: [
    { name: 'Research', color: 'bg-red-100 text-red-600' },
    { name: 'UX', color: 'bg-green-100 text-green-600' },
    { name: 'Design', color: 'bg-purple-100 text-purple-600' },
    { name: 'Backend', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Frontend', color: 'bg-orange-100 text-orange-600' },
    { name: 'Integration', color: 'bg-pink-100 text-pink-600' },
    { name: 'QA', color: 'bg-teal-100 text-teal-600' },
    { name: 'E2E', color: 'bg-indigo-100 text-indigo-600' },
  ]
};

export const getBoardData = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(boardData);
    }, 500);
  });
};