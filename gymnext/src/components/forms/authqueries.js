// src/login-register/authqueries.js
import { gql } from '@apollo/client';

const GET_USERS = gql`
    query getUsers {
        users {
            id
            fullName
            email
           
        }
    }
`;
const GET_USER_ISADMIN = gql`
    query getUserAdmin {  
            usersAdmin {
                            id
                            isAdmin
                            email
                            fullName
                        }
        
    }
`;



export { GET_USERS, GET_USER_ISADMIN };