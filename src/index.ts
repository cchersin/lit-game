
const routes = [
      {
        path: 'login',
        component: 'login-page',
        action: async () => {
          await import('./pages/login-page');
        },
      },
      {
        path: 'games',
        component: 'games-page',
        action: async () => {
          await import('./pages/games-page');
        },
      },
      {
        path: 'games-archive',
        component: 'games-archive-page',
        action: async () => {
          await import('./pages/games-archive-page');
        },
      },
      {
        path: 'game',
        component: 'game-page',
        action: async () => {
          await import('./pages/game-page');
        },
      },
      {
        path: 'starting',
        component: 'starting-page',
        action: async () => {
          await import('./pages/starting-page');
        },
      },      
      {
        path: 'winner',
        component: 'winner-page',
        action: async () => {
          await import('./pages/winner-page');
        },
      }, 
      {
        path: 'players',
        component: 'players-page',
        action: async () => {
          await import('./pages/players-page');
        },
      },
      {
        path: 'favorites',
        component: 'favorites-page',
        action: async () => {
          await import('./pages/favorites-page');
        },
      },
      {
        path: 'ranking',
        component: 'ranking-page',
        action: async () => {
          await import('./pages/ranking-page');
        },
      },
      {
        path: 'chat',
        component: 'chat-page',
        action: async () => {
          await import('./pages/chat-page');
        },
      }
    ];

export { routes }