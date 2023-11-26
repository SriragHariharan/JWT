const db=require('../configs/mongoDB')
const collections=require('../configs/collection')
const bcrypt=require('bcrypt')

module.exports={

    getPalaces: () => {
        return new Promise(async(resolve, reject) => {
            let palaces = await db.get().collection(collections.PALACES_COLLECTION).find().toArray();
            resolve(palaces)
        })
    },

    addNewUser : (signupDetails)=> {
        return new Promise(async(resolve, reject) => {
            let userExists = await db.get().collection(collections.USER_COLLECTION).findOne({email:signupDetails.email})
            if(userExists==null){
                signupDetails.password = await bcrypt.hash(signupDetails.password, 10);
                db.get().collection(collections.USER_COLLECTION).insertOne(signupDetails)
                .then(response => {
                    resolve({"status":true, "userID":response.insertedId, "name":signupDetails.name})
                })
            }else{
                reject("User already exists")
            }
            
        })
    },

    validateUser : (loginFormData) => {
        return new Promise(async(resolve, reject) => {
            let emailExists = await db.get().collection(collections.USER_COLLECTION).findOne({email:loginFormData.email});
            if(emailExists){
                let pwdVerification = await bcrypt.compare(loginFormData.password, emailExists.password);
                if(pwdVerification){
                    resolve({"userID":emailExists._id, "name":emailExists.name});
                }else{
                    reject("Authentication Failed")
                }
            }else{
                console.log("User doesnt exist !");
                reject("Authentication Failed")
            }
        })
    }
}

// if(userExists==null){
//     
// }else{
//         
// }