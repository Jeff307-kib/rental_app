import jwt from "jsonwebtoken"

const expireDate = 60*60*24*5

export const createToken = (id) => {
    return jwt.sign({id} , process.env.JWT_SECRET_KEY,{expiresIn: expireDate})
}