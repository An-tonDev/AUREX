const axios= require('axios')


const paystack=axios.create({
    baseURL:'https://api.paystack.co',
    headers:{
        Authorization:`bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-type':'application/json'
    }
})

module.exports=paystack
