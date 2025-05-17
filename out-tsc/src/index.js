const routes = [
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
            await import('./game-main.js');
        },
    },
    {
        path: 'starting',
        component: 'starting-page',
        action: async () => {
            await import('./starting-page.js');
        },
    },
    {
        path: 'winner',
        component: 'winner-page',
        action: async () => {
            await import('./winner-page.js');
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
];
export { routes };
//# sourceMappingURL=index.js.map