const mongoose = require('mongoose');
const mongo = require('mongodb');
const User = require('../model/usermodel');
const Createmessage = require('../model/createMessage');
const createMessage = require('../model/createMessage');
const subscription = require('../model/subscription');
const sendMessages = require('../model/sendMessages');
const Otp = require('../model/otp');
// const SendOtp = require('sendotp');
const fast2sms = require('fast-two-sms');
require('dotenv').config();
const fs = require("fs");
const { time } = require('console');
// const axios = require("axios");


// const sendOtp = new SendOtp('343826A9FCFGaC8Ipf5f7d55f4P1');

exports.gethome= (req, res, next)=>{
    return res.send(JSON.stringify({
        status: false, 
        message: "User already Exist", 
        data: []
    }))
};

exports.socialogin = (req, res, next) => {
        const name= req.body.name;
        const email = req.body.email.replace(/\s+/g, '');
        const number = req.body.number;
        const phone = req.body.phone;
        const device_token = req.body.device_token;
        const device_type = req.body.device_type;
        const loginwith = req.body.loginwith;
        // console.log(name)

        User.findOne({email: email})
        .then(user => {
            if(user)
            {
                return res.send(JSON.stringify({
                    status: true, 
                    message: "User Logged In", 
                    data: [user]
                }))
            }
            const userdata = new User({
                name: name,
                email: email,
                number: number,
                phone : phone,
                device_token: device_token,
                device_type: device_type,
                loginwith: loginwith
            });
            
            return userdata.save()
            .then(result => {
                req.session.isLoggedin = true;
                req.session.user = user;
                return req.session.save(err => {
                    console.log(err);
                    return res.send(JSON.stringify({
                        status: true, 
                        message: "User Logged In", 
                        data: [result]
                    }))
                });
            })
        })
        .catch(err => {console.log(err)})
};

exports.postlogin = (req, res, next) => {
    const str1 = req.body.email.replace(/\s+/g, '');
    const email= str1;
    // const password = req.body.password;
    User.findOne({email: email})
        .then(result=>{
            if(!result){
                return res.send(JSON.stringify({
                    status: false, 
                    message: "User Dosen't Exist", 
                    data: []
                }))
            }
            else
            {
                return res.send(JSON.stringify({
                    status: true, 
                    message: "User Logged In", 
                    data: [result]
                }))
                // req.session.isLoggedin = true;
                // req.session.user = user;
                // return req.session.save(err => {
                //     console.log(err);
                //     return res.send(JSON.stringify({
                //         status: true, 
                //         message: "User Logged In", 
                //         data: [result]
                //     }))
                // });
            }
        })
        .catch(err => console.log(err));
}

exports.numberlogin = (req, res, next) => {
    const number = req.body.number;
    const val = Math.floor(1000 + Math.random() * 9000);
    User.findOne({phone:number})
        .then(user => {
            if(!user)
            {   
                // console.log(number)
                // fast2sms.sendMessage({
                //     authorization : process.env.API_KEY,
                //     message : val,
                //     numbers : [number],

                // })
                // .then(result => {
                    const otp = new Otp();
                    otp.otp = val;
                    otp.number = number;
                    otp.save()
                    .then( result1 => {
                        return res.send(JSON.stringify({
                            status: true, 
                            message: "Otp Send Successfully", 
                        }))
                    })
                    
                // })
                    
                  
            }
            else{
                return res.send(JSON.stringify({
                    status: false, 
                    message: "Error occureded", 
                }))
            }
        })
}

exports.optverify = (req, res, next) =>{
    const opt = req.body.opt;
    const number = req.body.number;
    Otp.findOne({otp : opt,number: number})
        .then(user => {
            if(user)
            {
                Otp.findByIdAndDelete(user._id)
                    .then(result => {
                        return res.send(JSON.stringify({
                            status: true, 
                            message: "Successfully Logged In", 
                        }))
                    })
            }
            else{
                return res.send(JSON.stringify({
                    status: false, 
                    message: "No data Found", 
                }))
            }
        })
}

