export default({settings, state, head, contentHtml}) => {
  return `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  ${head.title}
  ${head.meta}
  ${head.link}
  ${head.script}
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css">
</head>

<body>
  <div id="content">${contentHtml}</div>
  <script charset="UTF-8">
    window.__REDUX_STATE__ = ${JSON.stringify(state)}
  </script>
  <script src="/assets/js/polyfill.js"></script>
  <script src="/assets/js/bundle.js"></script>
</body>

</html>
`;
};

{/* <link rel="shortcut icon" href="shortcut.png">
<link rel="apple-touch-icon" href="shortcut.png">
<link rel="manifest" href="manifest.json">
<meta property="og:type" content="product" />
<link rel="canonical" href=""/>
<meta name="Description"
<meta name="Keywords"
JSON-LD
Google Analytics */}
