"use client"; // cause don't need speed or user interaction

import  { useEffect, useState }   from "react";
/*** service to get all members, to use it in members list table *****/
//import { GetAllMembersService } from "./getAllMembersService";
import { useGetAllMembersQuery } from "@/redux/features/apis/memberApi"
import { useDeleteMemberMutation } from "../../../redux/features/apis/memberApi";
/** to build search component */
import { MDBInputGroup, MDBInput, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';
/*** Notify toast */
import { notifyError, notifySuccess } from "@/utils/toast";
/****Search area */
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import Pagination from '@/components/common/Pagination';
import { PaginationControl } from 'react-bootstrap-pagination-control';

// icons
import { IoSearch } from "react-icons/io5";
/*** import graphQL apollo libs */
import { useMutation } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { GET_MEMBERS } from "@/queries/memberqueries";
import { DELETE_MEMBER, DELETE_MEMBER_IMAGE } from '../../../mutations/membermutation';

const ListMembersArea = () => {

let EachmemberStatus = [];  
let currentMember = [];

const Finish_day = [];
const MinisecondsLeft = [];
const DaysLeft = [];
const DaysLeft_mathFloor = [];
const currentDate = new Date();
const today=currentDate.getTime();
const MillisecondsPerDay = (1000 * 60 * 60 * 24);

const BackendURL = process.env.NEXT_PUBLIC_API_BASE_URL;
const router = useRouter();
// local const handle with useState hook
  
  const [selected, setSelected] = useState(null);

  const searchParams = useSearchParams();
  const [searchdata, setSearchdata] = useState("");

  // local const handle with useState hook
  const [ daysLeft_mathFloor, SetDaysLeft_mathFloor] = useState([]);
  const [ Members, setMembers] = useState([]);
  const [ memberStatus, SetMemberStatus] = useState([]);
  
 // deleteMember, deleteMemberImage mutations functions, pass variables when calling the functions
  const [deleteMemberImage, { data: deleteMemberImageData }] = useMutation(DELETE_MEMBER_IMAGE);
  const [deleteMemberMutation, { data: deleteMemberData }] = useMutation(DELETE_MEMBER);

// function to get all staff data from backend
    const { data } = useQuery(GET_MEMBERS);
  
  // vars to handle days left color class
  let c=0;
  const isPositive = daysLeft_mathFloor[c] > 0;
  const colorClass = isPositive ? 'text-success' : 'text-danger';

// function to get all members data from backend
// get all members from backend

// handle the member delete
  const [RDdeleteMember, {}] =  useDeleteMemberMutation();

//**** vars to handle pagination */

  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage] = useState(5);

  // vars to handle pagination
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  currentMember = data?.members?.slice(indexOfFirstMember, indexOfLastMember) || [];
  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

// function to handle pack delete 
const deleteMember = async (member) => { 
     try {
       // show quick debug alerts if needed (remove in production)
      //alert('I am at DeleteMember - line 87 - member.id:' + member.id);
      //alert('I am at DeleteMember - line 88 - member.image:'+ member.image);

       // delete image on server first
       const imageToDelete = member.image;
       const imgResult = MemberDeleteImageMutation(imageToDelete);
       if (!imgResult) {
         // image deletion failed (we'll still attempt to delete the member record)
         notifyError('Image deletion failed (will still try to delete Member record)');
       }
       //alert('I am at DeleteMember - line 97 - member.id:' + member.id);
       // delete the member record via Apollo mutation
       const variables = { id: member.id }
       const memberResult = deleteMemberMutation({variables});
       if (memberResult) {
         notifySuccess('Member and image deleted successfully');
         // reload the page once
         router.reload(window.location.pathname);
         return memberResult;
       } else {
         notifyError('Member delete failed');
         return null;
       }
     } catch (err) {
       console.error('Error in deleteMember:', err);
       notifyError('Error deleting Member');
       return null;
     }
 } // end of deleteMember

 /******** Function to delete a pack image on the server ***************/
  const MemberDeleteImageMutation = async (imageToDelete) => {
 
    //alert('Im at MemberDeleteImageMutation - line 120 - imageToDelete: ' + imageToDelete);
    try {
      const variables = { image: imageToDelete };
      const response = await deleteMemberImage({ variables });
 
      // The DELETE_MEMBER_IMAGE mutation returns the deleted member (id) under `deleteMember`.
      const payload = response?.data?.deleteMemberImage ?? deleteMemberImageData?.deleteMemberImage;
 
     //alert('Im at MemberDeleteImageMutation - line 128 - payload: '+ payload)
 
      if (payload) {
        // deletion succeeded
        notifySuccess('Image deleted successfully');
        return payload;
      } else {
        notifyError('Image delete failed');
        return null;
      }
    } catch (err) {
      console.error('Error deleting Member image:', err);
      notifyError('Error deleting Member image');
      return null;
    }
  }
   // end of MemberDeleteImageMutation function

  let content = null;

/******************* new block ******************************************/  

 if ( data?.members?.length > 0) {
   
     content = currentMember?.filter((Member) => {
           
            if (!searchdata) return Member;
        return Member.email?.toLowerCase().includes(searchdata.toLowerCase());
      }).map((Member, index) => {
        // compute days left for this member
        const finishTime = Member?.finishAt ? new Date(Member.finishAt).getTime() : null;
        const msLeft = finishTime ? finishTime - Date.now() : null;
        const daysLeft = msLeft !== null && !isNaN(msLeft) ? Math.floor(msLeft / MillisecondsPerDay) : null;
        const colorClassRow = daysLeft !== null && daysLeft > 0 ? 'text-success' : 'text-danger';
        const status = Member?.status ?? '';
        return (
          <tr key={Member.id}>
            <td className="text-center sftables">{index + 1}</td>
            <td className="text-center sftables">{Member.namemember}</td>
            <td className="text-center sftables">{Member.client_CI}</td>
            <td className="text-center"><img src={`${BackendURL}` + Member?.imageUser} height='70' width='60' style={{ borderRadius: 5 }} /></td>
            <td className="text-center sftables">{Member.email}</td>
            <td className="text-center sftables">{Member.phone}</td>
            <td className="text-center sftables">{Member.nameplan}</td>
            <td className="text-center sftables">{Member.timedays}</td>
            <td className="text-center sftables">{Member.cost}</td>
            <td className="text-center sftables">{Member.code}</td>
            <td className="text-center sftables"><em className={`p-2 ${colorClassRow}`}>{status}</em></td>
            <td className="text-center sftables"> <em className={`p-2 ${colorClassRow}`}>{daysLeft ?? 'N/A'}</em></td>
            <td className="text-center">
              <button className="btn btn-danger ms-2" onClick={() => { setSelected(Member); deleteMember(Member); }}>Delete</button>
            </td>
          </tr>
        );
      });
               
            }



/******************* End of new block ********************************* */


  return (
    <>
  <div style={{display:'flex', flexDirection:'row', justifyContent:'center',border:'5px double grey', height:'121vh',background: 'linear-gradient(139deg, rgba(22,103,184,1) 2%, rgba(9,83,121,1) 11%, rgba(0,193,255,0.9191876579733456) 58%)'}}>

 {/*** CENTER RECTANGULO STYLES */}
 <div style={{width:'80vw', border:'3px double gray', height:'100vh',display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', background:'radial-gradient(circle, rgba(219,215,217,1) 0%, rgba(155,197,246,1) 100%)', marginTop:30,borderRadius:20, boxShadow: '10px 10px'}}>

<div className="container d-flex flex-column justify-content-center align-content-center" style={{marginTop:'3em'}}>
   <div style={{margin:'3em'}}>
   {/*****Search area beging */}  

     <MDBInputGroup>
      <MDBInput
         placeholder="Search Member By Email"
         onChange={(e) =>{setSearchdata(e.target.value)}}
         defaultValue={searchParams?.searchTerm?.toString()}
        name="searchTerm"
         />
      <MDBBtn rippleColor='dark'>
        {/*<MDBIcon icon='search' />*/}
        <IoSearch size="20px" style={{color:'black'}}/>
      </MDBBtn>
    </MDBInputGroup>
   
    {/*****SEarch area End */} 

     <h3 className="text-center" style={{marginBottom:40, marginTop:20}}>Members Table</h3>
   </div>

  <div style={{marginBottom:20}} >
   
  {/*************  table area block Begining ****************** */}
  <span>
  {/*** SearchData block ********/}
   <div className="table-responsive" style={{overflowY:'scroll',
                           maxHeight:'64vh', overflowX:'scroll'}}>
        <table className="table table-responsive" style={{borderRadius:10}}>
          <thead className="table-dark" style={{position:'sticky', top:0}}>
            <tr>
              <th scope="col" className="text-center sftables" >#</th>
              <th scope="col" className="text-center sftables">Name</th>
              <th scope="col" className="text-center sftables">Client CI</th>
              <th scope="col" className="text-center sftables">Image</th>
              <th scope="col" className="text-center sftables">email</th>
              <th scope="col" className="text-center sftables">phone</th>
              <th scope="col" className="text-center sftables">Plan Name</th>
              <th scope="col" className="text-center sftables">Time Days</th>
              <th scope="col" className="text-center sftables">Cost</th>
              <th scope="col" className="text-center sftables">Code</th>
              <th scope="col" className="text-center sftables">Status</th>
              <th scope="col" className="text-center sftables">Days Left</th>
              <th scope="col" className="text-center sftables">Action</th>
            </tr>
          </thead>
          <tbody>

            {/***if there are products - show table */}
             {content}
            
          </tbody>
         
        </table>
        <Pagination length={data?.members?.length} packsPerPage={membersPerPage} handlePagination={handlePagination} currentPage={currentPage}/>
        { /**** bootstrap pagination ********/}
      <div className="Pagination">
        <PaginationControl
                  page={currentPage}
                  between={4}
                  total={data?.members?.length}
                  limit={5}
                  changePage={(currentPage) => { setCurrentPage(currentPage)}}
    ellipsis={1} />
    <br/>
    <br/>
  </div>
  </div>
                                  
  </span>
</div>

{/************************************************************** */}


 </div> 
</div>
</div>
  </>
  
)}

export default ListMembersArea;