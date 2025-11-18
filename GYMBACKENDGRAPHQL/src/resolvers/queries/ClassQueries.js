const { GraphQLID, GraphQLList } = require('graphql');
// importing types
const ClassType = require('../../type/ClassType');
// importing models
const Class = require('../../models/class');

const classQueries = {
    classes: {
         type: new GraphQLList(ClassType),
         async resolve(parent, args) { 
          console.log('Im at Classes Queries - line 11: ');
          const classesFBE = await Class.find();
          console.log('Im at Classes Queries - line 13 - classes: GOT ALL CLASSES');
          return classesFBE;
         },
          },
    classe: {
        type: ClassType,
        args: { id: { type: GraphQLID } },
        async resolve(parent, args) {
            console.log('Im at Class Queries - line 18 id:', args.id);
            try {
                const cls = await Class.findById(args.id);
                if (!cls) {
                    console.log('class not found:', args.id);
                    return null;
                }
                console.log('Im at Class Queries - found class:', cls);
                return cls;
            } catch (err) {
                console.error('Error in class query:', err);
                throw new Error('Error fetching class');
            }
        },
    },
}
module.exports = classQueries;