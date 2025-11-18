const { GraphQLString, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } = require('graphql');

const User = require('../../models/User');
const UserType = require('../../type/UserType');
const AuthPayloadType = require('../../type/AuthType');
const jwt = require('jsonwebtoken'); // For JWT


const authMutations = {
     
      addUser: {
        
         type: UserType,
             args: {
                    fullName: { type: GraphQLNonNull(GraphQLString) },
                    email: { type: GraphQLNonNull(GraphQLString) },
                    password: { type: GraphQLNonNull(GraphQLString) },
                    isAdmin: { type: GraphQLNonNull(GraphQLString) },
                    imageFBE: { type: GraphQLNonNull(GraphQLString) },
                },
                async resolve(parent, args ) {
                  // check if user in in database
                  const email = args.email;
                  const emailExists = await User.findOne({ email: email });
                  console.log("Estoy en  authMutation - line 25 - emailExists:  " + emailExists);
                  if (emailExists) {
                    console.log("Estoy en  authMutation -Dentro de emailExist- line 26 - emailExists - emailExists:  "+ emailExists);
                    const message = 'Email already exits';
                    const user = new User({
                                   fullName: args.fullName,
                                    email: args.email,
                                    password: args.password,
                                    isAdmin: args.isAdmin,
                                    imageFBE: args.imageFBE,
                                });
                    return user
                    }
                  console.log('Im at addUser - AuthMutation - line 38 - image: ' + args.imageFBE);     
                    
                    const data = new User({
                                   fullName: args.fullName,
                                    email: args.email,
                                    password: args.password,
                                    isAdmin: args.isAdmin,
                                    imageFBE: args.imageFBE,
                                });
                                
                  const user = data.save();
                  const message = 'User Register Succesfully ..'
                  console.log('Im at addUser - AuthMutation - line 38 - user: ' + user);
                  return user;
                            },          
            },
    loginUser: {
            type: AuthPayloadType,
                args: {
                    email: { type: GraphQLNonNull(GraphQLString) },
                    password: { type: GraphQLNonNull(GraphQLString) },
                },
                    async resolve(parent, args) {
                    //console.log('Im at loginUser - AuthMutation - line 61');
                    const email = args.email;
                    const password = args.password;
                    const user = await User.findOne({ email:email });
                    //console.log('Im at loginUser - AuthMutation - line 65 - user: '+ user);
                    console.log('Im at loginUser - AuthMutation - line 66 - user.id: '+ user.id);

                    if (!user || !(user.comparePassword(password))) {
                   
                        throw new Error('Invalid credentials');
                    }
                    
                    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                    //console.log('Im at loginUser - AuthMutation - line 74 - token: '+ token);
                    const success = 'true';
                    //console.log('Im at login - AuthMutation - line 76 - token: ' + token);
                    return {user, token};
                },
            },
        }

    module.exports = authMutations;
   