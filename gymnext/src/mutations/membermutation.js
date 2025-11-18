// app/components/homeAdmin/MEMBER/MEMBERmutations.ts
import { gql } from '@apollo/client';

const ADD_MEMBER = gql`
        mutation addMember(
            $namemember:  String!
            $client_CI:   String!,
            $email:       String!,
            $phone:       String!,
            $nameplan:    String!, 
            $timedays:    Int!,
            $cost:        Int!,
            $code:        String!,
            $status:      String!,
            $image:       String!   
            ) {
            addMember(
                namemember:  $namemember,
                client_CI:   $client_CI,
                email:       $email,
                phone:       $phone,
                nameplan:    $nameplan,
                timedays:    $timedays,
                cost:        $cost,
                code:        $code,
                status:      $status,
                image:       $image,
                ) {
           
                id
               
               
            }
        }`;

const ADD_MEMBER_CLASS = gql`
        mutation addMemberClass(
            $namemember:  String!
            $client_CI:   String!,
            $email:       String!,
            $phone:       String!,
            $classname:    String!, 
            $timedays:    Int!,
            $cost:        Int!,
            $code:        String!,
            $status:      String!,
            $image:       String!   
            ) { 
            addMemberClass(
                namemember:  $namemember,
                client_CI:   $client_CI,
                email:       $email,
                phone:       $phone,
                classname:   $classname,
                timedays:    $timedays,
                cost:        $cost,
                code:        $code,
                status:      $status,
                image:       $image,
                ) {
           
                id
               
               
            }
        }`;        

const VERIFY_MEMBER = gql`
        mutation verifyMember($email: String!) {
            verifyMember(email: $email) { id }
        }`;
const VERIFY_MEMBER_CLASS = gql`
        mutation verifyMemberClass($email: String!, $code: String!) {
            verifyMemberClass(email: $email, code: $code) { 
                id
                code
                 }
        }`;


const DELETE_MEMBER = gql`
    mutation DeleteMEMBER($id: ID!) {
        deleteMEMBER(id: $id) {
            id
        }
    }
`;

const DELETE_MEMBER_IMAGE = gql`
    mutation deleteMemberImage($image: String!) {
        deleteMemberImage(image: $image) {
            id
        }
    }
`;

const UPDATE_MEMBER = gql`
    mutation updateMEMBER(
            $id:          ID!, 
            $nameplan:    String!, 
            $trialdays:   Number!, 
            $description: String!, 
            $features:    String!,
            $timedays:    Number!,
            $cost:        Number!,
            $code:        String!,
            $status:      MEMBERStatusUpdate!,
            $image:       String! 
       ) {
        updateMEMBER(
                id:          $id, 
                nameplan:    $nameplan, 
                trialdays:   $trialdays, 
                description: $description, 
                features:    $features,
                timedays:    $timedays,
                cost:        $cost,
                code:        $code,
                status:      $status,
                image:       $image) {
                
                id
                nameplan 
                trialdays 
                description 
                features
                timedays
                cost
                code
                status
                image 
            }
    }
`;

export { ADD_MEMBER, 
         VERIFY_MEMBER, 
         DELETE_MEMBER, 
         UPDATE_MEMBER, 
         DELETE_MEMBER_IMAGE, 
         ADD_MEMBER_CLASS,
         VERIFY_MEMBER_CLASS };