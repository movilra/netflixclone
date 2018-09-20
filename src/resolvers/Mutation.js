const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const {APP_SECRET,PRICES} = require("../const");
const {getUserId} = require('../utils/utils');


const getID =  `{ id }`

const queryUser = `{
    id,
    email,
    name,
    lastname,
    birth_date,
    suscription{
        id,
        end_date,
        suscription_type,
        price
    }
}`

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

async function signup(parent,args,context,info) {
    const password = await bcrypt.hash(args.password,10)
    
    const user  = await context.db.mutation.createUser(
       {data:{...args,password,suscription:{
           create:{
            suscription_type:"FREE",
            price:0,
            end_date:new Date().addDays(30),
           }
       }}},queryUser)



    const token = await jsonwebtoken.sign({userId:user.id},APP_SECRET)
                    
 
    return {
        token,
        user
    }
}

async function login(parent,args,context,info){


    const user = await context.db.query.user({
        where:{email:args.email}})

    if(!user) throw new Error("Not such user find");

    console.log(user.password,args.password)
    const validPassword =  await bcrypt.compare(args.password,user.password);
    console.log(validPassword)
    if(!validPassword) throw new Error("Invalid password")

    const token = await jsonwebtoken.sign({userId:user.id},APP_SECRET)
    console.log("----->",user)

    return {
        token,
        user
    }

}



async function upgradeSuscription(parent,args,context,info){
    let user = getUserId(context)

    let days = (args.suscription_type == "PREMIUM") ? 90 : 30;

    // Paypal Stuff here

    let updatedUser = await context.db.mutation.updateUser(
        {
            data:{
                suscription:{
                    update:
                        {
                            suscription_type:args.suscription_type,
                            end_date:new Date().addDays(days),
                            price:PRICES[args.suscription_type]
                        }
                }
            },
            where:{
                id:user
            }

        },queryUser)

    return updatedUser


}   


const queryRate = `{

    id,
    rate,
    movie{
        title
    },
    user{
        name,
        lastname
    }
}`
async function addRating(parent,args,context,info){
    let user_id = getUserId(context)
    let newRate =  await context.db.mutation.createRating({data:{
        user:{
            connect:{
                id:user_id
            }
        },
        movie:{
            connect:{
                id:args.movie_id
            }
        },
        rate:args.rate
    }},queryRate)
    return newRate
}


async function updateUser(parent,args,context,info){
    let user_id = getUserId(context)
    if(args.password) args.password = await bcrypt.hash(args.password,10)


    let updatedUser =  await context.db.mutation.updateUser({
        data:{...args},where:{
            id:user_id
        }
    })

    return updatedUser

}





module.exports = {
    signup,
    addRating,
    updateUser,
    login,
    upgradeSuscription
}
