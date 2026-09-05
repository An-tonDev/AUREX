class AppError extends Error{
   constructor(message,statusCode){
    super(message)
    this.statusCode=statusCode
    this.status=`${statusCode}`.startsWtih('4') ? 'fail' : 'error'
    this.isOperational=true
    Error.captureStackTrace(this,this.constructor)
   }
}


class NotFoundError extends AppError{
    constructor(message){
        super(message||'not found no the server',404)
        this.name='notfound error'
    }
}

class ConflictError extends AppError{
    constructor(message){
        super(message,409)
        this.name='conflict error'
    }
}

class unAuhtorizedError extends AppError{
    constructor(message){
        super(message || 'you are not authorized to access this route',401)
        this.name='unAuthorized error'
    }
}

class ForbiddenError extends AppError{
    constructor(message){
        super(message || 'you do not have permission to access this route',403)
        this.name='forbidden error'
    }
}

module.exports={AppError,ForbiddenError,unAuhtorizedError
    ,NotFoundError,ConflictError}