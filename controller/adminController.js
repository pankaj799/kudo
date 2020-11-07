const mongoose = require('mongoose');
const mongo = require('mongodb');
const login = require('../model/weblogin');
const User = require('../model/usermodel');
const createMessage = require('../model/createMessage');
const subscription = require('../model/subscription');
const e = require('express');
const { createAlert } = require('./userController');


// const sendOtp = new SendOtp('343826A9FCFGaC8Ipf5f7d55f4P1');

exports.getlogin = (req, res, next ) => {
    res.render('login',{
        path: '/login'
    })
}

exports.postlogin = (req, res, next ) => {
    // if(!req.session.isLoggedin){
    //     return res.redirect('/login');
    // }
    const username = req.body.username; 
    const password = req.body.password; 
    login.findOne({username,password})
        .then(result => {
            if(result)
            {
                req.session.isLoggedin = true;
                req.session.username = username;
                    return req.session.save(err => {
                        console.log(err);
                        return res.redirect('/adminpanel');
                    });
                
            }
            else
            {
                return res.redirect('/login') 
            }
        })
        .catch(err => (console.log(err)))
}

exports.getallpost = (req, res, next) => {
    if(!req.session.isLoggedin){
        return res.redirect('/login');
    }
    createMessage.find()
        .then(result => {
            if(result)
            {
                User.findById(result.createdby)
                    .then(result1 => {
                        return res.render('adminpanal',{
                            data : result,
                            // name : result1.name
                        })
                    })
                
            }
            else{
                return res.render('adminpanal',{
                    data : "No Data"
                })
            }
        })
}


exports.getallusers = (req, res, next) => {
    if(!req.session.isLoggedin){
        return res.redirect('/login');
    }
    User.find()
        .then(result => {
            if(result)
            {
                return res.render('userdetails',{
                    data : result
                })
                
            }
            else{
                return res.render('adminpanal',{
                    data : "No Data"
                })
            }
        })
}

exports.getallsubscriptions = (req, res, next) => {
    // const createdby = req.body.createdby;
    const id = req.body.id;

    subscription.find()
    .sort({ price : 1})
        .then(result => {
            if(result)
            {
                return res.render('subscriptiondetails',{
                    data : result
                })
                
            }
            else{
                return res.render('adminpanal',{
                    data : "No Data"
                })
            }
        })
}

exports.getaddsubscriptionplan = (req, res, next) => {
    if(!req.session.isLoggedin){
        return res.redirect('/login');
    }
    res.render('addsubscriptionplan', {
        path: '/addsubscriptionplan',
    })
}

exports.addsubscriptionplan = (req, res, next) => {
    // const createdby = req.body.createdby;
    if(!req.session.isLoggedin){
        return res.redirect('/login');
    }
    const timeperiod= req.body.timeperiod;
    const price= req.body.price;
    // console.log(content)
    subscription.findOne({price,timeperiod})
        .then(result => {
            if(result)
            {
                return res.redirect('/allsubscriptions')

            }
            else
            {
                const addsubscription = new subscription();
                addsubscription.timeperiod = timeperiod;
                addsubscription.price = price;
                addsubscription.save()
                    .then(result1 => {
                        return res.redirect('/allsubscriptions');
                    })
            }
        })
}

exports.adduser = (req, res, next) => {
    // const createdby = req.body.createdby;
    if(!req.session.isLoggedin){
        return res.redirect('/login');
    }
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const device_type = req.body.device_type;
    const loginwith = req.body.loginwith;
    User.findOne({email : email})
    .then(user => {
            // var number = number1;
            // user.createdby = user_id;
            if(!user)
            {
                // console.log(keyword)
                const user = new User();
                user.name = name;
                user.email = email;
                user.phone = phone;
                user.device_type = device_type;
                user.loginwith = loginwith;
                // user.time = time;
                user.name = name;
                return user.save()
                    .then(result =>{
                        return res.redirect('/allusers');
                    })
            }
            else{
                return res.redirect(404);
            }
    })
}

exports.getadduser = (req, res, next) => {
    if(!req.session.isLoggedin){
        return res.redirect('/login');
    }
    res.render('adduser', {
        path: '/adduser',
    })
}

exports.geteditmessages = (req, res, next) => {
    // const createdby = req.body.createdby;
    const id = req.body.id;

    createMessage.findById(id)
        .then(result => {
            if(result)
            {
                return res.render('editmessages',{
                    path: '/editpost',
                    data : result
                })
            }
            else
            {
                return res.redirect('/adminpanel')
            }
        }) 
}

exports.getedituser = (req, res, next) => {
    // const createdby = req.body.createdby;
    const id = req.body.id;

    User.findById(id)
        .then(result => {
            if(result)
            {
                return res.render('edituser',{
                    path: '/editpost',
                    data : result
                })
            }
            else
            {
                return res.redirect('/adminpanel')
            }
        }) 
}

