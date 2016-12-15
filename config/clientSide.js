const domain = 'http://localhost';

module.exports = {
  ajaxBaseUrl: `${domain}/ajax`,
  language: 'en',

  currencies: [
    'USD',
    'EUR',
    'JPY',
    'GBP',
    'CHF',
    'TRY'
  ],

  editor: {
    inline: true,
    themes: 'inlite',
    plugins: [
      'autolink lists link image charmap preview anchor', 'searchreplace visualblocks code fullscreen', 'media table paste code textcolor directionality'
    ],
    toolbar1: 'image media | styleselect | bold italic bullist numlist link alignleft aligncenter alignright alignjustify',
    toolbar2: 'undo redo | forecolor paste removeformat table | outdent indent | preview code'
  },

  api: {
    url: {
      base: `${domain}/api/`
    }
  },

  store: {
    url: {
      base: `${domain}`
    }
  },

  admin: {
    url: {
      base: `${domain}/admin`,
      assets: `${domain}/admin/assets`
    },

    pages: {
      login: '/admin/login',
      logout: '/admin/logout',
      home: '/admin'
    },

    menu: [
      {
        title: 'Home',
        url: '/admin',
        icon: 'home'
      }, {
        title: 'Products',
        url: '/admin/products',
        icon: 'local_offer'
      }, {
        title: 'Categories',
        url: '/admin/products/categories',
        icon: 'folder'
      }, {
        title: 'Orders',
        url: '/admin/orders',
        icon: 'shopping_cart'
      }, {
        title: 'Order categories',
        url: '/admin/orders/categories',
        icon: 'folder'
      }, {
        title: 'Customers',
        url: '/admin/customers',
        icon: 'people'
      }, {
        title: '-',
        url: 'settings'
      }, {
        title: 'Settings',
        url: '/admin/settings',
        icon: 'settings'
      }, {
        title: 'Logout',
        url: '/admin/logout',
        icon: 'exit_to_app'
      }
    ]
  }
}
