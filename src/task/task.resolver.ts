import { UserInputError } from "apollo-server";
import * as _ from 'ramda';
import { MutationCreateTaskArgs, MutationUpdateTaskArgs, QueryTasksArgs, MutationRemoveTaskArgs } from "../config/schema.interface";
import { pipeP } from "../utils/functional-utils";
import { convertToResolverPipes, GQLResolver, isAuthenticated, makeResolver, resolverPipe } from "../utils/general-utils";

const tasks: GQLResolver<QueryTasksArgs> = ({
    args: { title_contain, categoryId, checklistId } = {},
    context: { prisma }
}) => prisma.task.findMany({
    where: {
        categoryId,
        checklistId,
        ...(title_contain ? {
            title: {
                contains: title_contain
            }
        } : undefined)
    }, orderBy: { id: 'asc' }
});

const createTask: GQLResolver<MutationCreateTaskArgs> = ({
    args: { data: { checklistId, categoryId, ...data } },
    context: { prisma, user }
}) => prisma.task.create({
    data: {
        ..._.omit(['checklistId', 'categoryId'], data),
        owner: {
            connect: {
                id: user.id
            }
        },
        checklist: {
            connect: { id: checklistId }
        },
        category: {
            connect: { id: categoryId }
        }
    }
});

const updateTask: GQLResolver<MutationUpdateTaskArgs> = async ({
    args: { taskId, data },
    context: { prisma, user }
}) => {
    let tasks = await prisma.task.findMany({
        where: {
            id: taskId,
            ownerId: user.id
        }
    });

    if (!tasks.length)
        throw new UserInputError(`Task with id ${taskId} does not exist`);

    const task = await prisma.task.update({
        where: {
            id: taskId,
        },
        data: {
            ..._.omit(['checklistId', 'categoryId'], data),
            ...(data.checklistId ? {
                checklist: {
                    connect: {
                        id: data.checklistId
                    }
                }
            } : undefined),
            ...(data.categoryId ? {
                category: {
                    connect: {
                        id: data.categoryId
                    }
                }
            } : undefined)
        }
    });

    return task;
};

const removeTask: GQLResolver<MutationRemoveTaskArgs> = async ({
    args: { taskId },
    context: { prisma, user }
}) => {
    const payload = await prisma.task.deleteMany({
        where: {
            id: taskId,
            ownerId: user.id
        }
    });

    return payload.count !== 0;
};

const checklist: GQLResolver<any> = makeResolver('task', 'checklist');
const category: GQLResolver<any> = makeResolver('task', 'category');
const owner: GQLResolver<any> = makeResolver('task', 'owner');

/**
 * @description resolving the done property using the status
 * @param param0 
 */
const done: GQLResolver<any> = async ({ root, context: { prisma } }) => {
    const task = await prisma.task.findOne({ where: { id: root.id } });
    return task?.status === 'done';
};

const taskResolvers = convertToResolverPipes({
    Query: {
        tasks: pipeP([isAuthenticated, tasks]),
    },
    Mutation: {
        createTask: pipeP([isAuthenticated, createTask]),
        updateTask: pipeP([isAuthenticated, updateTask]),
        removeTask: pipeP([isAuthenticated, removeTask]),
    },
    Task: {
        checklist: resolverPipe(checklist),
        category: resolverPipe(category),
        owner: resolverPipe(owner),
        done: resolverPipe(done),
    }
});

export default taskResolvers;
