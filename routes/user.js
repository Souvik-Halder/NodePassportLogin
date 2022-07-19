const express = require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');


//Login page
router.get('/login',(req,res)=> res.render('login'));

//Register Page
router.get('/register',(req,res)=>{
    res.render('register');
})

//Register Handle
router.post('/register',(req,res)=>{
const {name,email,password,password2}=req.body;
let errors=[];
//Check required fields
if(!name || !email || !password || !password2){
    errors.push({msg:'Please d fill in all fields'});
}

//check password match
if(password!==password2){
    errors.push({msg:'Passwords do not match '});
}
if(password.length<6){
    errors.push({msg:'Passwords should be atleast 6 characters'})
}

if(errors.length>0){
  res.render('register',{
    errors,
    name,
    email,
    password,
    password2
  })
}else{
    //validation passed
    User.findOne({email:email})
    .then(user =>{
        if(user){
            errors.push({msg:'Email is already register'})
            res.render('register',{
                errors,
                name,
                email,
                password,
                password2
              })
        }
        else{
            const newUSer=new User({
                name,
                email,
                password
            });
            //Hash Password
            bcrypt.genSalt(10,(err,salt)=>bcrypt.hash(newUSer.password,salt,(err,hash)=>{
                if(err) throw err;
                //Set the password to the hash
                newUSer.password=hash;
                //Save user
                newUSer.save()
                .then(user=>{
                    req.flash('success_msg','You are now registered and can log in')
                    res.redirect('/users/login')
                })
                .catch(err=>console.log(err));
            }))
        }
    })
}
})
 
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashbord',
        failureRedirect:'user/login',
        failureFlash: true
    })(req,res,next);
})


module.exports=router;