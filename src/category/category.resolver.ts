import { UserInputError } from "apollo-server";
import * as _ from 'ramda';
import { MutationCreateCategoryArgs, MutationCreateManyCategoriesArgs, MutationUpdateCategoryArgs, QueryCategoriesArgs } from "../config/schema.interface";
import { convertToResolverPipes, GQLResolver, makeResolver, resolverPipe } from "../utils/general-utils";

const categories: GQLResolver<QueryCategoriesArgs> = ({
    args: { ownerId, checklistId },
    context: { prisma }
}) => prisma.category.findMany({
    where: { ownerId, checklistId }, orderBy: { id: 'asc' }
});

const createCategory: GQLResolver<MutationCreateCategoryArgs> = ({
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

const updateCategory: GQLResolver<MutationUpdateCategoryArgs> = async ({
    args: { categoryId, data },
    context: { prisma, user }
}) => {
    let categories = await prisma.category.findMany({
        where: {
            id: categoryId,
            ownerId: user?.id
        }
    });

    if (!categories.length)
        throw new UserInputError(`Category with id ${categoryId} does not exist`);

    const category = await prisma.category.update({
        where: {
            id: categoryId,
        },
        data: {
            ..._.omit(['checklistId'], data),
            ...(data.checklistId ? {
                checklist: {
                    connect: {
                        id: data.checklistId
                    }
                }
            } : undefined)
        }
    });

    return category;
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
        updateCategory,
    },
    Category: {
        tasks: resolverPipe(tasks), // user in this case should be authenticated
        checklist: resolverPipe(checklist),
        owner: resolverPipe(owner),
    }
});

export default categoryResolvers;
