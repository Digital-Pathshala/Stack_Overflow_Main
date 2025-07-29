import jwt from 'jsonwebtoken'

const createToken = (payLoad)=>{
    return jwt.sign(payload,process.env.JWT_SECRET)
}

export {createToken}

export const verifyToken = (token)=>{
    return jwt.verify(token.process.env.JWT_SECRET)
}