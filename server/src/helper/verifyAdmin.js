import prisma from "./pooler.js";
import bcrypt from 'bcrypt'
export async function verifyAdmin(email,password) {
    try{
        const admin = await prisma.admin.findFirst({
            where:{
                email:email.toLowerCase()
            }
        })
        if (!admin) {
	  return null;
	}
       const isPasswordValid = await bcrypt.compare(password,admin.password) 
       if(isPasswordValid){
        return {id:admin.id ,email:admin.email,role:admin.role}
       }
       else{
        return null}
    }
    catch(e){
        console.error("Error in verifying admin");
        return null
    }
}