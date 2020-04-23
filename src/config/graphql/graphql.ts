import { PrismaClient } from '@prisma/client';
import { ApolloServer, gql } from 'apollo-server-express';
import { DateTimeResolver, EmailAddressResolver, ObjectIDResolver, URLResolver } from 'graphql-scalars';
import categoryResolvers from '../../category/category.resolver';
import { categoryTypeDef } from '../../category/category.schema';
import checklistResolvers from '../../checklist/checklist.resolver';
import { checklistTypeDef } from '../../checklist/checklist.schema';
import taskResolvers from '../../task/task.resolver';
import { taskTypeDef } from '../../task/task.schema';
import userResolvers from '../../user/user.resolvers';
import { userTypeDef } from '../../user/user.schema';
import { fromHeaderOrQuerystring, verifyJWT } from '../jwt';
import { UpperCaseDirective } from './directives/auth.directive';
import { DateFormatDirective } from './directives/date.directive';

// mocking layer
const mocks = {
    User: () => ({

    }),
};

export const prisma = new PrismaClient();

const basicTypeDef = gql`
directive @upper on FIELD_DEFINITION

directive @date(
    format: String = "YYYY-M-D"
) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION

scalar DateTime
scalar EmailAddress
scalar URL
scalar ObjectID
`;

const scalarResolvers = {
    DateTime: DateTimeResolver,
    EmailAddress: EmailAddressResolver,
    URL: URLResolver,
    ObjectID: ObjectIDResolver
};

// apollo server here
const apolloServer = new ApolloServer({
    typeDefs: [
        basicTypeDef,
        checklistTypeDef,
        categoryTypeDef,
        taskTypeDef,
        userTypeDef,
    ],
    resolvers: [
        userResolvers,
        checklistResolvers,
        categoryResolvers,
        taskResolvers,
        scalarResolvers,
    ],
    context: ({ req, res }) => {
        if (!req) {
            return { prisma, res, req }
        }

        // JWT authentication
        let user;
        const token = fromHeaderOrQuerystring(req);
        if (token)
            user = verifyJWT(token);

        return {
            prisma,
            user,
            res,
            req
        };
    },
    debug: true,
    schemaDirectives: {
        // auth: AuthDirective,
        upper: UpperCaseDirective,
        date: DateFormatDirective
    },
    formatError: (err) => {
        if (err.name === 'ValidationError')
            return err;

        console.log('Error:', err.message);

        if (err.extensions)
            console.log(err.extensions.exception.stacktrace.join('\n'));

        delete err.extensions?.exception?.stacktrace;

        return err;
    },
    tracing: true,
    playground: true,
    introspection: true
});

export default apolloServer;