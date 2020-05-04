export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    DateTime: any;
};

export type QueryValidateRegister = {
    identifier: string;
};

export type Category = {
    __typename?: "Category";
    id: Scalars["ID"];
    title: Scalars["String"];
    en_title?: Maybe<Scalars["String"]>;
    ar_title?: Maybe<Scalars["String"]>;
    checklist: Checklist;
    owner: User;
    ownerId: Scalars["Int"];
    checklistId: Scalars["Int"];
    tasks?: Maybe<Array<Task>>;
};

export type Checklist = {
    __typename?: "Checklist";
    id: Scalars["ID"];
    title: Scalars["String"];
    en_title?: Maybe<Scalars["String"]>;
    ar_title?: Maybe<Scalars["String"]>;
    ownerId: Scalars["Int"];
    owner: User;
    collaborators?: Maybe<Array<User>>;
    categories?: Maybe<Array<Category>>;
};

export type CreateCategoryInput = {
    title: Scalars["String"];
    checklistId: Scalars["Int"];
    en_title?: Maybe<Scalars["String"]>;
    ar_title?: Maybe<Scalars["String"]>;
};

export type CreateChecklistInput = {
    title: Scalars["String"];
    en_title?: Maybe<Scalars["String"]>;
    ar_title?: Maybe<Scalars["String"]>;
};

export type CreateTaskInput = {
    title: Scalars["String"];
    checklistId: Scalars["Int"];
    categoryId: Scalars["Int"];
    cost?: Maybe<Scalars["Float"]>;
    dueDate?: Maybe<Scalars["DateTime"]>;
    note?: Maybe<Scalars["String"]>;
};

export type MutationRegisterArgs = {
    data: RegisterInput;
};

export type MutationCreateChecklistArgs = {
    data: CreateChecklistInput;
};

export type MutationCreateManyChecklistsArgs = {
    data: Array<CreateChecklistInput>;
};

export type MutationUpdateChecklistArgs = {
    checklistId: Scalars["Int"];
    data: UpdateCheclistInput;
};

export type MutationCreateCategoryArgs = {
    data: CreateCategoryInput;
};

export type MutationCreateManyCategoriesArgs = {
    data: Array<CreateCategoryInput>;
};

export type MutationUpdateCategoryArgs = {
    categoryId: Scalars["Int"];
    data: UpdateCategoryInput;
};

export type MutationCreateTaskArgs = {
    data: CreateTaskInput;
};

export type MutationCreateManyTasksArgs = {
    data: Array<CreateTaskInput>;
};

export type MutationUpdateTaskArgs = {
    taskId: Scalars["Int"];
    data: UpdateTaskInput;
};

export type QueryLoginArgs = {
    identifier: Scalars["String"];
    password: Scalars["String"];
};

export type QueryChecklistsArgs = {
    ownerId?: Maybe<Scalars["Int"]>;
};

export type QueryCategoriesArgs = {
    ownerId?: Maybe<Scalars["Int"]>;
    checklistId?: Maybe<Scalars["Int"]>;
};

export type QueryTasksArgs = {
    title_contain?: Maybe<Scalars["String"]>;
    categoryId?: Maybe<Scalars["Int"]>;
    checklistId?: Maybe<Scalars["Int"]>;
};

export type RegisterInput = {
    identifier: Scalars["String"];
    name: Scalars["String"];
    password: Scalars["String"];
    confirmPassword: Scalars["String"];
    gender: Gender;
    spouseName: String;
    marriageDate?: Date;
    prepCost: Number;
};

export enum Status {
    Done = "done",
    Pending = "pending"
}

export enum Gender {
    Male = "Male",
    Female = "Female"
}

export type Task = {
    __typename?: "Task";
    id: Scalars["ID"];
    title: Scalars["String"];
    checklistId: Scalars["Int"];
    categoryId: Scalars["Int"];
    ownerId: Scalars["Int"];
    checklist: Checklist;
    category: Category;
    owner: User;
    cost?: Maybe<Scalars["Float"]>;
    dueDate?: Maybe<Scalars["DateTime"]>;
    status?: Maybe<Status>;
    note?: Maybe<Scalars["String"]>;
    createdAt: Scalars["DateTime"];
    updatedAt: Scalars["DateTime"];
};

export type UpdateCategoryInput = {
    title?: Maybe<Scalars["String"]>;
    checklistId?: Maybe<Scalars["Int"]>;
    en_title?: Maybe<Scalars["String"]>;
    ar_title?: Maybe<Scalars["String"]>;
};

export type UpdateCheclistInput = {
    title?: Maybe<Scalars["String"]>;
    en_title?: Maybe<Scalars["String"]>;
    ar_title?: Maybe<Scalars["String"]>;
};

export type UpdateTaskInput = {
    title?: Maybe<Scalars["String"]>;
    checklistId?: Maybe<Scalars["Int"]>;
    categoryId?: Maybe<Scalars["Int"]>;
    cost?: Maybe<Scalars["Float"]>;
    dueDate?: Maybe<Scalars["DateTime"]>;
    note?: Maybe<Scalars["String"]>;
};

export type User = {
    __typename?: "User";
    id: Scalars["ID"];
    email?: Maybe<Scalars["String"]>;
    phone?: Maybe<Scalars["String"]>;
    name?: Maybe<Scalars["String"]>;
    gender: Gender;
    spouseName: String;
    marriageDate?: Date;
    prepCost: Number;
    checklists?: Maybe<Array<Checklist>>;
    categories?: Maybe<Array<Category>>;
    tasks?: Maybe<Array<Task>>;
    collaboratedOn?: Maybe<Array<User>>;
    createdAt: Scalars["DateTime"];
    updatedAt: Scalars["DateTime"];
};

export type MutationRemoveTaskArgs = {
    taskId: Scalars["Int"];
};

export type MutationOrderTasksById = {
    currentOrder: Array<Scalars["Int"]>;
    newOrder: Array<Scalars["Int"]>;
};