exports.createAlert = (req, res, next) => {
    // if(!req.session.isLoggedin){
    //     return res.redirect('/postlogin');
    // }
    const number_mob = req.body.number_mob;
    const number1 = number_mob.split(",");
    const keyword = req.body.keyword;
    const message = req.body.message;
    // const image = req.file;
    const settime = req.body.settime;
    const time = req.body.time;
    const map = req.body.map;
    const name = req.body.name;
    const createdby = req.body.user_id;
    const value_on_off = req.body.value_on_off;
    const base64 = req.body.image;
    let base64Image = base64.split(';base64,').pop();
    var val = Math.floor(1000 + Math.random() * 9000);
    const image = "images/img"+val+".jpg";
    const spinner_value = req.body.spinner_value;
    // console.log(image)
    // console.log(image.path)
    fs.writeFile(image,base64Image, {encoding : 'base64'},function(err, data){
        if(err)
        {
            return res.send(JSON.stringify({
                status: false, 
                message: "No Data Entry", 
                data: []
            }))
        }
        else{
            Createmessage.find({number: number1})
                .then(users => {
                    for(var i=0; i<number1.length ; i++)
                    {
                        var number = number1[i];
                        // console.log(number)
                        const add_message_alert = new Createmessage();
                            add_message_alert.number = number;
                            add_message_alert.message = message;
                            add_message_alert.settime = settime;
                            
                            add_message_alert.time = time;
                            if(base64)
                            {
                                add_message_alert.image = image;
                            }
                            // if(image)
                            // {    
                            //     add_message_alert.image = image.path;
                            // }
                            // console.log(image)
                            add_message_alert.createdby = createdby;
                            add_message_alert.keyword = keyword;
                            add_message_alert.map = map;
                            add_message_alert.name = name;
                            add_message_alert.spinner_value = spinner_value;
                            add_message_alert.value_on_off = value_on_off;
                            add_message_alert.save();
                    }
                    Createmessage.find({number : number1})
                        .then(result => {
                            if(result)
                            {
                                return res.send(JSON.stringify({
                                    status: true, 
                                    message: "Data is entered Successfully"
                                }))
                            }
                            else
                            {
                                return res.send(JSON.stringify({
                                    status: false, 
                                    message: "Data is not entered"
                                }))
                            }
                        })
                })
        .catch(err => {console.log(err)})
            
        }
    })
        
}

exports.getAlertMessages = (req, res, next) => {
    // if(!req.session.isLoggedin){
    //     return res.redirect('/postlogin');
    // }
    const userid = req.body.userid;
    Createmessage.find({createdby : userid})
        // .select('message settime')
        .then(user =>{
            if(user)
            {
                return res.send(JSON.stringify({
                    status: true, 
                    message: "Data Successfully got",
                    data : user
                }))
            }
        })
}

exports.delete = (req, res, next) => {
    // if(!req.session.isLoggedin){
    //     return res.redirect('/postlogin');
    // }
    // const user_id = req.body.user_id;
    const msg_id = req.body.msg_id;
    Createmessage.findById(msg_id)
        .then(user =>{
            if(user)
            {
                Createmessage.remove({_id : msg_id})
                    .then(result => {
                        return res.send(JSON.stringify({
                            status: true, 
                            message: "Record is Deleted"
                        }))
                    })
            }
            else
            {
                return res.send(JSON.stringify({
                    status: false, 
                    message: "Record is already Deleted"
                }))
            }
        })
        .catch(errr => {
            return res.send(JSON.stringify({
                status: false, 
                message: "Record is not found"
            }))
        })
}

exports.deleteall = (req, res, next) => {
    // if(!req.session.isLoggedin){
    //     return res.redirect('/postlogin');
    // }
    const user_id = req.body.user_id;
    Createmessage.deleteMany(user_id)
        .then(user =>{
            return res.send(JSON.stringify({
                status: true, 
                message: "All Data is  Deleted"
            }))
        })
}

exports.deleteimage = (req, res, next) => {
    const user_id = req.body.user_id;
    const message_id = req.body.message_id;
    Createmessage.findOne({createdby : user_id, _id : message_id})
        .then(user => {
            if(user)
            {
                user.image = '';
                user.save()
                    .then(result => {
                        return res.send(JSON.stringify({
                            status: true, 
                            message: "image is  Deleted"
                        }))
                    })
            }
            else{
                return res.send(JSON.stringify({
                    status: false, 
                    message: "image is not Deleted"
                }))
            }
        })
}

