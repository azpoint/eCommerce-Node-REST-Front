const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

const schema = buildSchema(`
    type News {
        id: ID!,
        nombre: String,
        edad: Int        
    }

    input NewsInput {
        nombre: String,
        edad: Int
    }

    type Query {
        getNews(): [News],
        getNewsItem(id: ID!): News
    }

    type Mutation {
        createNewsItem(data: NewsInput): News,
        updateNewsItem(id: ID!, data: NewsInput): News,
        deleteNews(id: ID!): Bool
    }
`)

module.exports = schema