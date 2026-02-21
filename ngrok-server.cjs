const ngrok = require('ngrok');
(async () => {
  try {
    const url = await ngrok.connect(3000); 
    console.log('URL_FOUND:' + url);
  } catch (e) {
    console.error('FAIL:' + e.message);
    process.exit(1);
  }
})();
