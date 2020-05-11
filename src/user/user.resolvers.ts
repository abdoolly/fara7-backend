import { AuthenticationError, UserInputError } from "apollo-server-express";
import { isEmail, isNumberString } from 'class-validator';
import * as _ from 'ramda';
import { signJWT } from "../config/jwt";
import { MutationRegisterArgs, QueryLoginArgs, QueryValidateRegister } from "../config/schema.interface";
import { pipeP } from "../utils/functional-utils";
import { checkEmailUnique, checkPhoneAndEmail, checkPhoneUnique, convertToResolverPipes, GQLResolver, makeResolver, resolverPipe } from "../utils/general-utils";
import { getIdentifierObject } from "./user.utils";

const login: GQLResolver<QueryLoginArgs> = async ({
    args: { identifier, password },
    context: { prisma }
}) => {
    const user = await prisma.user.findOne({
        where: {
            email: isEmail(identifier) ? identifier : undefined,
            phone: isNumberString(identifier) ? identifier : undefined
        }
    });

    if (!user)
        throw new AuthenticationError('Wrong phone or password');

    if (user.password !== password)
        throw new AuthenticationError('Wrong phone or password');

    return {
        user,
        token: signJWT(_.omit(['password'], user))
    }
}

const register: GQLResolver<MutationRegisterArgs> = async ({
    args: { data: { identifier, ...data } },
    context: { prisma }
}) => {
    if (data.password !== data.confirmPassword)
        throw new UserInputError('Password and confirm password does not match');

    const mainUserData = _.omit(['confirmPassword'], {
        ...data,
    }) as any;

    const user = await prisma.user.create({
        data: {
            ...mainUserData,
            ...getIdentifierObject(identifier)
        }
    });

    return {
        user,
        token: signJWT(_.omit(['password'], user))
    }
};

const validateRegister: GQLResolver<QueryValidateRegister> = () => true;

const checklists: GQLResolver<any> = makeResolver('user', 'checklist');
const categories: GQLResolver<any> = makeResolver('user', 'categories');

const tasks: GQLResolver<any> = ({
    root,
    context: { prisma }
}) => {
    return prisma.task.findMany({
        where: {
            ownerId: root.id,
        }
    });
};

const collaboratedOn: GQLResolver<any> = makeResolver('user', 'collaboratedOn');

const userResolvers = convertToResolverPipes({
    Query: {
        login,
        validateRegister: pipeP([...checkPhoneAndEmail, validateRegister]),
    },
    Mutation: {
        register: pipeP([checkPhoneUnique, checkEmailUnique, register])
    },
    User: {
        checklists: resolverPipe(checklists),
        categories: resolverPipe(categories),
        tasks: resolverPipe(tasks),
        collaboratedOn: resolverPipe(collaboratedOn),
    }
});

export default userResolvers;
