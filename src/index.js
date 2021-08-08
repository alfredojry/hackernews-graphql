const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');

let links = [
    {
        id: 'link-0',
        url: 'how-to-graphql.com',
        description: 'FullStask tutorial for GraphQL'
    },
];

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: () => links,
        link: (parent, args) => links.find(x => x.id === args.id),
    },
    Mutation: {
        post: (parent, args) => {
            let idCount = links.length;
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            };
            links.push(link);
            return link;
        },
        updateLink: (parents, args) => {
            const index = links.findIndex(x => x.id === args.id);
            if (index > -1) {
                if (args.description) links[index].description = args.description;
                if (args.url) links[index].url = args.url;
                return links[index];
            }
        },
        deleteLink: (parents, args) => {
            const index = links.findIndex(x => x.id === args.id);
            if (index > -1) {
                const link = links[index];
                links = [...links.slice(0, index), ...links.slice(index + 1)];
                return link;
            }
        },
    }
};

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
    resolvers,
});

server
    .listen()
    .then(({ url }) => {
        console.log(`Server is running on ${url}`);
    });