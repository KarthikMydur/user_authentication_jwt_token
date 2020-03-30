const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {registerValidation, loginValidation} = require('../validation')

router.post('/register', async (req, res)=>{

    //validating the data before creating the user
    const {error} = registerValidation(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    
    //checking the email exists in database
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist){
        return res.status(400).send('email is already exists')
    }

    //hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)


    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try {
        const savedUser = await user.save()
        res.send({user: user._id})
    }catch(err){
       res.status(400).send(err)
    }
})

//Login 
 router.post('/login', async(req,res)=> {
    //validate the data before login
    const {error} = loginValidation(req.body)
    if(error) {
        return res.status(400).send(error.details[0].message)
    }
    //checking if the email exsists
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('email not exists')
    //compare the password
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('invalid password')

    //Creating and assigning the token
    const token = jwt.sign({id: user._id}, 'jwt-token')
    res.header('auth-token', token).send(token)

})

module.exports = router
