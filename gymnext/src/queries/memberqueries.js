import { gql } from '@apollo/client';

const GET_MEMBERS = gql`
    query GetMembers {  
          members{
            id
            namemember
            client_CI
            email
            phone
            nameplan
            timedays
            cost
            code
            status
            imageUser
            finishAt      
          }
    }`;

const GET_MEMBER_CLASSSES = gql`
    query getMemberClasses($email: String!) {  
        memberclasses(email: $email){
                    id           
                    namemember
                    email
                    client_CI
                    phone
                    classname
                    code
                    status
                    image
                    timedays
                    cost
                    finishAt
        }
    }
`;


const GET_MEMBER = gql`
    query getMember($email: String!) {
        member(email: $email) {    
            id
            namemember
            client_CI
            email
            phone
            nameplan
            timedays
            cost
            code
            status
            imageUser
            finishAt
            
        }
    }
`;

export { GET_MEMBERS, GET_MEMBER, GET_MEMBER_CLASSSES };