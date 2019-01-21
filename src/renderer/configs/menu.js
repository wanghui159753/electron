const menu =
    [
        {
            path: '/example', name: 'Example', meta: { title: 'Example', icon: 'example' },
            children: [
                {
                    path: 'table',
                    name: 'Table',
                    meta: { title: 'Table', icon: 'table' }
                },
                {
                    path: 'tree', name: 'Tree', meta: { title: 'Treesss', icon: 'tree' }
                }
            ]
        },

        {
            path: '/form',
            children: [
                {
                    path: 'index',
                    name: 'Form',
                    meta: { title: 'Form', icon: 'form' }
                }
            ]
        },
        {
            path: '/im',
            children: [
                {
                    path: 'index',
                    name: 'IM',
                    meta: { title: 'IM', icon: 'user' }
                }
            ]
        }
    ]
export default menu