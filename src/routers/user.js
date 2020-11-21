const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const {sendWelcomeEmail} = require('../email/account')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({user,token})
    } catch (e) {
        res.status(400).send()
    }
})


router.post('/users/logout',auth, async (req, res) => {


    try {

        req.user.tokens = req.user.tokens.filter(token=> token.token !== req.token)

        await req.user.save()

        res.send()
    } catch (e) {
        res.status(400).send()
    }
})


router.post('/users/logoutAll',auth, async (req, res) => {

    try {

        req.user.tokens = []

        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me',auth, async (req, res) => {
    res.send(req.user)
})


router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        // const user = {}

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth, async (req, res) => {
    try {


        // const user = await User.findByIdAndDelete(req.user._id)

        // if (!user) {
        //     return res.status(404).send()
        // }

        await req.user.remove()

        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

const multer = require('multer')

const upload = multer({
    // dest:"images",
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload a word doc'))
        }

       cb(undefined,true)

    }
})

router.post('/upload',auth,upload.single('upload'),async(req,res)=>{
    req.user.avatar =req.file.buffer
    await req.user.save();
res.send()
},(error,req,res,next)=>{
      console.log(error)
       res.status(400).send({'error':error.Error})
   
})


router.post('/upload',auth,upload.single('upload'),async(req,res)=>{
    req.user.avatar =req.file.buffer
    await req.user.save();
res.send()
},(error,req,res,next)=>{
      console.log(error)
       res.status(400).send({'error':error.Error})
   
})


router.delete('/users/avatar',auth, async (req, res) => {
    try {


        req.user.avatar= undefined;
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})



router.get('/users/:id/avatar', async (req, res) => {
    console.log(req.params.id)
    try {

        // const task = await Task.findById({_id, owner:req.user._id})
         const user = await User.findById(req.params.id)

         console.log(user,"user")

         if(!user || !user.avatar){
             throw new Error()
         }

  res.set('Content-type','image/jpg')
  res.send(user.avatar)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router