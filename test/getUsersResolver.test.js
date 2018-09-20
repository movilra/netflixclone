const {resolvers} =  require('../src');
const {getPrismaTestInstance} = require('./getPrismaTestInstance')

afterEach( async () => {
    await getPrismaTestInstance().mutation.deleteManyUsers({where:{}})
})


test('Query users all works', async () => {
    await getPrismaTestInstance().mutation.createUser(
        {
            data:{
                name:"tes1",
                lastname:"test",
                email:"test@gmail.com",
                password:"eltest",
                birth_date:"1992-08-09T00:00:00"
            }
        },`{ id }`);



    expect(
            await resolvers.Query.users(
                {},
                {},
                {db:getPrismaTestInstance()},
                `{name,lastname,email}`
            )
    ).toMatchSnapshot();


})


test('Query users all works', async () => {
   let user =  await getPrismaTestInstance().mutation.createUser(
        {
            data:{
                name:"tes1",
                lastname:"test",
                email:"test@gmail.com",
                password:"eltest",
                birth_date:"1992-08-09T00:00:00"
            }
        },`{ id }`);

    let token = jwt.sign({userId:user},APP_SECRET)


    expect(
            await resolvers.Query.users(
                {},
                {},
                {request:{Authorization:`JWT ${token}`}
                    db:getPrismaTestInstance()},
                `{name,lastname,email}`
            )
    ).toMatchSnapshot();


})