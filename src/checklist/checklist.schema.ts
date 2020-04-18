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
    id: ID!
    title: String!
    en_title: String
    ar_title: String
    ownerId: Int!
    owner: User!
    collaborators: [User!]
    categories: [Category!]
}
`;

export const checklistTypeDef = gql`
${inputsOnly}
${typesOnly}

extend type Query {
    checklists(ownerId: ID): [Checklist!]
}

extend type Mutation {
    createChecklist(data: CreateChecklistInput!): Checklist!
    createManyChecklists(data: [CreateChecklistInput!]!): [Checklist!]!
    updateChecklist(checklistId: ID!, data: UpdateCheclistInput!): Checklist!
}
`;