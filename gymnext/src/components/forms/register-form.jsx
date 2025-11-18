"use client";

import React ,{useState, useEffect, useRef} from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
//Yup is a JavaScript library that helps you define and validate data schemas. Think of it as a tool that ensures the data your forms receive is exactly as expected. Whether you need to check if an email is valid or if a password meets certain criteria, Yup has you covered.
import * as Yup from "yup";
import { useRouter } from "next/router";
// internal
import { CloseEye, OpenEye } from "@/svg";
import ErrorMsg from "../common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";
//import { useRegisterUserMutation } from "@/redux/features/auth/authApi";
import Image from "next/image";
/***Icons for form */
import { IoMdMail } from "react-icons/io";
import { MdOutlineKey } from "react-icons/md";
import { FaUser } from "react-icons/fa6";
/** import Services */
import { GetAllAdminService } from "./getAllAdminService";
// libs to handle mutations graphQL
import { useMutation } from '@apollo/client';
import { ADD_USER } from './authmutations';
import axios from 'axios';


const RegisterForm = () => {

// schema
const schema = Yup.object().shape({
  fullName: Yup.string().required().label("fullName"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  
});

   const [showPass, setShowPass] = useState(false);
   // to handle category image
   const [imageFBE, setImageFBE] = useState(null);
   const [selectedFile, setSelectedFile] = useState(null);
   const [imagePreview, setImagePreview] = useState();
   const [haveAdmin, setHaveAdmin]= useState('');
   const [isAdmin, SetIsAdmin] = useState('');

   // create mutation function, pass variables when calling addUser
   const [addUser, { data }] = useMutation(ADD_USER);

  const router = useRouter();
  const { redirect } = router.query;
  // react hook form
  const {register,handleSubmit,formState: { errors },reset} = useForm({
    resolver: yupResolver(schema),
  });
  
  // get all Admin from backend
const GetAllAdmin =  () => { GetAllAdminService(setHaveAdmin,SetIsAdmin); };

/*************************************************************************** */
// function get User image Url from backEnd Graphql multer
const GetUserImageUrl = async (formValues) => {
  const formData = new FormData();
  formData.append('Dataimage', selectedFile);

  try {
    const res = await axios.post('http://localhost:5000/upload-image', formData);
    if (res.data && res.data.image) {
      const imageUrl = res.data.image;
      // store in state for UI and debugging
      setImageFBE(imageUrl);
      // call PostUserMutation with the image URL and form values
      await PostUserMutation(formValues, imageUrl);
    } else {
      notifyError('Image upload failed, please try again.');
    }
  } catch (err) {
    console.error('Upload image error:', err);
    notifyError('Image upload error');
  }
} // end of function get User image Url from backEnd Graphql multer
/******************************************************************************* */

/*********************************function to save user *******/
const PostUserMutation = async (formValues, imageUrl) => {
  // formValues: validated values from react-hook-form
  try {
    const variables = {
      fullName: formValues?.fullName ?? fullName,
      email: formValues?.email ?? email,
      password: formValues?.password ?? password,
      isAdmin: formValues?.isAdmin ?? isAdmin,
      imageFBE: imageUrl || imageFBE,
    };

    const response = await addUser({ variables });
    const createdId = response?.data?.addUser?.id;
    if (createdId) {
      router.push(redirect || '/login');
    } else {
      notifyError('User creation failed');
    }
  } catch (err) {
    console.error('Error creating user:', err);
    notifyError('Error creating user');
  }
}

/****************************** end of function to save user */

useEffect(() => {
      console.log('Component mounted!');
      // Fetch data, set up event listeners, etc.
      GetAllAdmin();
    }, []); // Empty dependency array
  
  // on submit
  const onSubmit = async (formValues) => {

    // validate for image item
    if (!selectedFile) {
      notifyError("Image require ...!!, please enter image ..!!");
      return;
    }

    // upload image and create user using validated form values
    await GetUserImageUrl(formValues);

  } // end of onsubmit


  return (
   <>
   <div class="container mt-4" style={{marginBottom:'2em'}}>
    <div class="window rounded-3" style={{ height:'60em'}} >
     <div class="row windowsSSheight">
       {/***-- Columna para la imagen --*/}   
      
       <div class="col-md-5 "  style={{margin:'1em', minHeight:'30em !important'}}>
        <Image class="img-fluid rounded-3" src="/assets/images/work-2.png" alt="Gym_register" style={{marginTop:'3em', marginLeft:'2em', minHeight:'48em'}} width={1000} height={2800} />
        </div>

          <div class="col-md-6">
            <div class="logo text-center">
              <div class="row nav_logo_texts">
                <div class="col-md-12" style={{marginTop:'2em',marginBottom:'2em'}}>
                    <span class="nav_logo-name" style={{color: '#2b69dd'}}>Gym Control</span> 
                </div>
                <div class="col-12">
                    <Image src="/assets/img/logo/logo2.jpg" width={60} height={60} alt="pharmacy-logo"/>&nbsp;&nbsp;
                    <span class="nav_logo-name"  style={{color:' #2b69dd'}}>
                        Sergio Fitness
                    </span>
                    <span class="nav_logo-name"  style={{color:' #0b0a4b', fontSize: '1rem',   
                        position: 'relative', top: '-5px', left: '5px'}}>App
                    </span>
                    
                </div>
              </div>
            </div>
    <div class="formRegister" style={{height: '60em', marginBottom: '2em'}}>
     <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>          
      <div>
       <h2 class="text-center nav_logo-name" style={{paddingTop: '-1em', color:' #2b69dd'}}>
        Register 
       </h2>
      </div>
    </div>
<div class="formRegister">
 <div style={{display: 'flex', flexDirection: 'row', justifyContent:'center'}}>            
    <div class="col-lg-8">

     <form onSubmit={handleSubmit(onSubmit)}>
   
  {/**-- fullname input ---------------------------------------**************/}               
        <div class="mb-3">
          <label for="fullName" class="form-label">
           <FaUser size="32px"/> &nbsp; 
              Username:
          </label>
            <input
              {...register("fullName", { required: `fullName is required!` })}
               class="form-control input"
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Sergio Moncada"
            
            />
             <ErrorMsg msg={errors.name?.message} />
          </div>
         
  
     {/***-- is Email input   ------------------------------*/}             
       <div class="mb-3">
          <label for="email" class="form-label">
           <IoMdMail size="32px"/> &nbsp; 
              Email:
          </label>
                <input
              {...register("email", { required: `Email is required!` })}
              class="form-control input"
              id="email"
              name="email"
              type="email"
              placeholder="gym@yahoo.com"
            
            />
            <ErrorMsg msg={errors.email?.message} /> 
          </div>
         
  {/***-- is Password input ------------------------------------------*/}
  <div class="mb-3">
          <label for="password" class="form-label" id="password">
            <MdOutlineKey size="32px"/> &nbsp;
            Password:
          </label> 
          <div class="form-control input" >
           <input {...register("password", { required: `Password is required!` })} 
            id="password"
            type={showPass ? "text" : "password"}
            placeholder="Min. 6 character"
            style={{border:'none', width:'90%'}}
            />
              <span className="open-eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? <CloseEye /> : <OpenEye />}
              </span>
             </div> 
          <ErrorMsg msg={errors.password?.message}/>
        </div>     
  <br/>
  <br/>      
  <div class="mb-3">

    {/****image  block begining *****/}
              <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', flexWrap:'wrap', marginBottom:'20',}}>
             
             <div style={{marginBottom:10, display:'flex', flexDirection:'row', backgroundColor:'grey', borderRadius:6,color:'#FFBF00', fontWeight:'bold', border:'3px double gray', width:'35vw'}}>
              <label>&nbsp;&nbsp;Product Image:&nbsp;</label>
          
           <input 
               {...register("image")}
               className='file-upload-input' 
               type="file" 
               name="image"
               id="" accept='.jpg, .jpeg, .png'
               onChange={(e) => {
                  setSelectedFile(e.target.files[0]);
                  setImagePreview(URL.createObjectURL(e.target.files[0]))
                      }}
               placeholder='Image'>
           </input>
            <ErrorMsg msg={errors.image?.message} />
           </div>

           <div style={{marginBottom:10, display:'flex', flexDirection:'row', backgroundColor:'white', borderRadius:6,color:'#FFBF00', fontWeight:'bold', border:'3px double gray', width:'8vw', height:'12vh'}}>
            
          <img src={imagePreview} style={{width:'8vw', height:'11vh'}}/>
           </div>

           </div> 
           
            {/****image  block End *****/}
    </div>
                  
{/***------ End Of User Image Section ------------------*/}              
  
      <div class="text-center" style={{marginTop: '1em'}}>
          <button type="submit" class="btn btn-primary w-100 mt-3 btnRegister" id="btnRegister" >Register
          </button>
              <h2>the image is:{`${imageFBE}`}</h2>
      </div>
       <br/>
       <br/>
       <br/>
          </form>
        </div>
      </div>
      </div>
      </div>
    </div> {/*** End of col-md-6 */}
   </div>   {/***End of  */}
  </div>
</div>
</>
  )
}

export default RegisterForm;