exports.geteditsubscriptions = (req, res, next) => {
    // const createdby = req.body.createdby;
    const id = req.body.id;

    subscription.findById(id)
        .then(result => {
            if(result)
            {
                return res.render('editsubscription',{
                    path: '/editpost',
                    data : result
                })
            }
            else
            {
                return res.redirect('/adminpanel')
            }
        }) 
}


exports.editmessages = (req, res, next) => {
    if(!req.session.isLoggedin){
        return res.redirect('/login');
    }
    const user_id = req.body.user_id;
    const number_mob = req.body.number_mob;
    const keyword = req.body.keyword;
    const message = req.body.message;
    const image = req.file;
    const settime = req.body.settime;
    const time = req.body.time;
    const msg_id = req.body.msg_id;
    const name = req.body.name;
    // console.log(keyword)
    // Createmessage.findById(user_id)
    //     .then(user => {
    //         user.keyword = keyword;
    //         user.number = number1;
    //         user.message = message;
    //         user.settime = settime;
    //         user.time = time;
    //     })
    createMessage.findById(msg_id)
    .then(user => {
            // var number = number1;
            // user.createdby = user_id;
            if(user)
            {
                // console.log(keyword)
                user.keyword = keyword;
                user.number = number_mob;
                user.message = message;
                user.image = image.path;
                user.settime = settime;
                // user.time = time;
                user.name = name;
                return user.save()
                    .then(result =>{
                        createMessage.find({_id : msg_id , createdby : user_id})
                            .then(result => {
                                if(result)
                                {
                                    return res.redirect('/adminpanel')
                                }
                            })
                    })
            }
            else{
                return res.redirect(404);
            }
    })
}

exports.edituser = (req, res, next) => {
    if(!req.session.isLoggedin){
        return res.redirect('/login');
    }
    const user_id = req.body.user_id;
    const name = req.body.name;
    const email = req.body.email;
    const number = req.body.number;
    const loginwith = req.body.loginwith;
    // console.log(keyword)
    // Createmessage.findById(user_id)
    //     .then(user => {
    //         user.keyword = keyword;
    //         user.number = number1;
    //         user.message = message;
    //         user.settime = settime;
    //         user.time = time;
    //     })
    User.findById(user_id)
    .then(user => {
            // var number = number1;
            // user.createdby = user_id;
            if(user)
            {
                // console.log(keyword)
                user.name = name;
                user.email = email;
                user.phone = number;
                user.loginwith = loginwith;
                // user.time = time;
                user.name = name;
                return user.save()
                    .then(result =>{
                                
                            return res.redirect('/allusers')
                                
                    })
            }
            else{
                return res.redirect(404);
            }
    })
}

exports.editsubscription = (req, res, next) => {
    if(!req.session.isLoggedin){
        return res.redirect('/login');
    }
    const user_id = req.body.user_id;
    const price = req.body.price;
    const timeperiod = req.body.timeperiod;
    // console.log(keyword)
    // Createmessage.findById(user_id)
    //     .then(user => {
    //         user.keyword = keyword;
    //         user.number = number1;
    //         user.message = message;
    //         user.settime = settime;
    //         user.time = time;
    //     })
    subscription.findById(user_id)
    .then(user => {
            // var number = number1;
            // user.createdby = user_id;
            if(user)
            {
                // console.log(keyword)
                user.price = price;
                user.timeperiod = timeperiod;
                // user.time = time;
                return user.save()
                    .then(result =>{
                                
                            return res.redirect('/allsubscriptions')
                                
                    })
            }
            else{
                return res.redirect(404);
            }
    })
}

exports.deletepost = (req, res, next) => {
    if(!req.session.isLoggedin){
        return res.redirect('/login');
    }
    const userid = req.body.userid;
    createMessage.findByIdAndDelete(userid)
        .then(result => {
            return res.redirect('/adminpanel')
        })
}

exports.deleteuser = (req, res, next) => {
    if(!req.session.isLoggedin){
        return res.redirect('/login');
    }
    const userid = req.body.userid;
    User.findByIdAndDelete(userid)
        .then(result => {
            return res.redirect('/allusers')
        })
}

exports.deletesubscription = (req, res, next) => {
    if(!req.session.isLoggedin){
        return res.redirect('/login');
    }
    const userid = req.body.userid;
    subscription.findByIdAndDelete(userid)
        .then(result => {
            return res.redirect('/allsubscriptions')
        })
}

exports.logout = (req, res, next) => {
    req.session.destroy((err)=>{
        res.redirect('/login');
        console.log(err);
    });
}