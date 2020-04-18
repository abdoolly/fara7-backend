import { gql } from "apollo-server-express";

const inputsOnly = `
input RegisterInput {
    identifier: String
    password: String!
    confirmPassword: String!
}
`;

const typesOnly = `
type User {
    id: ID!
    email: String
    phone: String
    name: String
    checklists: [Checklist!]
    categories: [Category!]
    tasks: [Task!]
    collaboratedOn: [User!]
    createdAt: DateTime!
    updatedAt: DateTime!
}

type AuthenticatedUserOutput {
    user: User!
    token: String!
}
`;

export const userTypeDef = gql`
${inputsOnly}
${typesOnly}

type Query {
    login(identifier: String!, password: String!): AuthenticatedUserOutput!
}

type Mutation {
    register(data: RegisterInput!): AuthenticatedUserOutput!
}
`;