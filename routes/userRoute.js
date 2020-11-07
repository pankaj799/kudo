const express = require('express');
const router = express.Router();
const usercontroller = require('../controller/userController');

// var multer  = require('multer');
// var upload = multer({ dest: 'images/'});


router.get('/', usercontroller.gethome);
router.post('/socialogin', usercontroller.socialogin);
router.post('/postlogin', usercontroller.postlogin);
router.post('/numberlogin', usercontroller.numberlogin);
router.post('/optverify', usercontroller.optverify);
router.post('/createalert',usercontroller.createAlert);
router.post('/getAlertMessages', usercontroller.getAlertMessages);
router.post('/postdelete', usercontroller.delete);
router.post('/postdeleteall', usercontroller.deleteall);
router.post('/postdeleteimage', usercontroller.deleteimage);
router.post('/autorespondonoff', usercontroller.autorespondonoff);
router.post('/getautorespondonoff', usercontroller.getautorespondonoff);
router.post('/editAlertMessage', usercontroller.editAlertMessage);
router.post('/searchKeyword', usercontroller.searchKeyword);
router.post('/setsendmessages', usercontroller.setsendmessages);
router.post('/getsendmessages', usercontroller.getsendmessages);
router.get('/subscription', usercontroller.subscription);
// router.post('/imageupload', usercontroller.imageupload);


// router.post('/upload', usercontroller.postupload); 
// router.get('/uploads/:file', usercontroller.getupload);


module.exports = router;