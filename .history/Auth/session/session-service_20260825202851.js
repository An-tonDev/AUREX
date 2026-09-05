const { get } = require('../../app')
const { ValidationError, NotFoundError } = require('../../utils/AppError')
const sessionRepository=require('./session-repository')


const createSession= async (data)=>{

     if(!data){
        throw new ValidationError('session data cannot be null')
     }

    return await sessionRepository.createSession(data)
}

const updateSession=async(id,data)=>{

    if(!id){
        throw new NotFoundError('session does not exist')
    }

    return await sessionRepository.updateSession(id,data)
}

const deleteSession=async(id)=>{

    const session= await sessionRepository.getSession(id)

    if(!session){
        throw new NotFoundError('session does not exist')
    }

    return await sessionRepository.deleteSession(session)
}

const getSession=async(id)=>{

    if(!id){
        throw new NotFoundError('session id is not included')
    }

    return await sessionRepository.getSession(id)
}


module.exports={createSession,deleteSession,updateSession,getSession}
