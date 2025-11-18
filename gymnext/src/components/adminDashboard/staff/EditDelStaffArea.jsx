"use client"; // cause don't need speed or user interaction

import  { useEffect, useState }   from "react";
import Image from "next/image";
import Modal from "react-modal";
/*** service to get all categories, to use it in product form *****/
/** to build search component */
import { MDBInputGroup, MDBInput, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';
/*** Notify toast */
import { notifyError, notifySuccess } from "@/utils/toast";
import ErrorMsg from "@/components/common/error-msg";
/****Search area */
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import Pagination from '@/components/common/Pagination';
import { PaginationControl } from 'react-bootstrap-pagination-control';
// icons
import { MdManageHistory } from "react-icons/md";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { BsTelephoneInboundFill } from "react-icons/bs";
import { PiMapPinArea } from "react-icons/pi";
import { FaAddressCard } from "react-icons/fa";
import { GrStatusGood } from "react-icons/gr";
import { IoSearch } from "react-icons/io5";
import { PiBackpackFill } from "react-icons/pi";
import { IoImagesOutline } from "react-icons/io5";
import { FaRegAddressCard } from "react-icons/fa";
/*** import graphQL apollo libs */
import { useQuery } from '@apollo/client';
import { GET_TRAINERS } from '../../../queries/trainersqueries';
import { useMutation } from '@apollo/client';
import { UPDATE_STAFF, DELETE_STAFF, DELETE_STAFF_IMAGE } from '../../../mutations/staffmutation';

import axios from 'axios';


const EditDelStaffArea = () => {

    let currentStaff = [];
    const router = useRouter();
    const BackendURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    // local const handle with useState hook
      const [selected, setSelected] = useState(null);
   // const to handle state update function
      const [updatedname, setUpdatedName] = useState("");
      const [updatedemail, setUpdatedEmail] = useState("");
      const [updatedage, setUpdatedAge] = useState(0);
      const [updatedid_card, setUpdatedId_Card] = useState("");
      const [updatedphone, setUpdatedPhone] = useState("");
      const [updatedaddress, setUpdatedAddress] = useState("");
      const [updatedgender, setUpdatedGender] = useState("");
      const [updatedfield, setUpdatedField] = useState("");
      const [image, setImage] = useState();
      const [selectedFile, setSelectedFile] = useState(null);
      const [imagePreview, setImagePreview] = useState();
      const searchParams = useSearchParams();
      const [searchdata, setSearchdata] = useState("");

    // function to get all staff data from backend (Apollo)
    const { loading, error, data } = useQuery(GET_TRAINERS);

  // deleteStaff, deleteStaffImage mutations functions, pass variables when calling the functions
      const [deleteStaffImage, { data: deleteStaffImageData }] = useMutation(DELETE_STAFF_IMAGE);
      const [deleteStaffMutation, { data: deleteStaffData }] = useMutation(DELETE_STAFF);
      const [updateStaffMutation, { data: updateStaffData }] = useMutation(UPDATE_STAFF);

// vars to handle pagination

const [currentPage, setCurrentPage] = useState(1);
const [staffsPerPage] = useState(5);
const indexOfLastStaff = currentPage * staffsPerPage;
const indexOfFirstStaff = indexOfLastStaff - staffsPerPage;

// use the Apollo `data.staffs` array as the source of truth for the list
currentStaff = data?.staffs?.slice(indexOfFirstStaff, indexOfLastStaff) || [];

 const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  // const to handle modal
  
    const [open, setOpen] = useState(false);
 // get gender data to status select form
    const genderOptions = ['male', 'female'];

 // function to handle gender select component in form
 const ongenderOptionsChangeHandler = (e) => {setUpdatedGender(e.target.value)};

  // Delete Staff func
      const deleteStaff = async (Staff) => {
       try {
         // show quick debug alerts if needed (remove in production)
         //alert('I am at editdelStackArea - deleteStaff - line 94 - Staff.id:'+Staff.id);
         //alert('I am at editdelStaffArea - deleteStaff - line 95 - Staff.image:'+Staff.image);
  
         // delete image on server first
         const imageToDelete = Staff.image;
         const imgResult = await StaffDeleteImageMutation(imageToDelete);
         if (!imgResult) {
           // image deletion failed (we'll still attempt to delete the Staff record)
           notifyError('Image deletion failed (will still try to delete Staff record)');
         }
         //alert('I am at editdelStaffArea - deleteStaff - line 104 - Staff.id:'+Staff.id);
         // delete the Staff record via Apollo mutation
         const variables = { id: Staff.id }
         const StaffResult = await deleteStaffMutation({variables});
         if (StaffResult) {
           notifySuccess('Staff and image deleted successfully');
           // reload the page once
           router.reload(window.location.pathname);
           return StaffResult;
         } else {
           notifyError('Staff delete failed');
           return null;
         }
       } catch (err) {
         console.error('Error in deleteStaff:', err);
         notifyError('Error deleting Staff');
         return null;
       }
    }; // end of delete Staff func block
  
/******** Function to delete a Staff image on the server ***************/
 const StaffDeleteImageMutation = async (imageToDelete) => {

   //alert('Im at StaffDeleteImageMutation - line 139 - imageToDelete: '+imageToDelete);
   try {
     const variables = { image: imageToDelete };
     const response = await deleteStaffImage({ variables });

     // The DELETE_Staff_IMAGE mutation returns the deleted Staff (id) under `deleteStaff`.
     const payload = response?.data?.deleteStaffImage ?? deleteStaffImageData?.deleteStaffImage;

    //alert('Im at StaffDeleteImageMutation - line 147 - payload: '+ payload)

     if (payload) {
       // deletion succeeded
       notifySuccess('Image deleted successfully');
       return payload;
     } else {
       notifyError('Image delete failed');
       return null;
     }
   } catch (err) {
     console.error('Error deleting Staff image:', err);
     notifyError('Error deleting Staff image');
     return null;
   }
 }
  // end of StaffDeleteImageMutation function


   //update Staff function
   const handleUpdate = async (e) => {
    
    e.preventDefault();

      //alert("Estoy en handleUpdate - editDelStaff-area - line 171 - updatedgender: "+updatedgender);
        // validate for image item
    if (!selectedFile) {      
        notifyError("Image require ...!!, Please Enter Image ..!!");
    return;    
        }

      // validate for gender item
    if (!updatedgender) {      
        notifyError("Gender require ...!!, Please Select Gender Item ..!!");
    return;
    }
// alert('selected._id - editdelStaff-area - line 171:'+selected._id);
// alert('selected.image - editdelStaff-area - line 172:'+selected.image);

// function to delete the image in backend     
const ImageDel = selected.image; // selected comes from button to erase staff
 //alert('Im at editDelStaffArea handleUpdate - line 176 - ImageDel: '+ ImageDel);
 StaffDeleteImageMutation(ImageDel);
 GetStaffImageUrl(selectedFile)

  }
 
// function get Staff image Url from backEnd Graphql multer
const GetStaffImageUrl =  async (selectedFile) => {
  const formData = new FormData();
  formData.append('Dataimage', selectedFile);
  
  try {
    const res = await axios.post('http://localhost:5000/upload-image', formData);
    if (res.data && res.data.image) {
      const imageUrl = res.data.image;
      //alert('Im at editDelStaffArea GetStaffImageUrl - line 204 - ImageUrl: '+ res.data.image);
      // store in state for UI and debugging
      setImage(imageUrl);
      // call PostStaffMutation with the image URL and form values
      await GetupdateStaffMutation(imageUrl);
    } else {
      notifyError('Image upload failed, please try again.');
    }
  } catch (err) {
    console.error('Upload image error:', err);
    notifyError('Image upload error');
  }
} // end of function get Staff image Url from backEnd Graphql multer
 
/****************************************************** */
const GetupdateStaffMutation =  async (imageUrl) => {
 //alert('Im at EditDelStaffArea - GetupdateStaffMutation - line 207 - selected?.id: ' + selected?.id);
 //alert('Im at EditDelStaffArea - GetupdateStaffMutation - line 208 - imageUrl: ' + imageUrl)
      // Build variables for the GraphQL update mutation (use selected id)
      const variables = {
        id: selected?._id ?? selected?.id,
        name: updatedname,
        email: updatedemail,
        age: parseInt(updatedage, 10) || 0,
        id_card: updatedid_card,
        phone: updatedphone,
        address: updatedaddress,
        gender: updatedgender,
        field: updatedfield,
        // If `image` is a File object we keep the existing selected.image string for the graphql call.
        image: imageUrl || image,
      };
      try {
        const response = await updateStaffMutation({ variables });
        if (response?.errors) {
          notifyError('Update Staff Failed');
        } else {
          notifySuccess('Staff updated Successfully');
          router.reload(window.location.pathname);
        }
      } catch (err) {
        console.error('Error updating Staff:', err);
        notifyError('Error updating Staff');
      }
};

/***************************************************** */
// decide what to render
  let content = null;
 
if (data?.staffs?.length > 0) {
   
  content = currentStaff.filter((Staff) => {
          
            if (searchdata == null) {
                return Staff
            } else if (Staff.id_card.toLowerCase().includes(searchdata.toLowerCase())) {
                return Staff
            }
        }).map((Staff, index) => (
              <tr key={Staff.id}>
                <td className="text-center sftables">{index+1}</td>
                <td className="text-center sftables">{Staff.name}</td>
                <td className="text-center sftables">{Staff.email}</td>
                <td className="text-center"><img src={`${BackendURL}`+Staff?.image} height='70' width='60' style={{borderRadius:5}}/></td>
                <td className="text-center sftables">{Staff.age}</td>
                <td className="text-center sftables">{Staff.id_card}</td>
                <td className="text-center sftables">{Staff.phone}</td>
               {/* <td className="text-center sftables">{Staff.address}</td>*/}
                <td className="text-center sftables">{Staff.gender}</td>
                <td className="text-center sftables">{Staff.field}</td>
                <td className="text-center">
                  
                <button className="btn btn-primary m-2" onClick={() => { setOpen(true);      setUpdatedName(Staff.name);
                setUpdatedEmail(Staff.email);
                //setImage(Staff.image);
                setUpdatedAge(Staff.age);
                setUpdatedId_Card(Staff.id_card);
                setUpdatedPhone(Staff.phone);
                setUpdatedAddress(Staff.address);
                //setUpdatedGender(Staff.gender);
                setUpdatedField(Staff.field);
                setSelected(Staff);
                }}>Edit</button>

                  <button className="btn btn-danger ms-2" onClick={() =>{setSelected(Staff); deleteStaff(Staff)}}>Delete</button>
                </td>
              </tr>
            ))}


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
         placeholder="Search Trainer By id_card"
         onChange={(e) =>{setSearchdata(e.target.value)}}
         defaultValue={searchParams?.searchTerm?.toString()}
        name="searchTerm"
         />
      <MDBBtn rippleColor='dark'>
        <IoSearch size="20px" style={{color:'black'}}/>
      </MDBBtn>
    </MDBInputGroup>
   
    {/*****SEarch area End */} 

     <h3 className="text-center" style={{marginBottom:40, marginTop:20}}>Edit/Delete Table Staffs</h3>
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
              <th scope="col" className="text-center sftables">Email</th>
              <th scope="col" className="text-center sftables">Image</th>
              <th scope="col" className="text-center sftables">Age</th>
              <th scope="col" className="text-center sftables">Id card#</th>
              <th scope="col" className="text-center sftables">Phone</th>
              {/*<th scope="col" className="text-center sftables">Address</th>*/}
              <th scope="col" className="text-center sftables">Gender</th>
              <th scope="col" className="text-center sftables">Field</th>
              <th scope="col" className="text-center sftables">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/***if there are products - show table */}
            {content}
          </tbody>
         
        </table>
        <Pagination length={data?.staffs?.length} staffsPerPage={staffsPerPage} handlePagination={handlePagination} currentPage={currentPage}/>
        { /**** bootstrap pagination ********/}
      <div className="Pagination">
        <PaginationControl
                  page={currentPage}
                  between={4}
                  total={data?.staffs?.length}
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

<Modal isOpen={open}>

<div style={{marginTop:'7em'}}>
  
 <div style={{width:'70vw', border:'3px double gray', minHeight:'105vh',display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', alignContent:'center', background:'radial-gradient(circle, rgba(219,215,217,1) 0%, rgba(155,197,246,1) 100%)',  borderRadius:20, boxShadow: '10px 10px', marginTop:'2em'}}>

   <div className="col-12" style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
  <Image src="/assets/img/logo/logo2.jpg" width={50} height={50} alt="Gym-logo"/>&nbsp;&nbsp;
   <span className="nav_logo-name"  style={{color:' #2b69dd'}}>
     Sergio Fitness
   </span>
   <span className="nav_logo-name"  style={{color:' #0b0a4b', fontSize:'1rem', position: 'relative', top:'-5px',left:'5px'}}>
      App
   </span>
  </div>
 {/*** CENTER RECTANGULO STYLES */}
  
<div>
    <h4 style={{textAlign:'center', marginBottom:40}}>Staff - Update</h4>
</div>
   <form onSubmit={handleUpdate}>
    <div>

{/****Name and age block begining *****/}
<div className="AlignItemsForm" style={{display:'flex', flexDirection:'row', justifyContent:'space-between', flexWrap:'wrap'}}>

<div className="mb-3 col-md-5">

<label for="name" className="form-label">
     <PiBackpackFill  size="32px" style={{color:'black'}}/>&nbsp; 
        Staff Name: &nbsp; 
</label>
      <input 
      type="text" 
      name='name' 
      className="form-control input" 
      value={updatedname} 
      onChange={(e) => setUpdatedName(e.target.value)} 
      style={{maxHeight:40, minWidth:'20vw'}}/>
</div>

 <div className="mb-3 col-md-3">
    
  <label for="age" className="form-label">
    <MdManageHistory size="32px"/> &nbsp;
    Age:
  </label>
    <input 
    type="text" 
    name='age' 
    className="form-control input" 
    value={updatedage} onChange={(e) => setUpdatedAge(e.target.value)} 
    style={{maxHeight:40, minWidth:'10vw'}}/>
 </div>
{/**---- Staff id_card section ---------------------->**/}                       
                      
 <div className="mb-3 col-md-3">
    <label for="id_card" className="form-label">
      <FaRegAddressCard size="32px"/> &nbsp;
      Id card #:
    </label>
     <input
     name="id_card" 
     id="id_card"
     value={updatedid_card} 
     onChange={(e) => setUpdatedId_Card(e.target.value)} 
     type="text" 
     placeholder="Id card#" 
     className="form-control input" 
      />
    
   </div>

</div> {/*--- End of section for name, age, id_card --*/}

 {/****Name and age block end *****/}

{/**---- Staff email section --------------------*****/}
<div className="mb-3">
    <label for="email" className="form-label">
      <MdOutlineMarkEmailUnread size="32px"/> &nbsp;
          Email:
    </label>
  <input 
    type="text" 
    name='email' 
    className="form-control input" 
    value={updatedemail} 
    onChange={(e) => setUpdatedEmail(e.target.value)} 
    style={{maxHeight:40, minWidth:'25vw'}}/>
</div>

{/***!---- Staff phone, gender, field section --------------**********--*/}  

<div style={{display:'flex',flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between'}} className="AlignItemsForm"> 

{/**---- Staff phone section ------------------------*************-*/}
<div className="mb-3 col-md-4">

<label for="phone" className="form-label">
      <BsTelephoneInboundFill size="32px"/>&nbsp;
          Phone:
    </label>
  <input 
    type="text" 
    name='phone' 
    className="form-control input" 
    placeholder='Enter Phone' 
    value={updatedphone} 
    onChange={(e) => setUpdatedPhone(e.target.value)} 
    style={{maxHeight:40, maxWidth:'12vw'}}/>
</div>

{/**---- Staff gender section ------------------------*************-*/}
<div className="mb-3 col-md-4">
  <label for="gender" className="form-label">
    <GrStatusGood size="32px"/>&nbsp;
    Gender:
  </label>
   <select 
     id="gender"
     className="input form-control"
     style={{maxHeight:40, maxWidth:'12vw'}}
     onChange={ongenderOptionsChangeHandler}>
        <option>Choose Gender</option>
          {(genderOptions).map((option, index) => {return (
            <option key={index}>
              {option}
            </option>
            );
            })}
      </select>
   </div>

{/***---- Staff field section -------------------------*/} 

<div className="mb-3 col-md-3">
  
<label for="field" className="form-label">
      <PiMapPinArea size="32px"/> &nbsp;
       Field:
</label>
      <input 
      type="text" 
      name='field' 
      className="form-control input" 
      value={updatedfield} 
      onChange={(e) => setUpdatedField(e.target.value)} 
      style={{maxHeight:40, maxWidth:'13vw'}} min='1'/>
      
</div>
</div>  {/**!-- End of this line in view form -->*/}
{/*<!---- Staff address section ----------------*/}

<div className="mb-3 col-md-12">
   
 <label for="address" className="form-label">
      <FaAddressCard size="32px"/> &nbsp; 
          Address:
    </label>&nbsp;
              
              <input 
      type="text" 
      name='address' 
      className="form-control input" 
      value={updatedaddress} 
      onChange={(e) => setUpdatedAddress(e.target.value)} 
      style={{maxHeight:40, maxWidth:'25vw'}}/>
      
</div>

 <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', flexWrap:'wrap', marginBottom:20,}} className="AlignItemsForm">
             
<div className="mb-3 col-md-4">

      <label for="code" className="form-label">
            <IoImagesOutline size="20px" style={{color:'black'}}/>&nbsp;
             Staff Image:
      </label>      

           <input className='file-upload-input' type="file" name="image"
               id="" accept='.jpg, .jpeg, .png'
               onChange={event => {
                   const image = event.target.files[0];
                   setSelectedFile(image);
                   setImagePreview(URL.createObjectURL(event.target.files[0]))
               }}
               placeholder='Image'>
           </input>
           </div>

           <div style={{marginBottom:10, display:'flex', flexDirection:'row', backgroundColor:'white', borderRadius:6,color:'#FFBF00', fontWeight:'bold', border:'3px double gray', width:'8vw', height:'12vh'}}>
           <div> 
            <img src={imagePreview} style={{width:'8vw', height:'11vh'}}/>
          </div>
        </div>
      </div>
           
            {/****image  block End *****/}


</div>   
      <button type="submit" className="btn btn-primary" >Submit</button>
       &nbsp;&nbsp;&nbsp;
      <button onClick={() => setOpen(false)} type="submit" className="btn btn-primary">
        Close Modal
      </button>          
      </form>
     </div>
    </div>              
</Modal>
 </div> 
</div>
</div>
  </>

)}

export default EditDelStaffArea;
