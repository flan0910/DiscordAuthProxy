require('date-utils');
module.exports = function(req,res,next) {
    var date = new Date();
    var log = `${req.ip} [${req.session.name || "NoAuth"}] - - [${date.toFormat('DD/MMM/YYYY HH24:MI:SS')}] "${req.method} ${req.originalUrl} ${req.protocol}" ${req.res.statusCode}`
    console.log(log);
    next();
}