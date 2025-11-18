// src/login-register/authmutations.js
import { gql } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client'; // Install apollo-upload-client

const LOGIN_USER = gql`    
        mutation loginUser($email: String!, $password: String!) {
            loginUser(email: $email, password: $password ) {
              token
               user {
                     id
                     fullName
                     email
                     isAdmin
                     imageFBE
                 }
                
            }
        }`;

const ADD_USER = gql`
        mutation addUser($fullName: String!, $email: String!, $password: String!, $isAdmin: String!, $imageFBE: String!) {
            addUser(fullName: $fullName, email: $email, password: $password, isAdmin: $isAdmin, imageFBE: $imageFBE) {    
                    id
                     fullName
                     email
                     isAdmin
                     imageFBE
                    
            }
        }`;

export { ADD_USER, LOGIN_USER };