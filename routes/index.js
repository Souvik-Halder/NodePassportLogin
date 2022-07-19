const express = require('express');
const router=express.Router();


router.get('/welcome',(req,res)=> res.render('welcome'));
router.get('/dashbord',(req,res)=>{
    res.render('dashbord')
})
module.exports=router;