// app/components/homeAdmin/staff/staffmutations.js
import { gql } from '@apollo/client';

const ADD_STAFF = gql`
        mutation addStaff(
            $name:    String!,
            $email:   String!,
            $id_card: String!, 
            $phone:   String!,
            $address: String!,
            $gender:  String!,
            $field:   String!,
            $age:     Int!,
            $image:   String! ) {
            addStaff(
                name:    $name,
                email:   $email,
                id_card: $id_card,
                phone:   $phone,
                address: $address,
                gender:  $gender,
                field:   $field,
                age:     $age
                image:   $image, ) {
                
                id
                
            }
        }`;

const UPDATE_STAFF = gql`
    mutation updateStaff(
            $id: ID!,
            $name:    String!,
            $email:   String!,
            $id_card: String!, 
            $phone:   String!,
            $address: String!,
            $gender:  String!,
            $field:   String!,
            $age:     Int!,
            $image:   String!, 
       ) {
        updateStaff(
                id:          $id, 
                name:    $name,
                email:   $email,
                id_card: $id_card,
                phone:   $phone,
                address: $address,
                gender:  $gender,
                field:   $field,
                age:     $age
                image:   $image,) {
                
                id
                name 
                email 
            }
    }
`;

const VERIFY_STAFF = gql`
        mutation verifyStaff($email: String!) {
            verifyStaff(email: $email) {
                id               
            }
        }`;

const DELETE_STAFF = gql`
    mutation DeleteStaff($id: ID!) {
        deleteStaff(id: $id) {
            id
        }
    }
`;

const DELETE_STAFF_IMAGE = gql`
    mutation deleteStaffImage($image: String!) {
        deleteStaffImage(image: $image) {
            id
        }
    }
`;


export { ADD_STAFF, UPDATE_STAFF , VERIFY_STAFF,DELETE_STAFF, DELETE_STAFF_IMAGE };