const { GraphQLID, GraphQLList } = require('graphql');
// importing models
const Staff = require('../../models/staff');
// importing types
const StaffType = require('../../type/StaffType');

const staffQueries = {

        staffs: {
            type: new GraphQLList(StaffType),
            async resolve(parent, args) { 
                const staffs = await Staff.find();
                console.log('Im at staffs queries - line 13: Staffs Got It ');
                return staffs;
            },
        },
        staff: {
            type: StaffType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                const GetTrainer = await Staff.findById(args.id);
                console.log('Im at staffs queries - getTrainer - line 22: ' + GetTrainer);
                return GetTrainer;
            
            },
        },
}

module.exports = staffQueries;