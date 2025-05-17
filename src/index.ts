
const routes = [
      {
        path: 'login',
        component: 'user-login',
        action: async () => {
          await import('./login');
        },
      },
      {
        path: 'game',
        component: 'game-main',
        action: async () => {
          await import('./game-main');
        },
      },
      {
        path: 'starting',
        component: 'starting-page',
        action: async () => {
          await import('./starting-page');
        },
      },      
      {
        path: 'winner',
        component: 'winner-page',
        action: async () => {
          await import('./winner-page');
        },
      }, 
      {
        path: 'player-list',
        component: 'player-list',
        action: async () => {
          await import('./player-list');
        },
      },
      {
        path: 'chat',
        component: 'game-chat',
        action: async () => {
          await import('./chat');
        },
      }
    ];

export { routes }