import { gql } from "apollo-server-express";

const inputsOnly = `
input CreateCategoryInput {
    title: String!
    checklistId: Int!
    en_title: String
    ar_title: String
}

input UpdateCategoryInput {
    title: String
    checklistId: Int
    en_title: String
    ar_title: String
}
`;

const typesOnly = `
type Category {
    id: Int!
    title: String!
    en_title: String
    ar_title: String
    checklist: Checklist!
    owner: User!
    ownerId: Int!
    checklistId: Int!
    tasks: [Task!]
}
`;

export const categoryTypeDef = gql`
${inputsOnly}
${typesOnly}

extend type Query {
    categories(ownerId: Int,checklistId: Int): [Category!]
}

extend type Mutation {
    createCategory(data: CreateCategoryInput!): Category!
    createManyCategories(data: [CreateCategoryInput!]!): [Category!]!
    updateCategory(categoryId: Int!, data: UpdateCategoryInput!): Category!
}
`;