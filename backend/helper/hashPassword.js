const bcrypt=require("bcrypt")

module.exports ={
    hashedPass:async(password)=>{
       try {
         console.log('hash password')
          const hashedPass = await bcrypt.hash(password,10);
          return hashedPass;
       } catch (error) {
          console.log(error.message);
       }
    },
 
    comparePass:async(password,hashedPass)=>{
       try {
          const match = await bcrypt.compare(password,hashedPass)
          return match;
       } catch (error) {
          console.log(error.message);
       }
    }
 }