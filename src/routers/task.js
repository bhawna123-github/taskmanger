const express = require('express')
// require('../db/mongoose')
const Task = require('../models/task')

const auth = require('../middleware/auth')
const router = new express.Router()


router.post("/tasks",auth , (req,res)=>{
    const task = new Task({
        ...req.body,
        "owner":req.user._id
    
    })
    task.save().then(()=>{
        res.status(201).send(task)
    }).catch((err)=>{
        res.status(400).send(err)
    })
})

router.get("/tasks",auth,async(req,res)=>{
    match ={}
    sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 
    }

    // console.log("sort",sort)

    try {
        // const user = {}
    //  const task = await Task.find({"owner":req.user._id})
    await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
    }).execPopulate()
    // if(!task)
    //   res.status(400).send("no task found")


        res.send(req.user.tasks)
    } catch (e) {
        res.status(400).send(e)
    }

    // await task.populate('owner').execPopulate()
    // Task.find({}).then((task)=>{
    //     res.status(200).send(task)
    // }).catch((err)=>{
    //     res.status(400).send(err)
    // })
})


router.get("/tasks/:id",auth, (req,res)=>{
    const _id = req.params.id

    Task.findOne({_id, owner:req.user._id}).then((task)=>{
        if(!task)
        res.status(400).send()
        res.status(200).send(task)
    }).catch((err)=>{
        res.status(400).send(err)
    })
})


router.delete("/tasks/:id",auth,async (req,res)=>{
    const _id = req.params.id

         try{
 
            const task = await Task.findOneAndDelete({_id,owner:req.user._id})
            if(!task)
            res.status(400).send("resource is not here")

              res.status(200).send(task)
 
         }
      catch(e){
         console.log("somthing wend wrong",e)
      }
 
 })


router.patch("/tasks/:id",auth,async (req,res)=>{
   const _id = req.params.id
   const allwoedUpdates = ['description', 'completed']
   const updates = Object.keys(req.body)

   const ispresent = updates.every(e=>allwoedUpdates.includes(e))

   if(!ispresent)
     return res.status(400).send({error:"can't update"})

    //  Task.findByIdAndUpdae(req.params.id, req.body,{new:true, runValidator:true}).then(task=>{
    //      res.status(200).send(task)
    //     })
        try{

            const task = await Task.findById({_id, owner:req.user._id})

            if(task){

            updates.forEach(update=>task[update]= req.body[update])

            await task.save()

        //    const task = await Task.findByIdAndUpdate(_id, req.body,{new:true, runValidator:true})
        //    console.log(task)
             res.status(200).send(task)
            }

        }
     catch(e){
        console.log("somthing wend wrong",e)
     }
})


module.exports = router