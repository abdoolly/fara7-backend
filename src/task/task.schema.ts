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
    note: String
    createdAt: DateTime! 
    updatedAt: DateTime! 
}
`;

export const taskTypeDef = gql`
${inputsOnly}
${typesOnly}

extend type Query {
    tasks(categoryId: ID, checklistId: ID): [Task!]
}

extend type Mutation {
    createTask(data: CreateTaskInput!): Task!
    createManyTasks(data: [CreateTaskInput!]!): [Task!]!
    updateTask(taskId:ID!, data: UpdateTaskInput!): Task!
}
`;