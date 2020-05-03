import { gql } from "apollo-server-express";

const inputsOnly = `
input CreateTaskInput {
    title: String!
    checklistId: Int!
    categoryId: Int!
    cost: Float
    dueDate: DateTime
    note: String
}

input UpdateTaskInput {
    title: String
    checklistId: Int
    categoryId: Int
    cost: Float
    dueDate: DateTime
    status: Status
    note: String
}
`;

const typesOnly = `
enum Status {
    done
    pending
}

type Task {
    id: ID!
    title: String!
    checklistId: Int!
    categoryId:  Int!
    ownerId:     Int!
    checklist: Checklist!
    category : Category!
    owner: User!
    cost: Float
    dueDate: DateTime @date
    status: Status
    done: Boolean!
    note: String
    createdAt: DateTime! 
    updatedAt: DateTime! 
}
`;

export const taskTypeDef = gql`
${inputsOnly}
${typesOnly}

extend type Query {
    tasks(title_contain: String , categoryId: Int, checklistId: Int): [Task!]
}

extend type Mutation {
    createTask(data: CreateTaskInput!): Task!
    updateTask(taskId: Int!, data: UpdateTaskInput!): Task!
    removeTask(taskId: Int!): Boolean!
}
`;