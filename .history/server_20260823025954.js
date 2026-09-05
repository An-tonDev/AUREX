const app =require('./app')
const dotenv =require('dotenv')
const { connectDB,disconnectDB }= require('./prisma/client')

dotenv.config({path:'./.env'})


const port= process.env.PORT

connectDB()


const server= app.listen(port,()=>{
    console.log('fintech app is running')
})


process.on('unhandledRejection', (err)=>{
   console.error("undhandled rejection", err)
   server.close( async ()=>{
    await disconnectDB()
    process.exit(1)
   }) 
})

process.on('uncaughtException', async (err)=>{
   console.error("uncaught Exception", err)
    await disconnectDB()
    process.exit(1)
   }) 

process.on('SIGTERM', (err)=>{
   console.log('SIGTERM received, shutting down gracefully')
   server.close( async ()=>{
    await disconnectDB()
    process.exit(1)
   }) 
})

