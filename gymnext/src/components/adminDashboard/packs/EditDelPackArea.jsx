"use client"; // cause don't need speed or user interaction

import  { useEffect, useState }   from "react";
import Image from "next/image";
import Modal from "react-modal";
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
import { PiBackpackFill } from "react-icons/pi";
import { BsCoin } from "react-icons/bs";
import { GrStatusGood } from "react-icons/gr";
import { TbFileDescription } from "react-icons/tb";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { TbZoomCodeFilled } from "react-icons/tb";
import { IoImagesOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
/*** import graphQL apollo libs */
import { useMutation } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { UPDATE_PACK, DELETE_PACK, DELETE_PACK_IMAGE } from '../../../mutations/packmutation';
import { GET_PACKS } from '../../../queries/packqueries';
import axios from 'axios';
import { DeletePackService } from "../staff/deletepackservice";

const EditDelPackArea = () => {

  let currentPack = [];  
  const router = useRouter();
  const BackendURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // local const handle with useState hook
  const [selected, setSelected] = useState(null);
  // const to handle state update function
  const [updatednameplan, setUpdatedNamePlan] = useState("");
  const [updateddescription, setUpdatedDescription] = useState("");
  const [updatedtrialdays, setUpdatedTrialdays] = useState(0);
  const [updatedfeatures, setUpdatedFeatures] = useState("");
  const [updatedtimedays, setUpdatedTimedays] = useState(0);
  const [updatedcost, setUpdatedCost] = useState(0);
  const [updatedcode, setUpdatedCode] = useState("");
  const [updatedstatus, setUpdatedStatus] = useState("");
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const searchParams = useSearchParams();
  const [searchdata, setSearchdata] = useState("");
  // function to get all staff data from backend
  const { loading, error, data } = useQuery(GET_PACKS);

  // deletePack, deletePackImage mutations functions, pass variables when calling the functions
    const [deletePackImage, { data: deletePackImageData }] = useMutation(DELETE_PACK_IMAGE);
    const [deletePackMutation, { data: deletePackData }] = useMutation(DELETE_PACK);
    const [updatePackMutation, { data: updatePackData }] = useMutation(UPDATE_PACK);

    //**** vars to handle pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const [packsPerPage] = useState(5);
  // vars to handle pagination
  const indexOfLastPack = currentPage * packsPerPage;
  const indexOfFirstPack = indexOfLastPack - packsPerPage;

 currentPack = data?.packs?.slice(indexOfFirstPack, indexOfLastPack) || [];
 const handlePagination = (pageNumber) => { setCurrentPage(pageNumber);}
// const to handle modal
const [open, setOpen] = useState(false);
// get status data to status select form
const statusOptions = [
  "active",
  "inactive"
];
// function to handle status select component in form
const onstatusOptionsChangeHandler = (e) => {setUpdatedStatus(e.target.value)};
// function to handle pack delete 
const deletePack = async (pack) => { 
     try {
       // show quick debug alerts if needed (remove in production)
      alert('I am at DeletePackService - line 85 - Pack.id:' + pack.id);
      alert('I am at DeletePackService - line 86 - Pack.image:'+ pack.image);

       // delete image on server first
       const imageToDelete = pack.image;
       const imgResult = PackDeleteImageMutation(imageToDelete);
       if (!imgResult) {
         // image deletion failed (we'll still attempt to delete the pack record)
         notifyError('Image deletion failed (will still try to delete pack record)');
       }
       alert('I am at DeletePackService - line 31 - Pack.id:'+ pack.id);
       // delete the pack record via Apollo mutation
       const variables = { id: pack.id }
       const packResult = deletePackMutation({variables});
       if (packResult) {
         notifySuccess('Pack and image deleted successfully');
         // reload the page once
         router.reload(window.location.pathname);
         return packResult;
       } else {
         notifyError('Pack delete failed');
         return null;
       }
     } catch (err) {
       console.error('Error in deletePack:', err);
       notifyError('Error deleting pack');
       return null;
     }
 }

 /******** Function to delete a pack image on the server ***************/
 const PackDeleteImageMutation = async (imageToDelete) => {

   //alert('Im at PackDeleteImageMutation - line 134 - imageToDelete: '+imageToDelete);
   try {
     const variables = { image: imageToDelete };
     const response = await deletePackImage({ variables });

     // The DELETE_PACK_IMAGE mutation returns the deleted pack (id) under `deletePack`.
     const payload = response?.data?.deletePackImage ?? deletePackImageData?.deletePackImage;

    //alert('Im at PackDeleteImageMutation - line 142 - payload: '+ payload)

     if (payload) {
       // deletion succeeded
       notifySuccess('Image deleted successfully');
       return payload;
     } else {
       notifyError('Image delete failed');
       return null;
     }
   } catch (err) {
     console.error('Error deleting pack image:', err);
     notifyError('Error deleting pack image');
     return null;
   }
 }
  // end of PackDeleteImageMutation function
   //update Pack function
   const handleUpdate = async (e) => {
    
    e.preventDefault();

    // validate for image item
    if (!selectedFile) {      
      notifyError("Image require ...!!, please enter image ..!!");
      return;    
      }

    // validate for status item
    if (!updatedstatus) {      
        notifyError("Status require ...!!, please Select Status Item ..!!");
        return;
    }
// alert('selected._id - editdelPack-area - line 166:'+selected._id);
// alert('selected.image - editdelPack-area - line 167:'+selected.image);
   
/************************************************************ */
// function to delete the image in backend     
 const ImageDel = selected.image; // selected comes from button to erase staff
 //alert('Im at editDelPackArea handleUpdate - line 172 - ImageDel: '+ ImageDel);
 PackDeleteImageMutation(ImageDel);
 GetPackImageUrl(selectedFile);
  }
/****************************************************** */
// function get Pack image Url from backEnd Graphql multer
const GetPackImageUrl =  async (selectedFile) => {
  const formData = new FormData();
  formData.append('Dataimage', selectedFile);
  
  try {
    const res = await axios.post('http://localhost:5000/upload-image', formData);
    if (res.data && res.data.image) {
      const imageUrl = res.data.image;
      //alert('Im at editDelPackArea GetPackImageUrl - line 186 - ImageUrl: '+ res.data.image);
      // store in state for UI and debugging
      setImage(imageUrl);
      // call PostPackMutation with the image URL and form values
      await GetupdatePackMutation(imageUrl);
    } else {
      notifyError('Image upload failed, please try again.');
    }
  } catch (err) {
    console.error('Upload image error:', err);
    notifyError('Image upload error');
  }
} // end of function get Pack image Url from backEnd Graphql multer

/****************************************************** */
const GetupdatePackMutation =  async (imageUrl) => {
 //alert('Im at EditDelPackArea - GetupdatePackMutation - line 204 - selected?.id: ' + selected?.id);
 //alert('Im at EditDelPackArea - GetupdatePackMutation - line 205 - imageUrl: ' + imageUrl)
      // Build variables for the GraphQL update mutation (use selected id)
      const variables = {
        id: selected?._id ?? selected?.id,
        nameplan: updatednameplan,
        description: updateddescription,
        trialdays: parseInt(updatedtrialdays, 10) || 0,
        features: updatedfeatures,
        timedays: parseInt(updatedtimedays, 10) || 0,
        cost: parseInt(updatedcost, 10) || 0,
        code: updatedcode,
        status: updatedstatus,
        // If `image` is a File object we keep the existing selected.image string for the graphql call.
        image: imageUrl || image,
      };
      try {
        const response = await updatePackMutation({ variables });
        if (response?.errors) {
          notifyError('Update Pack Failed');
        } else {
          notifySuccess('Pack updated Successfully');
          router.reload(window.location.pathname);
        }
      } catch (err) {
        console.error('Error updating pack:', err);
        notifyError('Error updating pack');
      }
};

/***************************************************** */
// decide what to render
let content = null;
if (data?.packs?.length > 0) {
    //const product_items = products.data;
     content = currentPack.filter((Pack) => {
      // here it is the function to search the products
      // if it is empty, returns all list
        if (searchdata == null) {
                return {Pack}
              // if search data is not empty return product filtered with search data string  
            } else if (Pack.nameplan.toLowerCase().includes(searchdata.toLowerCase())) {
                return Pack
            }
        }).map((Pack,index) => (   
      <tr key={Pack.id}>
                <td className="text-center sftables">{index+1}</td>
                <td className="text-center sftables">{Pack.nameplan}</td>
                <td className="text-center sftables">{Pack.description}</td>
                <td className="text-center"><img src={`${BackendURL}`+Pack?.image} height='70' width='60' style={{borderRadius:5}}/></td>
                <td className="text-center sftables">{Pack.trialdays}</td>
                <td className="text-center sftables">{Pack.timedays}</td>
                <td className="text-center sftables">{Pack.cost}</td>
                <td className="text-center sftables">{Pack.code}</td>
                <td className="text-center sftables">{Pack.status}</td>
                <td className="text-center">
                  
                <button className="btn btn-primary m-2" onClick={() => { setOpen(true);      setUpdatedNamePlan(Pack.nameplan);
                setUpdatedDescription(Pack.description);
                setImage(Pack.imgURL);
                setUpdatedCode(Pack.code);
                setUpdatedTimedays(Pack.timedays);
                setUpdatedTrialdays(Pack.trialdays);
                setUpdatedCost(Pack.cost);
                setUpdatedStatus(Pack.status);
                setUpdatedFeatures(Pack.features);
                setSelected(Pack);
                }}>Edit</button>
                  <button className="btn btn-danger ms-2" onClick={() =>{setSelected(Pack), deletePack(Pack)}}>Delete</button>
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
         placeholder="Search Product Item By Code"
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

     <h3 className="text-center" style={{marginBottom:40, marginTop:20}}>Edit/Delete Table Packs</h3>
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
              <th scope="col" className="text-center sftables">Description</th>
              <th scope="col" className="text-center sftables">Image</th>
              <th scope="col" className="text-center sftables">Trial days</th>
              <th scope="col" className="text-center sftables">timedays</th>
              <th scope="col" className="text-center sftables">Cost</th>
              <th scope="col" className="text-center sftables">Code</th>
              <th scope="col" className="text-center sftables">Status</th>
              <th scope="col" className="text-center sftables">Actions</th>
            </tr>
          </thead>
          <tbody>
             {content}
         </tbody>
        </table>

  <Pagination length={data?.packs?.length} packsPerPage={packsPerPage} handlePagination={handlePagination} currentPage={currentPage}/>
        { /**** bootstrap pagination ********/}
      <div className="Pagination">
        <PaginationControl
                  style={{ maxHeight:'1em'}}
                  page={currentPage}
                  between={4}
                  total={data?.packs?.length}
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
    <h4 style={{textAlign:'center', marginBottom:40}}>Pack - Update</h4>
</div>
   <form onSubmit={handleUpdate}>
    <div>

{/****Name and code block begining *****/}
<div className="AlignItemsForm" style={{display:'flex', flexDirection:'row', justifyContent:'space-between', flexWrap:'wrap'}}>

<div className="mb-3 col-md-5">

<label for="nameplan" className="form-label">
     <PiBackpackFill  size="20px" style={{color:'black'}}/>&nbsp; 
        Pack Name: &nbsp; 
</label>
      <input 
      type="text" 
      name='nameplan' 
      className="form-control input" 
      value={updatednameplan} 
      onChange={(e) => setUpdatedNamePlan(e.target.value)} 
      style={{maxHeight:30, minWidth:'20vw'}}/>
</div>

 <div className="mb-3 col-md-5">
    
  <label for="code" className="form-label">
      <TbZoomCodeFilled size="20px" style={{color:'black'}}/> &nbsp;
       Code:
  </label>
    <input 
    type="text" 
    name='code' 
    className="form-control input" 
    value={updatedcode} onChange={(e) => setUpdatedCode(e.target.value)} 
    style={{maxHeight:30, minWidth:'10vw'}}/>
 </div>
</div>

 {/****Name and code block end *****/}

  {/****description and cost block begining *****/}
<div className="AlignItemsForm" style={{display:'flex', flexDirection:'row', justifyContent:'space-between', flexWrap:'wrap', marginBottom:20}}>

<div className="mb-3 col-md-5">

 <label for="description" className="form-label">
      <TbFileDescription size="20px" style={{color:'black'}}/> &nbsp;
          Pack Description:
 </label>
  <input 
    type="text" 
    name='description' 
    className="form-control input" 
    value={updateddescription} 
    onChange={(e) => setUpdatedDescription(e.target.value)} 
    style={{maxHeight:30, minWidth:'25vw'}}/>
</div>

<div className="mb-3 col-md-4">

<label for="cost" className="form-label">
      <BsCoin  size="20px" style={{color:'black'}}/> &nbsp;
      Cost:
</label>
  <input 
    type="number" 
    name='cost' 
    className="form-control input" 
    placeholder='Enter Cost' 
    value={updatedcost} 
    onChange={(e) => setUpdatedCost(e.target.value)} 
    style={{maxHeight:30, maxWidth:'13vw'}}/>
</div>
</div>

 {/****Description and cost block end *****/}
  {/****trialdays, timedays, status block begining *****/}
  <div className="AlignItemsForm" style={{display:'flex', flexDirection:'row', justifyContent:'space-between', flexWrap:'wrap', marginBottom:20}}>

<div className="mb-3 col-md-3">

<label for="trialdays" className="form-label">
  <RiCalendarScheduleFill size="20px" style={{color:'black'}}/>&nbsp;
    Trials days:
</label>
      <input 
      type="number" 
      name='trialdays' 
      className="form-control input" 
      placeholder='Enter new Trial Days' 
      value={updatedtrialdays} 
      onChange={(e) => setUpdatedTrialdays(e.target.value)} 
      style={{maxHeight:30, minWidth:'9vw'}} min="1"/>
</div>
<div className="mb-3 col-md-3">
  
<label for="trialdays" className="form-label">
    <RiCalendarScheduleFill size="20px" style={{color:'black'}}/>&nbsp;
    Time days:
</label>
      <input 
      type="number" 
      name='timedays' 
      className="form-control input" 
      value={updatedtimedays} 
      onChange={(e) => setUpdatedTimedays(e.target.value)} 
      style={{maxHeight:30, maxWidth:'13vw'}} min='1'/>
      
</div>

 {/*********** status input option bock begining  ****************/}

<div className="mb-3 col-md-3">
   
<label for status  className="form-label">
  <GrStatusGood size="20px" style={{color:'black'}}/>&nbsp;
  Status:
</label>&nbsp;
              
              <select onChange={onstatusOptionsChangeHandler}>
                <option>Choose Status</option>
                 
                {(statusOptions).map((option, index) => {
                    return (
                        
                        <option key={index}>
                            &nbsp;&nbsp;{option}
                        </option>
                    );
                })}
              </select>
  </div>
{/*********** status input option block end   ****************/}
</div>
 {/****trialdays, timedays, features block end *****/}

{/**** features begining block */}

 <div className="AlignItemsForm" style={{display:'flex', flexDirection:'row', justifyContent:'space-between', flexWrap:'wrap', marginBottom:20}}>

<div className="mb-3 col-md-4">
      <label for="code" className="form-label">
            <TbZoomCodeFilled size="20px" style={{color:'black'}}/>&nbsp;
             Features:
      </label>
      <input 
        type="text" 
        name='code' 
        className="form-control input" 
        placeholder='Enter Brand' 
        value={updatedfeatures} 
        onChange={(e) => setUpdatedFeatures(e.target.value)} 
        style={{maxHeight:30, minWidth:'40vw'}}/>
</div>
</div>

{/**** features block end***** */}
 
 <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', flexWrap:'wrap', marginBottom:20,}}>
             
             {/*<div style={{marginBottom:10, display:'flex', flexDirection:'row', backgroundColor:'grey', borderRadius:6,color:'#FFBF00', fontWeight:'bold', border:'3px double gray', width:'35vw'}}>*/}

<div className="mb-3 col-md-4">

      <label for="code" className="form-label">
            <IoImagesOutline size="20px" style={{color:'black'}}/>&nbsp;
             Pack Image:
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

export default EditDelPackArea;