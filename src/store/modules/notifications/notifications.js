const COLOR_SUCCESS = '#6BC688';
const COLOR_WARNING = '#c39043';
const COLOR_ERROR = '#E84970';
let notif_id = 0;
const notifications_module = {
    namespaced: true,
    state: {
        items: [],
    },
    actions: {
        add(store, data) {
            const id = notif_id++;
            const type = data.type || 'success';
            const duration = data.duration || 5000;
            let color = COLOR_SUCCESS;
            switch (type) {
                case 'success':
                    color = COLOR_SUCCESS;
                    break;
                case 'error':
                    color = COLOR_ERROR;
                    break;
                case 'warning':
                    color = COLOR_WARNING;
                    break;
            }
            const item = {
                id: id,
                title: data.title,
                message: data.message,
                color: color,
                duration: 5000,
            };
            setTimeout(() => {
                for (let i = 0; i < store.state.items.length; i++) {
                    const item = store.state.items[i];
                    if (item.id === id) {
                        store.state.items.splice(i, 1);
                    }
                }
            }, duration);
            store.state.items.push(item);
        },
    },
};
export default notifications_module;
//# sourceMappingURL=notifications.js.map