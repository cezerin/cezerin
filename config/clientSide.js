const domain = 'http://localhost';

module.exports = {
  storeBaseUrl: domain,
  ajaxBaseUrl: `${domain}/ajax`,
  apiBaseUrl: `${domain}/api`,
  adminBaseUrl: `${domain}/admin`,
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

  admin: {
    pages: {
      login: '/admin/login',
      logout: '/admin/logout',
      home: '/admin'
    }

  }
}
