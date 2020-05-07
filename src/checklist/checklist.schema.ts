import { gql } from "apollo-server-express";

const inputsOnly = `
input CreateChecklistInput {
    title: String!
    en_title: String
    ar_title: String
}

input UpdateCheclistInput {
    title: String
    en_title: String
    ar_title: String
}
`;

const typesOnly = `
type Checklist {
    id: Int!
    title: String!
    en_title: String
    ar_title: String
    ownerId: Int
    owner: User
    collaborators: [User!]
    categories: [Category!]
}
`;

export const checklistTypeDef = gql`
${inputsOnly}
${typesOnly}

extend type Query {
    checklists(ownerId: Int): [Checklist!]
}

extend type Mutation {
    createChecklist(data: CreateChecklistInput!): Checklist!
    createManyChecklists(data: [CreateChecklistInput!]!): [Checklist!]!
    updateChecklist(checklistId: Int!, data: UpdateCheclistInput!): Int!
}
`;