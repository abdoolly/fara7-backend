import { AuthenticationError, toApolloError, UserInputError } from "apollo-server-express";
import * as _ from 'ramda';
import { signJWT } from "../config/jwt";
import { pipeP } from "../utils/functional-utils";
import { checkPhoneUnique, convertToResolverPipes, GQLResolver, resolverPipe } from "../utils/general-utils";

// const login: GQLResolver<any> = async ({
//     args: { phone, password },
//     context: { prisma }
// }) => {
//     const user = await prisma.user({ phone });
//     if (!user)
//         throw new AuthenticationError('Wrong phone or password');

//     if (user.password !== password)
//         throw new AuthenticationError('Wrong phone or password');

//     return {
//         user,
//         token: signJWT(_.omit(['password'], user))
//     }
// }

// const registerUser: GQLResolver<CreateTeacherArgs> = async ({
//     args: { data },
//     context: { prisma }
// }) => {
// if (data.password !== data.confirmPassword)
//     throw new UserInputError('Password and confirm password does not match');

// const mainUserData = _.omit(['confirmPassword', 'subjects', 'profileImg'], {
//     ...data,
//     userType: data.userType,
// }) as any;

// let downloadPath = null;
// try {
//     ({ downloadPath } = await uploadFile(data.profileImg, IMG_UPLOAD_LOCATION) as any);
// } catch (err) {
//     throw toApolloError(err);
// }

// const user = await prisma.createUser({
//     ...mainUserData,
//     profileImg: downloadPath || null,
//     // connecting the subjects incase they exist 
//     ...(
//         data.subjects ? {
//             subjects: {
//                 connect: data.subjects.map((_id) => ({ _id }))
//             }
//         } : undefined)
// });

// return {
//     user,
//     token: signJWT(_.omit(['password'], user))
// }
// };

const userResolvers = convertToResolverPipes({
    Query: {

    },
    Mutation: {

    },
    User: {

    }
});

export default userResolvers;
