//Yup is a JavaScript library that helps you define and validate data schemas. Think of it as a tool that ensures the data your forms receive is exactly as expected. Whether you need to check if an email is valid or if a password meets certain criteria, Yup has you covered.
import * as Yup from "yup";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useRegisterPackMutation } from "@/redux/features/apis/packApi";
import Image from "next/image";
import ErrorMsg from "@/components/common/error-msg";
import {  useSelector } from "react-redux";
// icons
import { PiBackpackFill } from "react-icons/pi";
import { BsCoin } from "react-icons/bs";
import { GrStatusGood } from "react-icons/gr";
import { TbFileDescription } from "react-icons/tb";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { TbZoomCodeFilled } from "react-icons/tb";
import { GrNotes } from "react-icons/gr";
// libs to handle mutations graphQL
import { useMutation } from '@apollo/client';
import { ADD_PACK, VERIFY_PACK } from '../../../mutations/packmutation';
import axios from 'axios';

// schema
const schema = Yup.object().shape({
  nameplan: Yup.string().required().label("nameplan"),
  trialdays: Yup.string().required().label("trialdaysFeatures"),
  description: Yup.string().required().label("description"),
  features: Yup.string().required().label("featues"),
  timedays: Yup.number().required().label("timedays"),
  cost: Yup.number().required().label("cost"),
  code:Yup.string().required().label("code"),
});

