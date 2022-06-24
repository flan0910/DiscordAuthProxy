const express = require('express');
const router = express.Router();
const fetch = require('snekfetch');

//Login
router.get('/',(req,res) => {
    if (req.session.disauth == "true"){
        if (req.session.disguild == "true"){
            res.redirect('/Pages/top');
        }
    }else{
        res.render('./login.ejs',{
            pagetitle: "Login Application",
            pages: "login",
        }); //LoginPages
    }
});

router.get('/guilderror',(req,res) => {
    if(req.session.disguild == "false"){
        res.render('./login.ejs',{
            pagetitle: "Guild Error",
            pages: "guilds",
        });//Guild Error
    }else{
        res.redirect('/Pages/top');
    }
});

router.get('/discord',(req,res) => {
    res.redirect([
        'https://discord.com/api/oauth2/authorize',
        `?client_id=${conf.id}`,
        `&redirect_uri=${conf.callback}`,
        '&response_type=code',
        '&scope=identify guilds guilds.members.read'
    ].join(''));
});

router.get('/after',(req,res) =>  {
    const code = req.query.code;
    req.session.disauth = "false";
    fetch.post('https://discordapp.com/api/oauth2/token')
      .set({'content-type':'application/x-www-form-urlencoded'})
      .send(`client_id=${conf.id}&client_secret=${conf.secret}&grant_type=authorization_code&code=${code}&redirect_uri=${conf.callback}`)
      .then(response => {
        req.session.disauth = "true";
        res.redirect(`/login/auth?token=${response.body.access_token}`)
      })
      .catch(console.error);
});

router.get('/auth',(req,res) => {
    req.session.disguild = "false";
    fetch.get('https://discordapp.com/api/v6/users/@me/guilds')
    .set('Authorization', `Bearer ${req.query.token}`)
    .then(function (response){
        try {
            response.body.filter(function (item){
                if(item.id == conf.guild_id){       
                    req.session.disguild = "true";
                    res.redirect(`/login/role?token=${req.query.token}`);
                }
            });

        }catch(err){}
        res.redirect('/login/guilderror');
    }).catch(e => console.log(e));
});

router.get('/role',(req,res) => {
    req.session.disrole = "false";
    fetch.get(`https://discordapp.com/api/v6/users/@me/guilds/${conf.guild_id}/member`)
    .set('Authorization', `Bearer ${req.query.token}`)
    .then(function (response){
        try{
            response.body.roles.filter(function (item){
                if(item == conf.roleid){
                    req.session.disrole = "true";
                    res.redirect('/Pages/top');
                }
            });
        }catch(err){}
        res.redirect('/Pages/top');
    }).then(e => console.log(e));
});

router.get('/logout',(req,res) => {
    req.session.destroy((err => {
        res.redirect('/');
    }));
});

module.exports = router;
