const {PrismaClient}=require( '../generated/prisma')


const prisma= new PrismaClient({
    log: process.env.NODE_ENV =="development"? 
    ["query","error","warn"] :
    ["error"]
})



const connectDB=async ()=>{
    try{
       await prisma.$connect()
       console.log('db is connected')
    }catch(error){
      console.error('culd not connect DB')
      process.exit(1)
    }
}
const disconnectDB=async ()=>{
    try{
       await prisma.$disconnect()
       console.log('db is disconnected')
    }catch(error){
      console.error('culd not disconnect DB',error.message)
      process.exit(1)
    }
}



module.exports={prisma,connectDB,disconnectDB}