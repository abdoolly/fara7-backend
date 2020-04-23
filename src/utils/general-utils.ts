import { PrismaClient, User } from '@prisma/client';
import { ForbiddenError, ValidationError } from 'apollo-server-express';
import * as crypto from 'crypto';
import { Request, Response } from 'express';
import { FieldNode, FragmentDefinitionNode, GraphQLObjectType, GraphQLOutputType, GraphQLSchema, OperationDefinitionNode } from 'graphql';
import { Path } from 'graphql/jsutils/Path';
import * as _ from 'ramda';
import { PipeInterface, pipeP, tapP } from './functional-utils';

export interface GraphQlContext {
    prisma: PrismaClient;
    user: User;
    res: Response;
    req: Request;
}

export type ObjMap<T> = { [key: string]: T };

export type GraphQLResolveInfo<T> = {
    fieldName: string,
    fieldNodes: FieldNode[],
    returnType: GraphQLOutputType,
    parentType: GraphQLObjectType,
    path: Path,
    schema: GraphQLSchema,
    fragments: ObjMap<FragmentDefinitionNode>,
    rootValue: any,
    operation: OperationDefinitionNode,
    variableValues: GQLResolver<T>,
};

export interface ResolverArgs<T> {
    root: any;
    args: T;
    context: GraphQlContext;
    info: GraphQLResolveInfo<T>;
}

/**
 * @description types for the resolver functions
 */
export type GQLResolver<T> = (object: ResolverArgs<T>) => any;

/**
 * @description making my own pipe to fix the type errors 
 */
const pipe: PipeInterface = _.pipe as any;

/**
 * @description turning the arguments to make them one object to be more functional
 * @param root 
 * @param args 
 * @param context 
 */
const makeResolverArgs = (root, args, context, info): ResolverArgs<any> => ({ root, args, context, info });

/**
 * @description special pipe function for resolvers
 * @param  {...any} fns 
 */
export const resolverPipe = (...fns: any[]): any => {
    return (root, args, context, info) => pipeP([...fns])(makeResolverArgs(root, args, context, info));
};

/**
 * @description let the resolver functions get their arguments as objects instead of arguments
 * @param {*} param0 
 */
export const convertToResolverPipes = ({ Query = {}, Mutation = {}, ...otherResolvers }) => {
    return {
        Query: resolverPiper(Query),
        Mutation: resolverPiper(Mutation),
        ...otherResolvers
    }
}

/**
 * @description helper for the convertToResolverPipes
 * @param {*} toIterateOn 
 */
const resolverPiper = (toIterateOn) => {
    let newIterator = {};
    for (let [resolverName, fn] of Object.entries(toIterateOn)) {
        newIterator[resolverName] = resolverPipe(fn);
    }

    return newIterator;
}

/**
 * @description authentication middleware
 */
export const isAuthenticated: GQLResolver<{}> = _.tap(({ context }) => {
    if (!context.user)
        throw new ForbiddenError('You are not authenticated');
});

/**
 * @description graphql middleware that will make sure that a certain field is unique
 * @param param0 
 */
const _SBU = (modelName: string | 'user', pathLensInArgs: _.Lens, dbFieldName: string) =>
    tapP(async ({
        args,
        context: { prisma }
    }: ResolverArgs<any>) => {
        const fieldToCheck = _.view(pathLensInArgs, args);
        let found = null;

        if (fieldToCheck)
            found = await prisma[modelName].findOne({ where: { [dbFieldName]: fieldToCheck } });

        if (found)
            throw new ValidationError(`${dbFieldName} already exists`);
    })
// curried version of the above function just made it in another line for more readability 
export const shouldBeUnique = _.curry(_SBU);
export const checkPhoneUnique = shouldBeUnique('user', _.lensPath(['data', 'identifier']), 'phone');
export const checkEmailUnique = shouldBeUnique('user', _.lensPath(['data', 'identifier']), 'email');
export const checkPhoneAndEmail = [
    shouldBeUnique('user', _.lensPath(['identifier']), 'phone'),
    shouldBeUnique('user', _.lensPath(['identifier']), 'email'),
];


export const toIdsObject = (arrIds?: any) => arrIds ? arrIds.map((_id) => ({ _id })) : undefined;

export const OnlyTime = (time: string) => new Date(`1970-01-01 ${time}`);

export const OnlyDate = (date: string) => new Date(`${date} 00:00`);

/**
 * @description extract extension from file name 
 */
export const getExtensionFromFileName = _.pipe(_.split('.'), _.last);

export const randomString = () => crypto.randomBytes(8).toString('hex');


// sunday(0) saturday(6)
export const nextDate = (day: string): Date => {
    const days = {
        "Sunday": 0,
        "Monday": 1,
        "Tuesday": 2,
        "Wednesday": 3,
        "Thursday": 4,
        "Friday": 5,
        "Saturday": 6,
    };

    let dayIndex = days[day];

    var today = new Date();
    today.setDate(today.getDate() + (dayIndex - 1 - today.getDay() + 7) % 7 + 1);
    return today;
}

export const makeResolver = (modelName: string, relationName: string) => ({ root, context: { prisma } }) =>
    prisma[modelName].findOne({ where: { id: root.id } })[relationName]();