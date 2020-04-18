import { ApolloServer, gql } from 'apollo-server-express';
import casual from 'casual';
import { DateTimeResolver, EmailAddressResolver, ObjectIDResolver, URLResolver } from 'graphql-scalars';
import userResolvers from '../../user/user.resolvers';
import { userTypeDef } from '../../user/user.schema';
import { fromHeaderOrQuerystring, verifyJWT } from '../jwt';
import { UpperCaseDirective } from './directives/auth.directive';
import { DateFormatDirective } from './directives/date.directive';
import { PrismaClient } from '@prisma/client';
import { checklistTypeDef } from '../../checklist/checklist.schema';
import { categoryTypeDef } from '../../category/category.schema';
import { taskTypeDef } from '../../task/task.schema';

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
    mocks,
    resolvers: [
        userResolvers,
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
    schemaDirectives: {
        // auth: AuthDirective,
        upper: UpperCaseDirective,
        date: DateFormatDirective
    },
    formatError: (err) => {
        if (err.name === 'ValidationError')
            return err;

        console.log('\x1b[41m', 'Error:', err.message);

        if (err.extensions)
            console.log('\x1b[41m', err.extensions.exception.stacktrace.join('\n'));

        return err;
    },
    tracing: true,
});

export default apolloServer;