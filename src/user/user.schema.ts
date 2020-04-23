import { gql } from "apollo-server-express";

const inputsOnly = `
input RegisterInput {
    identifier: String!
    name: String
    password: String!
    confirmPassword: String!
    gender: Gender!
    spouseName: String
    marriageDate: DateTime
    prepCost: Int
}
`;

const typesOnly = `
enum Gender {
    Male
    Female
}

type User {
    id: ID!
    email: String
    phone: String
    name: String
    spouseName: String
    gender: Gender
    marriageDate: DateTime @date
    prepCost: Int
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
    validateRegister(identifier: String!) : Boolean!
}

type Mutation {
    register(data: RegisterInput!): AuthenticatedUserOutput!
}
`;