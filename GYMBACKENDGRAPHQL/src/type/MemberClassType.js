const { GraphQLObjectType, GraphQLID, GraphQLString,GraphQLInt } = require('graphql');
const GraphQLSDate = require('../utils/GraphQLDate');


// Member Type
const MemberClassType = new GraphQLObjectType({
    name: 'MemberClass',
    fields: () => ({
        
        id:         { type: GraphQLID },
        namemember: { type: GraphQLString },
        email:      { type: GraphQLString },
        client_CI:  { type: GraphQLString },
        phone:      { type: GraphQLString },
        classname:  { type: GraphQLString },
        code:       { type: GraphQLString },
        status:     { type: GraphQLString },
        image:      { type: GraphQLString },
        timedays:   { type: GraphQLInt },
        cost:       { type: GraphQLInt },
        finishAt:   { type: GraphQLSDate}, // begin class date

        
    }),
});

module.exports = MemberClassType;