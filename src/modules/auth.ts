import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const ROUNDS = process.env.SALT_ROUNDS || 7

export const createJWT(user:{id: string, username: string}): string => {
    return jwt.sign({id: user.id, username:user.username}, process.env.JWT_SECRET as string);
}

export const decodeToken = (req,res,next)=> {
    const [_, token] = req.headers.cookie.split("=")
    if (!token) {
        res.status(401)
        res.json({message:"unauthorized"})
        return
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    }catch(e){
        res.status(401)
        res.json({message:"not valid token"})
        return
    }
}

export const comparePasswords(password:string, hash:string): Promise<boolean> =>{
    return bcrypt.compare(password, hash)
}

export const hashPassword(password: string): Promise<boolean> => {
    return bcrypt.hash(password, ROUNDS)
}

e