const AddPackArea = () => {

  // get user from store
    const { user } = useSelector((state) => state.auth);
  // get status data to status select form
    const statusOptions = ['inactive', 'active'];
  
  // to handle category image
     const [image, setImage] = useState(null);
     const [selectedFile, setSelectedFile] = useState(null);
     const [imagePreview, setImagePreview] = useState();
      // to handle status field
     const [status, setStatus] = useState('');
      
  // create mutation function, pass variables when calling addUser
  const [addPack, { data: addPackData }] = useMutation(ADD_PACK);
  const [verifyPack, { data: verifyPackData }] = useMutation(VERIFY_PACK);

  // register category service to backend with redux-toolkit RTQ-query , to fecth data from backend
  const [registerPack, {}] = useRegisterPackMutation();
  const router = useRouter();
  const { redirect } = router.query;
  
  // react hook form
  const {register,handleSubmit,formState: { errors },reset} = useForm({
    resolver: yupResolver(schema),
  });

 // function to handle status select component in form

 const onstatusOptionsChangeHandler = (e) => {setStatus(e.target.value)};

 /*************************************************************************** */
 // function get Pack image Url from backEnd Graphql multer
const GetPackImageUrl =  async (formValues) => {
  const formData = new FormData();
  formData.append('Dataimage', selectedFile);

  try {
    const res = await axios.post('http://localhost:5000/upload-image', formData);
    if (res.data && res.data.image) {
      const imageUrl = res.data.image;
      // store in state for UI and debugging
      setImage(imageUrl);
      // call PostPackMutation with the image URL and form values
      await PostPackMutation(formValues, imageUrl);
    } else {
      notifyError('Image upload failed, please try again.');
    }
  } catch (err) {
    console.error('Upload image error:', err);
    notifyError('Image upload error');
  }
} // end of function get Pack image Url from backEnd Graphql multer
 /****************************************************************** */
/*********************************function to save Pack *********** **/
const PostPackMutation = async (formValues, imageUrl) => {

  try {
    // build variables from validated form values and coerce numeric fields to integers
    const variables = {
      nameplan: formValues?.nameplan ?? nameplan,
      description: formValues?.description ?? description,
      trialdays: parseInt(formValues?.trialdays ?? trialdays, 10) || 0,
      features: formValues?.features ?? features,
      timedays: parseInt(formValues?.timedays ?? timedays, 10) || 0,
      cost: parseInt(formValues?.cost ?? cost, 10) || 0,
      code: formValues?.code ?? code,
      status: status,
      image: imageUrl || image,
    };

    const response = await addPack({ variables });
    const createdId = response?.data?.addPack?.id;
    if (createdId) {
      notifySuccess('Pack created successfully ....');
      router.push(redirect || '/AdminDashboard');
    } else {
      notifyError('Pack creation failed');
    }
  } catch (err) {
    console.error('Error creating pack:', err);
    notifyError('Error creating pack');
  }
}
/****************************** end of function to save Pack ****************/
// on submit
  const handleSubmit01 = async (formValues) => {
    // validate for image item
    if (!selectedFile) {
      notifyError("Image require ...!!, please enter image ..!!");
      return;
    }
    // validate for status item
    if (!status) {
      notifyError("Status require ...!!, please Select Status Item ..!!");
      return;
    }

      PackVerifyMutation(formValues);
    
  } 

  /**************************************************************************** */
/******** Function to veify if a pack exist ***************/
const PackVerifyMutation = async (formValues) => {
  try {
    const variables = { code: formValues.code };
    const response = await verifyPack({ variables });

    // GraphQL responses may use different casing; try common keys
    const payload = response?.data?.verifyPack ?? response?.data?.verifypack ?? verifyPackData?.verifyPack ?? verifyPackData?.verifypack;
    if (payload) {
      // pack exists
      notifyError('Pack exists, use another Code to create a new Pack');
      reset();
      return;
    }

    // not found -> proceed to upload image and create pack
    GetPackImageUrl(formValues);
  } catch (err) {
    console.error('Error verifying pack:', err);
    notifyError('Error verifying pack');
  }
}
       

 // end of packVerifyMutation() function
/**************************************************************************** */

return (
    <>

 <div className="window rounded-3">
  <div className="row smallDevices">
    {/*-- Columna para la imagen --*/}
    <div className="col-md-5 d-flex justify-content-center align-items-center" style={{margin: '2em'}}>
     <Image className="img-fluid rounded-3" src="/assets/images/about-img-1.png" alt="Gym_logo" width={2000} height={2000}/>
    </div>
     <div className="col-md-5 rounded-3" style={{marginLeft:'2em'}}>
      <div className="logo text-center" >
       <div className="row nav_logo_texts" style={{ minHeight:'8em'}}>
        <div className="col-12">
         <span className="nav_logo-name" style={{position:'relative',top:'15px',color:' #2b69dd', marginTop:'1em', marginBottom:'2em'}}>
            Gym Control
         </span> 
        </div>
        <br/>
        <div className="col-12">
         <Image src="/assets/img/logo/logo2.jpg" width={50} height={50} alt="Gym-logo"/>&nbsp;&nbsp;
          <span className="nav_logo-name"  style={{color:' #2b69dd'}}>
            Sergio Fitness
          </span>
          <span className="nav_logo-name"  style={{color:' #0b0a4b', fontSize:'1rem', position: 'relative', top:'-5px',left:'5px'}}>App</span>
        </div>
      </div>
    </div>

    <div className="formPack">
     <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
      <div>
       <h2 className="text-center nav_logo-name" style={{paddingTop:'-1em', color:' #2b69dd'}}>
        Create Pack 
       </h2>
      </div>
    </div>
    <br/>
    <form onSubmit={handleSubmit(handleSubmit01)}> 

  {/**---- Pack nameplan section ----------------------****************/}  
  <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'}}>  

   <div className="mb-3 col-md-5">
    <label for="nameplan" className="form-label">
     <PiBackpackFill  size="32px"/>&nbsp; 
        Pack Name:
    </label>
            
     <input {...register("nameplan", { required: `Plan Name is required!` })} 
     name="nameplan" 
     id="nameplan" 
     type="text" 
     placeholder="Plan Name" 
     className="form-control input"
     autocomplete="off" />
     <ErrorMsg msg={errors.nameplan?.message} />        
    </div>

 {/*---- Pack cost section ----------------------*/}                       
 <div className="mb-3 col-md-3">
    <label for="cost" className="form-label">
      <BsCoin size="32px"/> &nbsp;
      Cost:
    </label>
     <input {...register("cost", { required: `Plan Cost is required!` })} 
     name="cost" 
     id="cost" 
     type="number" 
     placeholder="Plan Cost" 
     className="form-control input" 
     autocomplete="off" />
     <ErrorMsg msg={errors.cost?.message} />
   </div>

 {/**---- Pack status section ---------------------->**/}                       
 <div className="mb-3 col-md-3">
  <label for="status" className="form-label">
    <GrStatusGood size="32px"/> &nbsp;
    Status:
  </label>
   <select 
     id="status"
     onChange={onstatusOptionsChangeHandler}>
        <option>Choose Status</option>
          {(statusOptions).map((option, index) => {return (
            <option key={index}>
              &nbsp;&nbsp;{option}
            </option>
            );
            })}
      <ErrorMsg msg={errors.status?.message}/>
      </select>

       
 </div>  

</div> {/*--- End of section for planname, cost, status --*/}

{/**---- Pack description section --------------------*****/}                      
<div className="mb-3">
    <label for="description" className="form-label">
      <TbFileDescription size="32px"/> &nbsp;
          Pack Description:
    </label>
      <input {...register("description", { required: `Plan Description is required!` })} 
     name="description" 
     id="description" 
     type="text" 
     placeholder="Plan Description" 
     className="form-control input"
     autocomplete="off" />
     <ErrorMsg msg={errors.description?.message} />
   </div>
{/***!---- Pack trialdaysFeatures section --------------**********--*/}  
<div style={{display:'flex',flexDirection:'row', flexWrap:'wrap'}}>                  
<div className="mb-3 col-md-4">
    <label for="trialdays" className="form-label">
      <RiCalendarScheduleFill size="32px"/>
          Trials days Feat:
    </label>
      <input {...register("trialdays", { required: `Plan Trial Days is required!` })} 
     name="trialdays" 
     id="trialdays" 
     type="number" 
     placeholder="Plan Trial Days" 
     className="form-control input"
     autocomplete="off" />
     <ErrorMsg msg={errors.trialdays?.message} />
   </div>

{/**---- Pack timedays section ------------------------*************-*/}                       
<div className="mb-3 col-md-4" style={{marginLeft:'1em'}}>
    <label for="timedays" className="form-label">
      <RiCalendarScheduleFill size="32px"/> &nbsp; 
       Timedays:
    </label>
      <input {...register("timedays", { required: `Plan Trial Days is required!` })} 
     name="timedays" 
     id="timedays" 
     type="number" 
     placeholder="Plan Time Days"
     className="form-control input" 
     autocomplete="off" />
     <ErrorMsg msg={errors.timedays?.message} />
   </div>

{/***---- Pack code section -------------------------*/}                     
<div className="mb-3 col-md-3" style={{marginLeft:'1em'}}>
    <label for="code" className="form-label">
      <TbZoomCodeFilled size="32px"/> &nbsp;
       Code:
    </label>
      <input {...register("code", { required: `Plan Trial Days is required!` })} 
     name="code" 
     id="code" 
     type="text" 
     placeholder="Plan Code"
     className="form-control input" 
     autocomplete="off" />
     <ErrorMsg msg={errors.code?.message} />
   </div>
</div>  {/**!-- End of this line in view form -->*/}
{/*<!---- Pack features section ----------------*/}                      
<div className="mb-3">
    <label for="features" className="form-label">
      <GrNotes size="32px"/> &nbsp; 
          Features:
    </label>
     <input {...register("features", { required: `Plan features are required!` })} 
     name="features" 
     id="features" 
     type="text" 
     placeholder="Plan Features" 
     className="form-control input"
     autocomplete="off" />
     <ErrorMsg msg={errors.features?.message} />
   </div>
   {/*------ Pack Image Section -------------------------**********/}
    <div className="mb-3">
     <label for="image" className="control-label" style={{color: 'aliceblue', fontWeight:'bold'}}>
        Add Pack Picture:
    </label>
     <input classNameName='file-upload-input' type="file" name="image"
                id="" accept='.jpg, .jpeg, .png'
                onChange={event => {
                    const image = event.target.files[0];
                    setSelectedFile(image);
                    setImagePreview(URL.createObjectURL(event.target.files[0]))
                }}
                placeholder='Image'>
    </input>
    <div style={{marginBottom:10, display:'flex', flexDirection:'row', backgroundColor:'white', borderRadius:6,color:'#FFBF00', fontWeight:'bold', border:'3px double gray', width:'8vw', height:'12vh'}}>
             
           <img src={imagePreview} style={{width:'8vw', height:'11vh'}}/>
        </div>
    </div>                        
  {/*------ End Of Pack Image SEction ------------------*/}
<div className="text-center">
  <button type="submit" className="btn btn-primary w-100 mt-3 btnPack" id="btnpack" > 
    Create Pack
  </button>
  </div>
  <br/>
  <br/>
  <br/>
     </form>
     </div>
    </div>
   </div>
  </div>

{/**** my new addPackArea block end ******************/}

</>
  );
}
export default AddPackArea;