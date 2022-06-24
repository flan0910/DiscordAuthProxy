//Modules
const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const session = require('express-session');
const { exit } = require('process');

function loadYamlFile(filename) {
    const fs = require('fs');
    const yaml = require('js-yaml');
    const yamlText = fs.readFileSync(filename, 'utf8')
    return yaml.load(yamlText);
}

// Create Express Server
const app = express();
app.set("view engine", "ejs");

// Configuration
try {
    const data = loadYamlFile('./conf/config.yaml');
    global.conf = {
        httpOnlySt: data.cookie.httpOnly,
        secureSt: data.cookie.secure,
        sessiontime: data.cookie.time,
        HOST:data.server.host,
        PORT: data.server.port,
        id: data.disauth.id,
        secret: data.disauth.secret,
        callback: data.disauth.callback,
        guild_id: data.disauth.guild_id,
        roleid: data.disauth.roleid,
        PROX_PATH: data.proxy.proxy_pass
    }
}catch (err){
    console.error(err.message);
    exit(-1);
}

const crypto = require("crypto").randomBytes(256).toString("hex");
app.use(session({
    secret: crypto,
    resave: false,
    saveUninitialized: false,
    cookie:{
        httpOnly: conf.httpOnlySt,
        secure: conf.secureSt,
        maxAge: 86400000 * conf.sessiontime
    }
})); 


// Logging
app.use(morgan('common'));

app.get('/',(req,res) => {
    if(req.session.disauth == "true"){
        if(req.session.disguild == "true"){
            res.redirect('/Pages/top');
        }
    }else{
        res.redirect('/login');
    }
});

//login
app.use('/login',require('./router/logins'));

//Pages/* sessionCheck
app.use('/Pages',require('./router/pages'));

//Proxy/* sessionCheck
app.use('/Proxy/*',(req,res,next) => {
    if(req.session.disauth == "true"){
        if(req.session.disguild == "true"){
            next();
        }else{
            res.sendStatus(401); //Guild Error
            res.render('error/401');
        }
    }else{
        //res.sendStatus(401); //NotAuth
        res.render('error/401');
    }
});

//Plan
app.use('/Proxy/plan',(req,res,next) => {
    if(req.session.disauth == "true"){
        if(req.session.disguild == "true"){
            if(req.session.disrole == "true"){
                next();
            }else{
                res.render('error/403');
            }
        }else{
            res.render('error/401');
        }
    }else{
        res.render('error/401');
    }
});

// Proxy endpoints
app.use('/Proxy/', createProxyMiddleware({
    target: conf.PROX_PATH,
    changeOrigin:  true
}));

// Start the Proxy
app.listen(conf.PORT, conf.HOST, () => {
    console.log(`Starting Proxy at ${conf.HOST}:${conf.PORT}`);
    console.log('StartServer!');
});