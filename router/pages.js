const express = require('express');
const router = express.Router();

router.get('/*',(req,res,next) => {
    if(req.session.disauth == "true"){
        if(req.session.disguild == "true"){
            next();
        }else{
            res.redirect('/login/guilderror');
        }
    }else{
        res.redirect('/login'); //NotAuth
    }
});

router.get('/',(req,res) => res.redirect('/top'));

router.get('/top',(req,res) => {
    res.render('./index.ejs',{
        pagetitle: "Top Page",
        pages: "top",
        role: req.session.disrole
    });
});

router.get('/docs',(req,res) => {
    res.render('./index.ejs',{
        pagetitle: "Docs Page",
        pages: "docs",
        role: req.session.disrole
    });
});

router.get('/online',(req,res) => {
    res.render('./index.ejs',{
        pagetitle: "Online Page",
        pages: "online",
        role: req.session.disrole
    });
});

router.get('/banlist',(req,res) => {
    res.render('./index.ejs',{
        pagetitle: "Banlist Page",
        pages: "banlist",
        role: req.session.disrole
    });
});

router.get('/map',(req,res) => {
    res.render('./index.ejs',{
        pagetitle: "map Page",
        pages: "map",
        role: req.session.disrole
    });
});

router.get('/plan',(req,res) => {
    if (req.session.disrole == "true"){
        res.render('./index.ejs',{
            pagetitle: "plan Page",
            pages: "plan",
            role: req.session.disrole
        });
    }else{
        res.render('error/403');
    }
});

module.exports = router;