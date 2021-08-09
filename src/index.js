const { PrismaClient } = require('@prisma/client');
const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: async (parent, args, context, info) => {
            return context.prisma.link.findMany();
        },
        link: async (parent, args, context, info) => {
            return context.prisma.link.findUnique({
                where: { id: Number(args.id) },
            });
        },
    },
    Mutation: {
        post: (parent, args, context, info) => {
            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description,
                }
            });
            return newLink;
        },
        updateLink: async (parent, args, context, info) => {
            const link = await context.prisma.link.update({
                where: {
                    id: Number(args.id),
                },
                data: {
                    description: args.description,
                    url: args.url,
                },
            });
            return link;
        },
        deleteLink: async (parents, args, context, info) => {
            const link = await context.prisma.link.delete({
                where: {
                    id: Number(args.id),
                },
            });
            return link;
        },
    }
};

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
    resolvers,
    context: {
        prisma,
    },
});

server
    .listen()
    .then(({ url }) => {
        console.log(`Server is running on ${url}`);
    });