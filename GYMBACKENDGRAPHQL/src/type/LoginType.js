
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require('graphql');

const LoginType = new GraphQLObjectType({
        name: 'Login',
        fields: () => ({
            email: { type: GraphQLString },
            password: { type: GraphQLString },

        }),
    });

module.exports = LoginType;