exports.editAlertMessage = (req, res, next) => {
    const user_id = req.body.user_id;
    const number_mob = req.body.number_mob;
    const keyword = req.body.keyword;
    // const image = req.file;
    const message = req.body.message;
    const settime = req.body.settime;
    const time = req.body.time;
    const msg_id = req.body.msg_id;
    const name = req.body.name;
    const value_on_off = req.body.value_on_off;
    const base64 = req.body.image;
    let base64Image = base64.split(';base64,').pop();
    var val = Math.floor(1000 + Math.random() * 9000);
    const image = "images/img"+val+".jpg";
    // console.log(keyword)
    // Createmessage.findById(user_id)
    //     .then(user => {
    //         user.keyword = keyword;
    //         user.number = number1;
    //         user.message = message;
    //         user.settime = settime;
    //         user.time = time;
    //     })
    fs.writeFile(image,base64Image, {encoding : 'base64'},function(err, data){
        if(err)
        {
            return res.send(JSON.stringify({
                status: false, 
                message: "No Data Entry", 
                data: []
            }))
        }
        else{
            Createmessage.findOne({_id : msg_id , createdby : user_id})
                .then(user => {
                        // var number = number1;
                        // user.createdby = user_id;
                        if(user)
                        {
                            // console.log(keyword)
                            user.keyword = keyword;
                            user.number = number_mob;
                            user.message = message;
                            user.settime = settime;
                            user.time = time;
                            user.value_on_off = value_on_off;
                            if(base64)
                            {
                                user.image = image;
                            }
                            // user.image = image.path;
                            user.name = name;
                            return user.save()
                                .then(result =>{
                                    Createmessage.find({_id : msg_id , createdby : user_id})
                                        .then(result => {
                                            if(result)
                                            {
                                                return res.send(JSON.stringify({
                                                    status: true, 
                                                    message: "Data is entered Successfully"
                                                }))
                                            }
                                            else
                                            {
                                                return res.send(JSON.stringify({
                                                    status: false, 
                                                    message: "Data is not entered"
                                                }))
                                            }
                                        })
                                })
                                .catch(err => {
                                    return res.send(JSON.stringify({
                                        status: false, 
                                        message: "Details are not entered correctly"
                                    }))
                                })
                        }
                        else{
                            return res.send(JSON.stringify({
                                status: false, 
                                message: "message didn't got"
                            }))
                        }
                })
        }
    })
}

exports.autorespondonoff = (req, res, next) => {
    // if(!req.session.isLoggedin){
    //     return res.redirect('/postlogin');
    // }
    const user_id = req.body.user_id;
    const on_off = req.body.on_off;
    // const value_on_off = req.body.value_on_off;
    User.findOne({_id:user_id})
        .then(user => {
            if(user)
            {
                user.on_off = on_off;
                user.save();
                return res.send(JSON.stringify({
                    status: true, 
                    message: "Autoresponder Changed",
                    data : []
                }))
            }
            // else if(user)
            // {
            //     user.on_off = true;
            //     return user.save()
            //         .then(result =>{
            //             return res.send(JSON.stringify({
            //                 status: true, 
            //                 message: "Autoresponder Set To On",
            //                 data : [result]
            //             }))
            //         })
            // }
            else 
            {
                return res.send(JSON.stringify({
                    status: false, 
                    message: "no data found"
                }))
            }
        })
}

exports.getautorespondonoff = (req, res, next) => {
    // if(!req.session.isLoggedin){
    //     return res.redirect('/postlogin');
    // }
    const user_id = req.body.user_id;
    // const value_on_off = req.body.value_on_off;
    User.findOne({_id:user_id})
        .select('on_off -_id')
        .then(user => {
            if(user)
            {
                return res.send(JSON.stringify({
                    status: true, 
                    message: "Autoresponder",
                    data : [user]
                }))            
            }
            else 
            {
                return res.send(JSON.stringify({
                    status: false, 
                    message: "no data found"
                }))
            }
        })
}

exports.searchKeyword = (req, res, next) => {
    const searchValue = req.body.searchValue;
    // console.log(searchValue)
    createMessage.find({keyword: {$regex : searchValue}})
    // .select('name country image dimonds')
    .then(users => {
        if(!users){
            return res.send(JSON.stringify({
                status: false, 
                message: "no list found", 
                data: []
            }))
        }
        return res.send(JSON.stringify({
            status: true, 
            message: "Search Result", 
            data: users
        }))
    })
    .catch(err => {console.log(err)});
}

