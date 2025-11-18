const { GraphQLID, GraphQLString, GraphQLNonNull, GraphQLEnumType,  GraphQLInt } = require('graphql');
const Staff = require('../../models/staff');
const StaffType = require('../../type/StaffType');
fs = require('fs'),
path = require('path');

const staffMutations = {
  verifyStaff: {   
    type: StaffType,
     args: { email: { type: GraphQLNonNull(GraphQLString) },},
     async resolve(parent, args ) {
     console.log('Im at verifyStaff - StaffMutation - line 11 - email: '+args.email);
     // block to verify if Staff exist
     const email = args.email;
     const emailExists = await Staff.findOne({ email: email });
     console.log("Estoy en  StaffMutation - verifyStaff - line 15 - emailExists:  " + emailExists);
                  if (emailExists) {
                    const data = new Staff({ email:args.email });    
                           return data; 
                        }

                    const StaffFBE = null;
                    console.log("Estoy en  StaffMutation - verifyStaff - line 22 - StaffFBE:  " + StaffFBE);
                    return StaffFBE;
                    
                    }},
  addStaff: {
            type: StaffType,
            args: {
                name:      { type: GraphQLNonNull(GraphQLString) },
                email:     { type: GraphQLNonNull(GraphQLString) },
                id_card:   { type: GraphQLNonNull(GraphQLString) },
                phone:     { type: GraphQLNonNull(GraphQLString) },
                address:   { type: GraphQLNonNull(GraphQLString) },
                gender:    { type: GraphQLNonNull(GraphQLString) }, 
                field:     { type: GraphQLNonNull(GraphQLString) },
                image:     { type: GraphQLNonNull(GraphQLString) }, 
                age:       { type: GraphQLNonNull(GraphQLInt) },
               
            },
            async resolve(parent, args) {
                console.log('Im at addStaff - StaffMutation - line 49 - image: '+args.image);
                const neWStaff = new Staff({ 
                        name:    args.name, 
                        email:   args.email,
                        id_card: args.id_card,
                        image:   args.image,
                        phone:   args.phone,
                        address: args.address,
                        gender:  args.gender,
                        field:   args.field,
                        age:     args.age,
                        createdAt:    new(Date),
                });
                return  neWStaff.save();
            },
        },
        deleteStaff: {
            type: StaffType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                console.log('Im at StaffMutation - deleteStaff - line 41 - args.id: ', args.id);
                StaffRemoved = Staff.findByIdAndDelete(args.id);
                if (!StaffRemoved) {
                    console.log('Staff not found');}
                    console.log('Im at deleteCategory Mutation - line 57 - Category Deleted //Succesfully ' + StaffRemoved);
                
                return StaffRemoved;
            },
        },
        deleteStaffImage: {
            type: StaffType,
            args: { image: { type: GraphQLNonNull(GraphQLString) }},
            async resolve(parent, args) {
              console.log("Estoy en StaffController - line 81 - deletePackImage - image: " +args.image);
                const Image = args.image;
                const filePath = Image;
               fs.unlink(filePath, (err) => {
                 if (err) {
                   if (err.code === 'ENOENT') {
                console.log("Estoy en StaffController - line 81 - deleteStaffImage - File not found: ");
                const message = 'File not found';
                return message;
            }
        }
         const message = 'There were an mistake ....';
         return message
        });
           const message = 'File deleted successfully';
           console.log("Estoy en Staff Controller - line 90 - deleteStaffImage - File deleted successfully ");
           return message;
       }},
        updateStaff: {
            type: StaffType,
            args: {
                id:        { type: GraphQLNonNull(GraphQLID) },
                name:      { type: GraphQLNonNull(GraphQLString) },
                email:     { type: GraphQLNonNull(GraphQLString) },
                id_card:   { type: GraphQLNonNull(GraphQLString) },
                phone:     { type: GraphQLNonNull(GraphQLString) },
                address:   { type: GraphQLNonNull(GraphQLString) },
                gender:    { type: GraphQLNonNull(GraphQLString) }, 
                field:     { type: GraphQLNonNull(GraphQLString) },
                image:     { type: GraphQLNonNull(GraphQLString) }, 
                age:       { type: GraphQLNonNull(GraphQLInt) },
                
            },
            async resolve(parent, args) {
                console.log("Estoy en Staff Mutation - updateStaff - id:", args.id);
                console.log("Estoy en Staff Mutation - updateStaff - image:", args.image);
                try {
                   const StaffUpdated = await Staff.findByIdAndUpdate(
                    args.id,{ $set: {
                        name:    args.name, 
                        email:   args.email,
                        id_card: args.id_card,
                        image:   args.image,
                        phone:   args.phone,
                        address: args.address,
                        gender:  args.gender,
                        field:   args.field,
                        age:     args.age,
                        createdAt:    new(Date),
                                            },
                                        },
                                        { new: true }
                                    );
                                    if (!StaffUpdated) {
                                        console.log('updateStaff: staff not found:', args.id);
                                        return null;
                                    }
                                    console.log('updateStaff: updated staff id:', StaffUpdated._id);
                                    return StaffUpdated;
                                } catch (err) {
                                    console.error('updateStaff error:', err);
                                    throw new Error('Error updating Trainer');
                                }
                            },
                        },
}

module.exports = staffMutations;