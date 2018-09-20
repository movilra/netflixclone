const {getUserId} = require('../utils/utils');

async function users(parent,args,context,info) {
    return context.db.query.users({},info)
}

async function me(parent,args,context,info){
    let id  = getUserId(context)
    return context.db.query.user({where:{ id }},info)
}

async function movies(parent,args,context,info){
    let user = getUserId(context) 
    return context.db.query.movies({},info)
}

async function movie(parent,args,context,info){
    let user = getUserId(context) 
    return context.db.query.movie({where:{id:args.id}},info)
}

async function moviesGenre(parent,args,context,info){
    let user = getUserId(context) 
    return context.db.query.movies({where:{genre:args.genre}},info)
}

async function moviesCategory(parent,args,context,info){
    let user = getUserId(context) 
    return context.db.query.movies({where:{category:args.category}},info)
}

async function moviesSuscription(parent,args,context,info){
    let user = getUserId(context) 
    return context.db.query.movies({where:{suscription_type:args.suscription}},info)
}

module.exports = {
    users,
    me,
    movies,
    movie,
    moviesGenre,
    moviesCategory,
    moviesSuscription
}