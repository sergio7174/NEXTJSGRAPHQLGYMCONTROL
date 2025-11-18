const { GraphQLID, GraphQLString, GraphQLNonNull, GraphQLEnumType,  GraphQLInt } = require('graphql');
const GraphQLSDate = require('../../utils/GraphQLDate');
const MemberClass = require('../../models/memberClass');
const MemberClassType = require('../../type/MemberClassType');
fs = require('fs'),
path = require('path');

const memberClassMutations = {

 addMemberClass: {
            type: MemberClassType,
            args: {
                namemember:     { type: GraphQLNonNull(GraphQLString) },
                email:          { type: GraphQLNonNull(GraphQLString) },
                client_CI:      { type: GraphQLNonNull(GraphQLString) },
                phone:          { type: GraphQLNonNull(GraphQLString) },
                classname:      { type: GraphQLNonNull(GraphQLString) },
                cost:           { type: GraphQLNonNull(GraphQLInt) },
                timedays:       { type: GraphQLNonNull(GraphQLInt) },
                code:           { type: GraphQLNonNull(GraphQLString) },
                status:         { type: GraphQLNonNull(GraphQLString) }, 
                image:          { type: GraphQLNonNull(GraphQLString) },   
            },
            async resolve(parent, args) {
               console.log("Estoy en MemberClassMutation - line 25 - addMemberClass - image: " +args.image);
                // Get the current date
                const currentDate = new Date();
               // Add timedays days to the current date (use args.timedays, not req)
               const futureDate = new Date(currentDate.getTime() + (args.timedays * 24 * 60 * 60 * 1000)); // Add timedays to get finish Member time

               // Compute remaining days (integer number of days between now and futureDate)
               const leftdays = Math.ceil((futureDate - currentDate) / (24 * 60 * 60 * 1000));

               // Create instance and save with error handling
               try {
                   const memberDoc = new MemberClass({ 
                       namemember:   args.namemember, 
                       client_CI:    args.client_CI,
                       email:        args.email, 
                       phone:        args.phone,
                       classname:    args.classname,
                       cost:         args.cost,
                       timedays:     args.timedays,
                       leftdays:     leftdays,
                       code:         args.code,
                       status:       args.status,
                       imageUser:    args.image,
                       finishAt:     futureDate,
                   });
                   const saved = await memberDoc.save();
                   console.log("Estoy en MemberClassMutation - line 51 - addMemberClass - saved member: " + saved);
                   return saved;
               } catch (err) {
                   console.error('addMember error:', err);
                   throw new Error('Error creating member');
               }
            },
        },      
    verifyMemberClass: {   
        type: MemberClassType,
         args: { email: { type: GraphQLNonNull(GraphQLString) },
                 code:  { type: GraphQLNonNull(GraphQLString) },
        },
         async resolve(parent, args ) {
         console.log('Im at verifyMemberClass - line 63- memberClassMutation - email:', args.email);
         console.log('Im at verifyMemberClass - line 63- memberClassMutation - email:', args.code);
         try {
                      // findOne returns a single document or null; include both email and code in the filter
                      const existing = await MemberClass.findOne({ email: args.email, code: args.code });
                      console.log('verifyMemberClass - found - existing :', existing);

                      if (existing == null ) {
                        console.error('verifyMemberClass - verifyMemberClass - line 73 - existing = null: ' + existing); 
                        const email = { email: args.email};
                        console.error('verifyMemberClass - verifyMemberClass - line 75 - existing = null - email: ' + email); 
                        return email }
                      if (existing != null ) { return existing }
        // if member and class are not found - created member
                      const Samecode = args.id
                      return Samecode;
         } catch (err) {
             console.error('verifyMemberClass error:', err);
             throw new Error('Error verifying member class');
         }
        },
        },

}

module.exports = memberClassMutations;