import { UserInputError, ValidationError } from "apollo-server";
import * as _ from 'ramda';
import { MutationCreateTaskArgs, MutationUpdateTaskArgs, QueryTasksArgs, MutationRemoveTaskArgs, MutationOrderTask } from "../config/schema.interface";
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
    }, orderBy: { orderNum: 'asc' }
});

const createTask: GQLResolver<MutationCreateTaskArgs> = async ({
    args: { data: { checklistId, categoryId, ...data } },
    context: { prisma, user }
}) => {

    // getting the lastTask to be able to increment it's orderNum 
    // and create the new record with the new orderNum
    let [lastTask] = await prisma.task.findMany({
        where: {
            ownerId: user.id
        },
        first: 1,
        orderBy: { orderNum: 'desc' }
    });

    let orderNum = 0;
    if (lastTask)
        orderNum = lastTask.orderNum + 1;

    return prisma.task.create({
        data: {
            ..._.omit(['checklistId', 'categoryId'], data),
            orderNum,
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
    })
};

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

const orderTasks: GQLResolver<MutationOrderTask> = async ({
    args: { currentOrder, newOrder },
    context: { prisma, user }
}) => {
    if (currentOrder.length !== newOrder.length)
        throw new ValidationError('currentOrder and newOrder length should be equal');

    let updateQueries: Promise<any>[] = [];
    for (let [index, currentTaskId] of Object.entries(currentOrder)) {
        let newTaskId = newOrder[index];

        if (currentTaskId !== newTaskId) {
            updateQueries.push(
                prisma.task.updateMany({ where: { id: newTaskId, ownerId: user.id }, data: { orderNum: +index } })
            );
        }
    }

    return await Promise.all(updateQueries);
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
        orderTasks: pipeP([isAuthenticated, orderTasks]),
    },
    Task: {
        checklist: resolverPipe(checklist),
        category: resolverPipe(category),
        owner: resolverPipe(owner),
        done: resolverPipe(done),
    }
});

export default taskResolvers;
