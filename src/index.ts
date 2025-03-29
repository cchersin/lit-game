import { Router } from '@vaadin/router';

const routes = [
  {
    path: '/',
    component: 'game-app',
    action: async () => {
      await import('./app.js');
    },
     children: [
      {
        path: 'login',
        component: 'user-login',
        action: async () => {
          await import('./login.js');
        },
      },
      {
        path: 'game',
        component: 'game-main',
        action: async () => {
          await import('./game.js');
        },
      },
      {
        path: 'player-list',
        component: 'player-list',
        action: async () => {
          await import('./player-list.js');
        },
      },
      {
        path: 'chat',
        component: 'game-chat',
        action: async () => {
          await import('./chat.js');
        },
      }
    ]
  },
];

const outlet = document.getElementById('outlet');
export const router = new Router(outlet);
router.setRoutes(routes);
