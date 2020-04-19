import { UserInputError } from "apollo-server";
import { MutationCreateChecklistArgs, MutationCreateManyChecklistsArgs, MutationUpdateChecklistArgs, QueryChecklistsArgs } from "../config/schema.interface";
import { convertToResolverPipes, GQLResolver, makeResolver, resolverPipe } from "../utils/general-utils";

const checklists: GQLResolver<QueryChecklistsArgs> = ({
    args: { ownerId },
    context: { prisma }
}) => prisma.checklist.findMany({
    where: { ownerId }, orderBy: { id: 'asc' }
});

const createChecklist: GQLResolver<MutationCreateChecklistArgs> = async ({
    args: { data },
    context: { prisma, user }
}) => prisma.checklist.create({
    data: {
        ...data,
        ...(user ? { user: { connect: { id: user.id } } } : undefined)
    }
});

const createManyChecklists: GQLResolver<MutationCreateManyChecklistsArgs> = ({
    args: { data },
    context: { prisma }
}) => {
    const toPromisedData = data.map((checklist) => prisma.checklist.create({ data: checklist }));
    return Promise.all(toPromisedData);
};

const updateChecklist: GQLResolver<MutationUpdateChecklistArgs> = async ({
    args: { checklistId, data },
    context: { prisma, user }
}) => {
    const { count } = await prisma.checklist.updateMany({
        where: {
            id: checklistId,
            ownerId: user ? user.id : undefined
        },
        data: {
            ...data
        }
    });

    if (!count)
        throw new UserInputError(`Checklist with id ${checklistId} does not exist`);

    return count;
};

const owner: GQLResolver<any> = makeResolver('checklist', 'owner');
const collaborators: GQLResolver<any> = makeResolver('checklist', 'collaborators');
const categories: GQLResolver<any> = makeResolver('checklist', 'categories');

const checklistResolvers = convertToResolverPipes({
    Query: {
        checklists,
    },
    Mutation: {
        createChecklist,
        createManyChecklists,
        updateChecklist,
    },
    Checklist: {
        owner: resolverPipe(owner),
        collaborators: resolverPipe(collaborators),
        categories: resolverPipe(categories),
    }
});

export default checklistResolvers;
