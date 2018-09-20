
function newMovieSubscribe(parent,args,context,info) {

    return context.db.subscription.movie(
        { where:
            {mutation_in:["CREATED"]}
        },info)

}


const newMovie = {
    subscribe:newMovieSubscribe
}


module.exports = {
    newMovie
}