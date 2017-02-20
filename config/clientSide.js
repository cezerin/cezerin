const domain = 'http://localhost:3000';

module.exports = {
  storeBaseUrl: domain,
  ajaxBaseUrl: `${domain}/ajax`,
  apiBaseUrl: `${domain}/api/v1`,
  adminBaseUrl: `${domain}/admin`,

  editor: {
    language: 'en',
    inline: true,
    themes: 'inlite',
    plugins: [
      'autolink lists link image charmap preview anchor', 'searchreplace visualblocks code fullscreen', 'media table paste code textcolor directionality'
    ],
    toolbar1: 'image media | styleselect | bold italic bullist numlist link alignleft aligncenter alignright alignjustify',
    toolbar2: 'undo redo | forecolor paste removeformat table | outdent indent | preview code'
  }
}
