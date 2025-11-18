
//Yup is a JavaScript library that helps you define and validate data schemas. Think of it as a tool that ensures the data your forms receive is exactly as expected. Whether you need to check if an email is valid or if a password meets certain criteria, Yup has you covered.
import * as Yup from "yup";
import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import ErrorMsg from "@/components/common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useRegisterMemberMutation } from "@/redux/features/apis/memberApi";
import { useSelector } from "react-redux";
/***Icons *****/
import { IoPersonCircleSharp } from "react-icons/io5";
import { FiPhoneCall } from "react-icons/fi";
import Image from "next/image";
import Cookies from "js-cookie";
import { useMutation } from '@apollo/client';
import { ADD_MEMBER, VERIFY_MEMBER } from '../../../mutations/membermutation';


// schema
const schema = Yup.object().shape({
  client_CI: Yup.string().required().label("client_CI"),
  phone: Yup.string().required().label("phone"),
});


const SaleDetailsArea = ({pack}) => {

    // get user from store
    const { user } = useSelector((state) => state.auth);
    const BackendURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const { id, image, nameplan, field } = pack || {};  

    // react hook form
  const {register,handleSubmit,formState: { errors },reset} = useForm({
    resolver: yupResolver(schema),
  });

  // register member service to backend with redux-toolkit RTQ-query , to fecth data from backend
    //const [registerMember, {}] = useRegisterMemberMutation();
    const router = useRouter();
    const { redirect } = router.query;

 // to handle member Data to backend
     const [namemember, setNameMember] = useState(user.fullName);
     const [email, setemail] = useState(user.email);
     const [imageUser, setImageUser] = useState(user?.imageFBE);
     

  // create mutation function, pass variables when calling addUser
     const [verifyMember, { data: verifyMemberData }] = useMutation(VERIFY_MEMBER);
     const [addMember, { data }] = useMutation(ADD_MEMBER);

 
/*********************************function to save user *******/
const PostMemberMutation = async (formValues) => {
  // formValues are validated values from react-hook-form
  const { client_CI, phone } = formValues || {};

  const variables = {
    namemember: user.fullName,
    email: user?.email,
    client_CI,
    phone,
    nameplan: pack.nameplan,
    timedays: pack.timedays,
    cost: pack.cost,
    code: pack.code,
    status: 'true',
    image: imageUser,
  };

  try {
    const response = await addMember({ variables });
    const createdId = response?.data?.addMember?.id;
    if (createdId) {
      notifySuccess('Member created');
      router.push(redirect || '/');
    } else {
      notifyError('Member creation failed');
    }
  } catch (err) {
    console.error('Error creating Member:', err);
    notifyError('Error creating Member');
  }
};


  
// on submit
  const handleSubmit01 = async (formValues) => {
    // verify then create
    MemberVerifyMutation(formValues);
      
  }  

  /******** Function to veify if a pack exist ***************/
  const MemberVerifyMutation = async (formValues) => {
    const emailToCheck = user?.email;
    try {
      const variables = { email: emailToCheck };
      const response = await verifyMember({ variables });

      const payload = response?.data?.verifyMember ?? response?.data?.verifymember ?? verifyMemberData?.verifyMember ?? verifyMemberData?.verifymember;
      if (payload) {
        notifyError('Member is still active');
        reset();
        return;
      }
      // not found -> create member
      PostMemberMutation(formValues);
    } catch (err) {
      console.error('Error verifying member:', err);
      notifyError('Error verifying member');
    }
  };
         
  
   // end of packVerifyMutation() function
  /**************************************************************************** */

return (

 <>
{/**<!-- Start className Details  Section -->**/}

<div className="container mt-4" style={{height: '40em', marginBottom:'2em'}}>
 <div className="window rounded-3">
  <div className="row" style={{display:'flex', flexDirection:'row', justifyContent:'center', flexWrap:'wrap'}}>
    {/***<!-- Columna para la imagen --> */}
  
   <div className="col-md-5" style={{margin:'2em', maxWidth:'85%', minHeight:'100%'}}>      
     <div style={{ position: 'relative', width: '100%', height: 0, paddingBottom: '75%', margin: '1em' }}>
       <Image
         src={image ? `${BackendURL}${image}` : '/assets/images/pack-fallback.png'}
         alt={nameplan ? nameplan : 'Gym_logo'}
         fill
         style={{ objectFit: 'cover', borderRadius: 8 }}
         sizes="(max-width: 640px) 100vw, 50vw"
       />
     </div>
  </div>

  <div className="col-md-5 rounded-3" style={{marginLeft:'2em'}}>
   <div className="logo text-center">
    <div className="row nav_logo_texts">
     <div className="col-12">
      <span className="nav_logo-name" style={{position: 'relative', top:'15px', color:' #2b69dd;'}}>Gym Control
      </span>                  
     </div>
      <div className="col-12">
        <img src="/assets/logo/logo2.jpg" width="50em" alt="Gym-logo"/>&nbsp;&nbsp;
        <span className="nav_logo-name"  style={{color:' #2b69dd'}}>Sergio Fitness</span>
        <span className="nav_logo-name"  style={{color:' #0b0a4b', fontSize:'1rem', position: 'relative',top:'-5px',left:'5px'}}>App</span>
      </div>
     </div>
    </div>
    <div className="form">
     <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
      <div>
        <h2 className="text-center nav_logo-name" style={{paddingTop:'-1em',color:' #2b69dd'}}>Create Bill 
        </h2>
      </div>
    </div>
    <br/>
   <form onSubmit={handleSubmit(handleSubmit01)}> 

  {/**<!---- Username and Email section -------------------->   **/}                   

   <h4>Username: {user?.fullName}</h4>
   <h4>Email: {user?.email}</h4>
   <h4>Pack Name: {pack?.nameplan}</h4>
   <h4>Time Days: {pack?.timedays}</h4>
   <h4>Price: {pack?.cost}</h4>
    <br/>

  {/***<!----client_CI and phone section ------------------------->**/}
        <div className="mb-3">
          <label htmlFor="client_CI" className="form-label">
            <IoPersonCircleSharp size="24px" /> &nbsp; Client CI:
          </label>
          <input
            {...register('client_CI', { required: `client CI is required!` })}
            name="client_CI"
            id="client_CI"
            type="text"
            placeholder="Client CI"
            className="form-control input"
            autoComplete="off"
            style={{ maxHeight: 30, minWidth: '70%' }}
          />
          <ErrorMsg msg={errors.client_CI?.message} />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            <FiPhoneCall size="24px" /> &nbsp; Phone #:
          </label>
          <input
            {...register('phone', { required: `Phone is required!` })}
            name="phone"
            id="phone"
            type="text"
            placeholder="Phone"
            className="form-control input"
            autoComplete="off"
            style={{ maxHeight: 30, minWidth: '70%' }}
          />
          <ErrorMsg msg={errors.phone?.message} />
        </div>

      {/* Pack / Member Image Section */}
      <div className="mb-3">
        <label className="control-label" style={{ color: 'aliceblue', fontWeight: 'bold' }}>
          Member Picture:
        </label>
        <div style={{ margin: '1em', width: 128, height: 160, position: 'relative', borderRadius: 6, overflow: 'hidden' }}>
          <Image
            fill
            style={{ objectFit: 'cover' }}
            src={imageUser ? BackendURL + imageUser : '/assets/images/user-fallback.png'}
            alt="Member"
          />
        </div>
      </div>

      <div className="text-center">
        <button type="submit" className="btn btn-primary w-100 mt-3 btnLogin" id="btnLogin">
          Create Member
        </button>
        </div>
        <br />
        <br />
        <br />
      </form>
      
    </div>
   </div>
  
  </div> {/** End of className="row" */}

 </div> {/*** end of "window rounded-3" */}
</div>
  <br/>
  <br/>
  <br/>

  </>
        )



}

export default SaleDetailsArea;