exports.setsendmessages = (req, res, next) => {
    const user_id = req.body.user_id;
    const name = req.body.name;
    const package_name = req.body.package_name;
    const date = new Date();
    const updatedday = date.toString().substring(4,15);
    const updatedtime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    console.log(updatedday)
    console.log(updatedtime)
    sendMessages.findOne({user_id : user_id,name : name ,package_name : package_name })
                .select('-createdAt -updatedAt')
        .then(user => {
            if(user)
            {
                return res.send(JSON.stringify({
                    status: false, 
                    message: "No result Found", 
                    data: []
                }))
            }
            else 
            {
                const sendMessage = new sendMessages();
                sendMessage.user_id = user_id;
                sendMessage.name = name;
                sendMessage.package_name = package_name;
                sendMessage.updatedday = updatedday;
                sendMessage.updatedtime = updatedtime;
                sendMessage.save()
                    .then(result => {
                        return res.send(JSON.stringify({
                            status: true, 
                            message: "Send Message added ", 
                            data: [result]
                        }))
                    })
            }
        })
        .catch(err => {
            return res.send(JSON.stringify({
                status: false, 
                message: "No result Found", 
                data: []
            }))
        })
}

exports.getsendmessages = (req, res, next) => {
    const user_id = req.body.user_id;
    sendMessages.find({user_id : user_id})
    .sort({'updated_at' : -1})
    .select('-created_at -updated_at -__v')
        .then(result => {
            if(result)
            {
                return res.send(JSON.stringify({
                    status: true, 
                    message: "Messages Received", 
                    data: result
                }))
            }
            else
            {
                return res.send(JSON.stringify({
                    status: true, 
                    message: "No message send", 
                    data: []
                }))
            }
        })
        .catch(err => {
            return res.send(JSON.stringify({
                status: false, 
                message: "No user Found", 
                data: []
            }))
        })
}

exports.subscription = (req, res, next) => {
    subscription.find()
        .sort({'price' : 1})
        .then(result => {
            if(result)
            {
                return res.send(JSON.stringify({
                    status: true, 
                    message: "Results", 
                    data: result,
                    // static_data : [{
                    //     keyword : "unlimited Keywords",
                    //     text : "text(SMS) Replies",
                    //     watsapp : "Watsapp Replies",
                    //     facebook : "Facebook Replies",
                    //     googleVoice : "Reply To Google Voice"
                    // }]    
                        // {
                        // price : result.price,
                        // timestamp : result.timestamp
                        // }
                        
                }))
            }
            else
            {
                return res.send(JSON.stringify({
                    status: false, 
                    message: "No Data Entry", 
                    data: []
                }))
            }
        })
}

// exports.imageupload = (req, res, next) => {
//     const base64 = req.body.base64;
//     let base64Image = base64.split(';base64,').pop();
//     var val = Math.floor(1000 + Math.random() * 9000);
//     const image = "images/img"+val+".jpg";
//     fs.writeFile(image,base64Image, {encoding : 'base64'},function(err, data){
//         if(err)
//         {
//             return res.send(JSON.stringify({
//                 status: false, 
//                 message: "No Data Entry", 
//                 data: []
//             }))
//         }
//         else{
//             const msg_id= req.body.msg_id;
//             const user_id= req.body.user_id;
//             // const image= data;
//             // console.log(image)
//             Createmessage.findOne({_id : msg_id , createdby : user_id})
//                 .then(user => {
//                         // var number = number1;
//                         // user.createdby = user_id;
//                         if(user)
//                         {
//                             // console.log(keyword)
//                             // user.keyword = keyword;
//                             // user.number = number_mob;
//                             // user.message = message;
//                             // user.settime = settime;
//                             // user.time = time;
//                             user.image = image;
//                             // user.name = name;
//                             return user.save()
//                                 .then(result =>{
//                                     Createmessage.find({_id : msg_id , createdby : user_id})
//                                         .then(result => {
//                                             if(result)
//                                             {
//                                                 return res.send(JSON.stringify({
//                                                     status: true, 
//                                                     message: "Data is entered Successfully"
//                                                 }))
//                                             }
//                                             else
//                                             {
//                                                 return res.send(JSON.stringify({
//                                                     status: false, 
//                                                     message: "Data is not entered"
//                                                 }))
//                                             }
//                                         })
//                                 })
//                                 .catch(err => {
//                                     return res.send(JSON.stringify({
//                                         status: false, 
//                                         message: "Details are not entered correctly"
//                                     }))
//                                 })
//                         }
//                         else{
//                             return res.send(JSON.stringify({
//                                 status: false, 
//                                 message: "message didn't got"
//                             }))
//                         }
//                 })
//         }
//     })
// }
