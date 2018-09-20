const  {Prisma} = require('prisma-binding');


const getPrismaTestInstance = () => {

    return new Prisma({
        typeDefs:'src/generated/prisma.graphql',
        endpoint:"https://infinite-meadow-18055.herokuapp.com/test/test"
    })

}


module.exports = {
    getPrismaTestInstance

}