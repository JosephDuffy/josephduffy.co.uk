require('pmx').init();
var express = require('express');
var app = express();
var port = 2368;

app.locals.port = port;

require('./routes/setup')(app);
require('./routes/security')(app);
require('./routes/poet')(app);
// Redirections are included after poet to avoid
// /tags and /tags/ being in an infinite loop
require('./routes/redirections')(app);
require('./routes/content')(app);
require('./routes/static')(app);
require('./routes/sitemap')(app);
require('./routes/feeds')(app);

require('./routes/errors')(app);

var server = app.listen(port, function () {
    console.log("Started josephduffy.co.uk on port " + port);
});