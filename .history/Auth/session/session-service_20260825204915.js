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

const deleteSession=async(data)=>{

    const session= await sessionRepository.getSessionByRefreshToken(data)
    return await sessionRepository.deleteSession(session.id)
}

const getSession=async(refeshtokenhash)=>{

    if(!refeshtokenhash){
        throw new ValidationError('session not found')
    }

    const session= await sessionRepository.getSessionByRefreshToken(refeshtokenhash)

    if(!session){
        throw new NotFoundError('session does not exist')
    }
    return session
}


module.exports={createSession,deleteSession,updateSession,getSession}
