"use client"; // cause don't need speed or user interaction

import  { useEffect, useState }   from "react";
import { useUpdateClassMutation } from "../../../redux/features/apis/classApi";
import { useDeleteClassMutation } from "../../../redux/features/apis/classApi";
import Image from "next/image";
import Modal from "react-modal";
/*** service to get all categories, to use it in product form *****/
import { GetAllClassesService } from "./getAllClassesService";
import { useDeleteClassImageMutation } from "../../../redux/features/apis/classApi";
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
import { RiCalendarScheduleFill } from "react-icons/ri";
import { TbZoomCodeFilled } from "react-icons/tb";
import { GrNotes } from "react-icons/gr";
import { FaUserShield } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { IoImagesOutline } from "react-icons/io5";
/*** import graphQL apollo libs */
import { useMutation } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { UPDATE_CLASS, DELETE_CLASS, DELETE_CLASS_IMAGE } from '../../../mutations/classesmutation';
import { GET_CLASSES } from '../../../queries/classesqueries';
import axios from 'axios';

const EditDelClassArea = () => {

  const router = useRouter();
  const BackendURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  // local const handle with useState hook
  const [classes, setClasses] = useState([]);
  const [selected, setSelected] = useState(null);
  // const to handle state update function
  const [updatedclassname, setUpdatedClassname] = useState("");
  const [updatedcode, setUpdatedCode] = useState("");
  const [updatedclassday, setUpdatedClassday] = useState("");
  const [updatedclasstime, setUpdatedClasstime] = useState("");
  const [updatedclasslevel, setUpdatedClasslevel] = useState("");
  const [updatedsession_time, setUpdatedSession_time] = useState(0);
  const [updatedprice, setUpdatedPrice] = useState(0);
  const [updatedtrainer, setUpdatedTrainer] = useState("");
  const [updatedkey_benefits, setUpdatedKey_benefits] = useState("");
  const [updatedexpert_trainer, setUpdatedExpert_trainer] = useState("");
  const [updatedclass_overview, setUpdatedClass_overview] = useState("");
  const [updatedwhy_matters, setUpdatedWhy_matters] = useState("");
  const [updateddateBegin, setUpdatedDateBegin] = useState("");
  
  const [image, setImage] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState();
  const searchParams = useSearchParams();
  const [searchdata, setSearchdata] = useState("");
  // const to handle modal
  const [open, setOpen] = useState(false);
  // to handle status field
  const [day, setDay] = useState("");

  // get status data to status select form
    const daysOptions = ['Monday', 'Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  // function to handle days select component in form
    const ondaysOptionsChangeHandler = (e) => {setDay(e.target.value)};

  // function to get all staff data from backend
    const { loading, error, data } = useQuery(GET_CLASSES);
  
    // deleteClass, deleteClassImage mutations functions, pass variables when calling the functions
      const [deleteClassImage, { data: deleteClassImageData }] = useMutation(DELETE_CLASS_IMAGE);
      const [deleteClassMutation, { data: deleteClassData }] = useMutation(DELETE_CLASS);
      const [updateClassMutation, { data: updateClassData }] = useMutation(UPDATE_CLASS);
  
  //**** vars to handle pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const [classesPerPage] = useState(5);

  // vars to handle pagination
  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClass = data?.classes?.slice(indexOfFirstClass, indexOfLastClass) || [];

 const handlePagination = (pageNumber) => { setCurrentPage(pageNumber) }
 
// function to handle pack delete 
const deleteClass = async (klass) => { 
     try {
       // show quick debug alerts if needed (remove in production)
      //alert('I am at DeleteClass - line 98 - Class.id:' + klass.id);
      //alert('I am at DeleteClass - line 99 - Class.image:'+ Klass.image);

       // delete image on server first
       const imageToDelete = klass.image;
       const imgResult = ClassDeleteImageMutation(imageToDelete);
       if (!imgResult) {
         // image deletion failed (we'll still attempt to delete the class record)
         notifyError('Image deletion failed (will still try to delete Class record)');
       }
       //alert('I am at DeleteClass - line 108 - klass.id:'+ klass.id);
       // delete the pack record via Apollo mutation
       const variables = { id: klass.id }
       const klassResult = deleteClassMutation({variables});
       if (klassResult) {
         notifySuccess('Class and image deleted successfully');
         // reload the page once
         router.reload(window.location.pathname);
         return klassResult;
       } else {
         notifyError('Class delete failed');
         return null;
       }
     } catch (err) {
       console.error('Error in deleteClass:', err);
       notifyError('Error deleting klass');
       return null;
     }
 } // end of deleteClass

  /******** Function to delete a pack image on the server ***************/
 const ClassDeleteImageMutation = async (imageToDelete) => {

   //alert('Im at ClassDeleteImageMutation - line 131 - imageToDelete: ' + imageToDelete);
   try {
     const variables = { image: imageToDelete };
     const response = await deleteClassImage({ variables });

     // The DELETE_PACK_IMAGE mutation returns the deleted pack (id) under `deletePack`.
     const payload = response?.data?.deleteClassImage ?? deleteClassImageData?.deleteClassImage;

    //alert('Im at ClassDeleteImageMutation - line 139 - payload: '+ payload)

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
  // end of ClassDeleteImageMutation function
  //update Class function
   const handleUpdate = async (e) => {
    
    e.preventDefault();

    // validate for image item
    if (!selectedFile) {      
      notifyError("Image require ...!!, Please Enter image ..!!");
      return;    
      }

    // validate for status item
    if (!updatedclassday) {      
        notifyError("Class Day required ...!!, Please Select Class Day Item ..!!");
        return;
    }
// function to delete the image in backend     
 const ImageDel = selected.image; // selected comes from button to erase staff
 //alert('Im at editDelClassArea handleUpdate - line 174 - ImageDel: '+ ImageDel);
 ClassDeleteImageMutation(ImageDel);
 GetClassImageUrl(selectedFile);
   }
 
// function get Pack image Url from backEnd Graphql multer
const GetClassImageUrl =  async (selectedFile) => {
  const formData = new FormData();
  formData.append('Dataimage', selectedFile);
  try {
    const res = await axios.post('http://localhost:5000/upload-image', formData);
    if (res.data && res.data.image) {
      const imageUrl = res.data.image;
      //alert('Im at editDelClassArea GetClassImageUrl - line 187 - ImageUrl: '+ res.data.image);
      // store in state for UI and debugging
      setImage(imageUrl);
      // call PostPackMutation with the image URL and form values
      await GetupdateClassMutation(imageUrl);
    } else {
      notifyError('Image upload failed, please try again.');
    }
  } catch (err) {
    console.error('Upload image error:', err);
    notifyError('Image upload error');
  }
} // end of function get Class image Url from backEnd Graphql multer

/****************************************************** */
const GetupdateClassMutation =  async (imageUrl) => {
 //alert('Im at EditDelClassArea - GetupdateClassMutation - line 204 - selected?.id: ' + selected?.id);
      // Build variables for the GraphQL update mutation (use selected id)
      const variables = {
        id: selected?.id,
        classname:      updatedclassname,
        code:           updatedcode,
        classday:       updatedclassday,
        classtime:      updatedclasstime,
        classlevel:     updatedclasslevel,
        session_time:   parseInt(updatedsession_time, 10) || 0,
        price:          parseInt(updatedprice, 10) || 0,
        trainer:        updatedtrainer,
        key_benefits:   updatedkey_benefits,
        expert_trainer: updatedexpert_trainer,
        class_overview: updatedclass_overview,
        why_matters:    updatedwhy_matters,
        image:          imageUrl || image,
        dateBegin:      updateddateBegin,
      
      };
      try {
        const response = await updateClassMutation({ variables });
        if (response?.errors) {
          notifyError('Update Class Failed');
        } else {
          notifySuccess('Class updated Successfully');
          router.reload(window.location.pathname);
        }
      } catch (err) {
        console.error('Error updating pack:', err);
        notifyError('Error updating pack');
      }
};
/***************************************************** */
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

     <h3 className="text-center" style={{marginBottom:40, marginTop:20}}>Edit/Delete Table Classes</h3>
   </div>

  <div style={{marginBottom:20}} >

  {/*************  table area block Begining ****************** */}
  <span>
  {/*** SearchData block ********/}
   <div className="table-responsive" style={{overflowY:'scroll',
                           maxHeight:'64vh', overflowX:'scroll'}}>
        <table className="table table-responsive" style={{borderRadius:10, overflowX:'scroll'}}>
          <thead className="table-dark" style={{position:'sticky', top:0}}>
            <tr>
              <th scope="col" className="text-center sftables" >#</th>
              <th scope="col" className="text-center sftables">Name</th>
              <th scope="col" className="text-center sftables">code</th>
              <th scope="col" className="text-center sftables">Image</th>
              <th scope="col" className="text-center sftables">Class Day</th>
              <th scope="col" className="text-center sftables">Class Time</th>
              <th scope="col" className="text-center sftables">Class Level</th>
              <th scope="col" className="text-center sftables">Session Time</th>
              <th scope="col" className="text-center sftables">Price</th>
              <th scope="col" className="text-center sftables">Trainer</th>
              <th scope="col" className="text-center sftables">Key Benefits</th>
              <th scope="col" className="text-center sftables">Actions</th>
            </tr>
          </thead>
          <tbody>

            {/***if there are products - show table */}
            {currentClass.filter((Class) => {
            if (searchdata == null) {
                return Class
            } else if (Class.code.toLowerCase().includes(searchdata.toLowerCase())) {
                return Class
            }
        }).map((Class, index) => (
              <tr key={Class.id}>
                <td className="text-center sftables">{index+1}</td>
                <td className="text-center sftables">{Class.classname}</td>
                <td className="text-center sftables">{Class.code}</td>
                <td className="text-center"><img src={`${BackendURL}`+Class?.image} height='70' width='60' style={{borderRadius:5}}/></td>
                <td className="text-center sftables">{Class.classday}</td>
                <td className="text-center sftables">{Class.classtime}</td>
                <td className="text-center sftables">{Class.classlevel}</td>
                <td className="text-center sftables">{Class.session_time}</td>
                <td className="text-center sftables">{Class.price}</td>
                <td className="text-center sftables">{Class.trainer}</td>
                <td className="text-center sftables">{Class.key_benefits}</td>

             
                <td className="text-center">
                  
                <button className="btn btn-primary m-2" onClick={() => { setOpen(true);      setUpdatedClassname(Class.classname);
                setUpdatedCode(Class.code);
                //setImage(CLASS.imgURL);
                setUpdatedClassday(Class.classday);
                setUpdatedClasstime(Class.classtime);
                setUpdatedClasslevel(Class.classlevel);
                setUpdatedSession_time(Class.session_time);
                setUpdatedPrice(Class.price);
                setUpdatedTrainer(Class.trainer);
                setUpdatedKey_benefits(Class.key_benefits);
                setUpdatedExpert_trainer(Class.expert_trainer);
                setUpdatedClass_overview(Class.class_overview);
                setUpdatedWhy_matters(Class.why_matters);
                setUpdatedDateBegin(Class.dateBegin);
                setSelected(Class);
                }}>Edit</button>

                  <button className="btn btn-danger ms-2" onClick={() =>{setSelected(Class), deleteClass(Class)}}>Delete</button>
                </td>
              </tr>
            ))}
            
          </tbody>
         
        </table>
        <Pagination length={classes.length} classesPerPage={classesPerPage} handlePagination={handlePagination} currentPage={currentPage}/>
        { /**** bootstrap pagination ********/}
      <div className="Pagination">
        <PaginationControl
                  page={currentPage}
                  between={4}
                  total={data?.classes?.length}
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
    <h4 style={{textAlign:'center', marginBottom:40}}>Class - Update</h4>
</div>
   <form onSubmit={handleUpdate}>
    <div>

{/** <!---- group classname, begin dat, day section ----------------------> ****/}  
<div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between', marginBottom:20}} className="AlignItemsForm"> 

{/** <!---- group classname section ----------------------> ****/}  
   <div className="mb-3 col-md-4">
    <label for="classname" className="form-label">
     <PiBackpackFill   size="32px"/>&nbsp; 
        Class Name:
    </label>
      <input 
      type="text" 
      name='classname' 
      className="form-control input" 
      value={updatedclassname} 
      onChange={(e) => setUpdatedClassname(e.target.value)} 
      style={{maxHeight:30, minWidth:'20vw'}}/>
</div>
{/** <!---- group begin date section ----------------------> ****/}
 
 <div className="mb-3 col-md-4">
     <label for="dateBegin" className="form-label">
       <RiCalendarScheduleFill size="32px"/> &nbsp;
       Begin Date:
     </label>
    <input 
    type="text" 
    name='dateBegin' 
    className="form-control input" 
    value={updateddateBegin} onChange={(e) => setUpdatedDateBegin(e.target.value)} 
    style={{maxHeight:30, minWidth:'10vw'}}/>
 </div>
{/** <!---- group day section ----------------------> ****/}

{/*<div className="mb-3 col-md-3">
  <label for="classday" className="form-label">
    <RiCalendarScheduleFill size="32px"/> &nbsp;
    Class Day:
  </label>
   <select 
     id="day"
     style={{minHeight:38}}
     onChange={ondaysOptionsChangeHandler}>
        <option>Choose Day</option>
          {(daysOptions).map((option, index) => {return (
            <option key={index}>
              &nbsp;&nbsp;{option}
            </option>
            );
            })}
      </select>

       
 </div>  */}
<div className="mb-3 col-md-4">
     <label for="dateBegin" className="form-label">
       <RiCalendarScheduleFill size="32px"/> &nbsp;
       Class Day:
     </label>
    <input 
    type="text" 
    name='dateBegin' 
    className="form-control input" 
    value={updatedclassday} onChange={(e) => setUpdatedClassday(e.target.value)} 
    style={{maxHeight:30, minWidth:'10vw'}}/>
 </div>

</div> {/*** group classname, begin dat, day section end Block */} 


{/**-<!---  section for hours , price, code  ---------->***/} 

<div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between', marginBottom:20}} className="AlignItemsForm"> 

{/**-<!---  section for hours ---------->***/}
<div class="mb-3 col-md-4">
    <label for="classtime" className="form-label">
      <RiCalendarScheduleFill size="32px"/>&nbsp;
          hours/day,am-pm:
    </label>
  <input 
    type="text" 
    name='classtime' 
    className="form-control input" 
    value={updatedclasstime} 
    onChange={(e) => setUpdatedClasstime(e.target.value)} 
    style={{maxHeight:30, minWidth:'12vw'}}/>
</div>

{/***!---- section for price, --------------**********--*/}  
                  
<div className="mb-3 col-md-3">
    <label for="price" className="form-label">
      <BsCoin size="32px"/>&nbsp;
          Price:
    </label>
  <input 
    type="number" 
    name='price' 
    className="form-control input" 
    value={updatedprice} 
    onChange={(e) => setUpdatedPrice(e.target.value)} 
    style={{maxHeight:30, maxWidth:'8vw'}}/>
</div>

{/**---- Class code section ------------------------*************-*/}                       
<div className="mb-3 col-md-3">
    <label for="code" className="form-label">
      <TbZoomCodeFilled size="32px"/> &nbsp; 
       Code:
    </label>
 <input 
    type="text" 
    name='code' 
    className="form-control input" 
    value={updatedcode} 
    onChange={(e) => setUpdatedCode(e.target.value)} 
    style={{maxHeight:30, maxWidth:'8vw'}}/>
</div>   

</div> {/***** section for hours , price, code end block */}

 {/***---<!---- Class trainer, level, days section ---------------->*/}
<div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between', marginBottom:20}} className="AlignItemsForm"> 

{/***---<!---- Class trainer section ---------------->*/}

<div className="mb-3 col-md-3">
    <label for="trainer" className="form-label">
      <FaUserShield size="32px"/> &nbsp;
       Trainer:
    </label>
      <input 
      type="text" 
      name='trainer' 
      className="form-control input" 
      value={updatedtrainer} 
      onChange={(e) => setUpdatedTrainer(e.target.value)} 
      style={{maxHeight:30, minWidth:'9vw'}}/>
</div>

{/***---<!---- Class level section ---------------->*/}
<div className="mb-3 col-md-3">
    <label for="classlevel" className="form-label">
      <GrNotes size="32px"/> &nbsp; 
          Class level:
    </label>
      <input 
      type="text" 
      name='classlevel' 
      className="form-control input" 
      value={updatedclasslevel} 
      onChange={(e) => setUpdatedClasslevel(e.target.value)} 
      style={{maxHeight:30, maxWidth:'6vw'}}/>
      
</div>

{/***---<!---- Class days section ---------------->*/}

<div className="mb-3 col-md-3">
    <label for="session_time" className="form-label">
      <RiCalendarScheduleFill size="32px"/> &nbsp; 
          # Days:
    </label>&nbsp;
              
    <input 
      type="number" 
      name='session_time' 
      className="form-control input" 
      value={updatedsession_time} 
      onChange={(e) => setUpdatedSession_time(e.target.value)} 
      style={{maxHeight:30, maxWidth:'6vw'}}/>
      
 </div>
</div> {/**** Class trainer, level, days section end block */}

 {/*<!---- Class key_benefits section ---------------->**********/}

<div className="mb-3 col-md-12 AlignItemsForm">
    <label for="key_benefits" className="form-label">
      <GrNotes size="32px"/> &nbsp; 
          Key Benefits:
    </label>
      <input 
        type="text" 
        name='key_benefits' 
        className="form-control input"  
        value={updatedkey_benefits} 
        onChange={(e) => setUpdatedKey_benefits(e.target.value)} 
        style={{maxHeight:30, minWidth:'40vw'}}/>
</div>


   <div className="mb-3 col-md-12 AlignItemsForm">
    <label for="expert_trainer" className="form-label">
      <GrNotes size="32px"/> &nbsp; 
          Expert Trainer:
    </label>
    <input 
        type="text" 
        name='expert_trainer' 
        className="form-control input"  
        value={updatedexpert_trainer} 
        onChange={(e) => setUpdatedExpert_trainer(e.target.value)} 
        style={{maxHeight:30, minWidth:'40vw'}}/>
</div>

  {/*<!---- Class class_overview section ---------------->**********/}

   <div className="mb-3 col-md-12 AlignItemsForm">
    <label for="class_overview" className="form-label">
      <GrNotes size="32px"/> &nbsp; 
          Class Overview:
    </label>
    <input 
        type="text" 
        name='class_overview' 
        className="form-control input"  
        value={updatedclass_overview} 
        onChange={(e) => setUpdatedClass_overview(e.target.value)} 
        style={{maxHeight:30, minWidth:'40vw'}}/>
</div>
  
{/*<!---- Class why_matters section ---------------->**********/}

   <div className="mb-3 col-md-12 AlignItemsForm">
    <label for="why_matters" className="form-label">
      <GrNotes size="32px"/> &nbsp; 
          Why Matters:
    </label>
    <input 
        type="text" 
        name='why_matters' 
        className="form-control input"  
        value={updatedwhy_matters} 
        onChange={(e) => setUpdatedWhy_matters(e.target.value)} 
        style={{maxHeight:30, minWidth:'40vw'}}/>
</div>
 
 {/**** Image block */}
 <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', flexWrap:'wrap', marginBottom:20,}}>

<div className="mb-3 col-md-4">

      <label for="code" className="form-label">
            <IoImagesOutline size="20px" style={{color:'black'}}/>&nbsp;
             Class Image:
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

export default EditDelClassArea;