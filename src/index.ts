import { Router } from '@vaadin/router';

const routes = [
  {
    path: '/',
    component: 'lit-game',
    action: async () => {
      await import('./lit-game.js');
    },
    children: [
      {
        path: 'player-list',
        component: 'player-list',
        action: async () => {
          await import('./player-list.js');
        },
      },
      {
        path: 'game-chat/:user',
        component: 'game-chat',
        action: async () => {
          await import('./game-chat.js');
        },
      }
    ]
  },
];

const outlet = document.getElementById('outlet');
export const router = new Router(outlet);
router.setRoutes(routes);
