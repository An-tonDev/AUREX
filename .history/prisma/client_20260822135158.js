const prismaClient= require('@prisma/client')


const prisma= new prismaClient({
    log: process.env.NODE_ENV =="development"? 
    ["query","error","warns"] :
    ["error"]
})



const connectDB=()=>{
    try{
       await prisma.$connect()
       console.log('db is connected')
    }catch(error){
      console.error('culd not connect DB',error.message)
      process.exit(1)
    }
}
const disconnectDB=()=>{
    try{
       await prisma.$disconnect()
       console.log('db is disconnected')
    }catch(error){
      console.error('culd not disconnect DB',error.message)
      process.exit(1)
    }
}



module.exports={prisma , connectDB,disconnectDB}