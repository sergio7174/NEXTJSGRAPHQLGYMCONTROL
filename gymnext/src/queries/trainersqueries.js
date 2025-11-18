// app/components/home/trainers/trainersqueries.ts
import gql from 'graphql-tag';

const GET_TRAINERS = gql`
    query getStaffs {  
          staffs{
            id
            name
            email
            age
            id_card
            phone
            address
            gender
            field
            image
           
          }
    }
`;

const GET_TRAINER = gql`
    query getStaff($id: ID!) {
        staff(id: $id) {      
            id
            name
            email
            age
            id_card
            phone
            address
            gender
            field
            image
            
    }}
`;

export { GET_TRAINERS, GET_TRAINER };