const { GraphQLID, GraphQLList, GraphQLString } = require('graphql');
// importing types
const MemberType = require('../../type/MemberType');
const MemberClassType = require('../../type/MemberClassType');
// importing models
const Member = require('../../models/member');
const MemberClass = require('../../models/memberClass');

const memberQueries = {
    members: {
        type: new GraphQLList(MemberType),
        async resolve(parent, args) { 
          console.log('Im at members Queries - line 11: ');
          const GetMember = await Member.find(); 
          console.log('Im at members Queries - line 13 - GetMember: ' + GetMember);
          return GetMember;
          },
          },
  member: {
    type: MemberType,
    args: { email: { type: GraphQLString }},
    async resolve(parent, args) {
      console.log('Im at member Queries - line 21 email:', args.email);
      try {
        if (!args.email) return null;
        const member = await Member.findOne({ email: args.email });
        if (!member) {
          console.log('member not found email:', args.email);
          return null;
        }
        return member;
      } catch (err) {
        console.error('Error in member query:', err);
        throw new Error('Error fetching member');
      }
    },
  },
  memberclasses: {
        type: new GraphQLList(MemberClassType),
        args: { email: { type: GraphQLString }},
        async resolve(parent, args)
        { 
          try {
        console.log('Im at members Queries - line 43 - args.email: ' + args.email);    
        if (!args.email) return null;
        const GetMemberClasses = await MemberClass.find({ email: args.email });
        if (!GetMemberClasses) {
          console.log('Classes member not found email:', args.email);
          return null;
        }
        console.log('Im at members Queries - line 50 -  GetMemberClasses.length: ' + MemberClass.length);
        return GetMemberClasses;
      } catch (err) {
        console.error('Error in member query:', err);
        throw new Error('Error fetching member');
      }
          },
          },
}
module.exports = memberQueries;