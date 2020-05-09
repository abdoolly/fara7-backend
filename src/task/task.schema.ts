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
    id: Int!
    title: String!
    checklistId: Int!
    categoryId:  Int!
    ownerId:     Int!
    checklist: Checklist!
    category : Category!
    owner: User!
    cost: Float
    dueDate: DateTime @date
    overDue: Boolean
    status: Status
    done: Boolean!
    note: String
    orderNum: Int!
    createdAt: DateTime! 
    updatedAt: DateTime! 
}

type OrderTasksUpdateReturn {
    count: Int!
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
    orderTasksById(categoryId: Int!, currentOrder: [Int!]!, newOrder: [Int!]!): [OrderTasksUpdateReturn!]!
    taskDone(taskId: Int!): Int!
    taskUnDone(taskId: Int!): Int!
}
`;