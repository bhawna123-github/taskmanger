const express = require('express')
require('./db/mongoose')
const Task = require('./models/task')


// Task.countDocuments({completed:true}).then((task)=>{
//     console.log(task)
// // return Task.countDocuments({completed:false})
// }).catch((e)=>{
// console.log(e)
// })


const DeleteTaskandCount = async (id, completed) =>{
     await Task.findByIdAndDelete(id)
     
    return await Task.countDocuments({completed})


}


DeleteTaskandCount("5f950c691e98fe40a0025171",true).then((result)=>{
console.log(result)
}).catch((e)=>{
console.log(e)
})