const express = require('express');
const router = express.Router();
const admincontroller = require('../controller/adminController');

// var multer  = require('multer');
// var upload = multer({ dest: 'images/'});


router.get('/login',admincontroller.getlogin);
router.post('/postlogin',admincontroller.postlogin);
router.get('/adminpanel', admincontroller.getallpost);
router.get('/allusers', admincontroller.getallusers);
router.get('/allsubscriptions', admincontroller.getallsubscriptions);
router.get('/getaddsubscriptionplan', admincontroller.getaddsubscriptionplan);
router.get('/allsubscriptions', admincontroller.getallsubscriptions);
router.get('/getadduser', admincontroller.getadduser);
router.post('/addsubscriptionplan', admincontroller.addsubscriptionplan);
router.post('/adduser', admincontroller.adduser);
router.post('/geteditmessages', admincontroller.geteditmessages);
router.post('/getedituser', admincontroller.getedituser);
router.post('/geteditsubscriptions', admincontroller.geteditsubscriptions);
router.post('/editmessages', admincontroller.editmessages);
router.post('/edituser', admincontroller.edituser);
router.post('/editsubscription', admincontroller.editsubscription);
router.post('/deletepost', admincontroller.deletepost);
router.post('/deleteuser', admincontroller.deleteuser);
router.post('/deletesubscription', admincontroller.deletesubscription);
router.post('/logout', admincontroller.logout);


module.exports = router;