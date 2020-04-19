import { UserInputError } from "apollo-server";
import * as _ from 'ramda';
import { MutationCreateCategoryArgs, MutationCreateManyCategoriesArgs, MutationUpdateCategoryArgs, QueryCategoriesArgs } from "../config/schema.interface";
import { convertToResolverPipes, GQLResolver, makeResolver, resolverPipe } from "../utils/general-utils";

const categories: GQLResolver<QueryCategoriesArgs> = ({
    args: { ownerId },
    context: { prisma }
}) => prisma.category.findMany({
    where: { ownerId }, orderBy: { id: 'asc' }
});

const createCategory: GQLResolver<MutationCreateCategoryArgs> = async ({
    args: { data },
    context: { prisma, user }
}) => prisma.category.create({
    data: {
        ..._.omit(['checklistId'], data),
        checklist: {
            connect: { id: data.checklistId }
        },
        ...(user ? { user: { connect: { id: user.id } } } : undefined)
    }
});

const createManyCategories: GQLResolver<MutationCreateManyCategoriesArgs> = ({
    args: { data },
    context: { prisma }
}) => {
    const toPromisedData = data.map((category) => prisma.category.create({
        data: {
            ..._.omit(['checklistId'], category),
            checklist: { connect: { id: category.checklistId } }
        }
    }));
    return Promise.all(toPromisedData);
};

const updateCategories: GQLResolver<MutationUpdateCategoryArgs> = async ({
    args: { categoryId, data },
    context: { prisma, user }
}) => {
    const { count } = await prisma.category.updateMany({
        where: {
            id: categoryId,
            ownerId: user ? user.id : undefined
        },
        data: {
            ...data
        }
    });

    if (!count)
        throw new UserInputError(`Category with id ${categoryId} does not exist`);

    return count;
};

const tasks: GQLResolver<any> = makeResolver('category', 'tasks');
const checklist: GQLResolver<any> = makeResolver('category', 'checklist');
const owner: GQLResolver<any> = makeResolver('category', 'owner');

const categoryResolvers = convertToResolverPipes({
    Query: {
        categories,
    },
    Mutation: {
        createCategory,
        createManyCategories,
        updateCategories,
    },
    Category: {
        tasks: resolverPipe(tasks),
        checklist: resolverPipe(checklist),
        owner: resolverPipe(owner),
    }
});

export default categoryResolvers;
