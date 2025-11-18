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
import { useMutation } from '@apollo/client';
import { ADD_MEMBER_CLASS, VERIFY_MEMBER_CLASS } from '../../../mutations/membermutation';


// schema
const schema = Yup.object().shape({
  client_CI: Yup.string().required().label("client_CI"),
  phone: Yup.string().required().label("phone"),
});


const SaleDetailsClassArea = ({classe}) => {

    // get user from store
    const { user } = useSelector((state) => state.auth);
    const BackendURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const { id, image, classname, field } = classe || {};  

    // react hook form
  const {register,handleSubmit,formState: { errors },reset} = useForm({
    resolver: yupResolver(schema),
  });

  // register member service to backend with redux-toolkit RTQ-query , to fecth data from backend
    //const [registerMember, {}] = useRegisterMemberMutation();
    const router = useRouter();
    const { redirect } = router.query;

 // to handle member Data to backend
   // namemember and email are derived from the logged-in user so we don't
   // need to keep them in local state — use `user` directly.
   const [imageUser, setImageUser] = useState(user?.imageFBE);
     

  // create mutation function, pass variables when calling addUser
     const [verifyMemberClass, { data: verifyMemberData }] = useMutation(VERIFY_MEMBER_CLASS);
     const [addMemberClass, { data }] = useMutation(ADD_MEMBER_CLASS);

 
/*********************************function to save user *******/
const PostMemberMutation = async (formValues) => {

  // build variables from validated formValues and logged-in user
  const namemember = user?.fullName;
  const email = user?.email;
  const client_CI = formValues.client_CI;
  const phone = formValues.phone;
  const classname = classe.classname;
  const timedays = classe.session_time;
  const cost = classe.price;
  const code = classe.code;
  const status = 'true';

  try {
    const variables = {
      namemember,
      email,
      client_CI,
      phone,
      classname,
      cost,
      timedays,
      code,
      status,
      image: imageUser,
    };

    const response = await addMemberClass({ variables });
    const createdId = response?.data?.addMemberClass?.id;
    if (createdId) {
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
    // start verify -> create flow with validated form values
    MemberVerifyMutation(formValues);
  }  

  /******** Function to veify if a classe exist ***************/
  const MemberVerifyMutation = async (formValues) => {
    const email = user?.email;
    const code = classe?.code;

    try {
      const variables = { email, code };
      const response = await verifyMemberClass({ variables });

      // GraphQL responses may use different casing; try common keys
      const payload = response?.data?.verifyMemberClass ?? verifyMemberData?.verifyMemberClass;
      if (payload && payload.code == code) {
        // classe exists
        notifyError('Member is subscribed to this class ... !');
        reset();
        return;
      }
      // not found -> create member using validated form values
      PostMemberMutation(formValues);
    } catch (err) {
      console.error('Error verifying classe:', err);
      notifyError('Error verifying classe');
    }
  };
         
  
   // end of classeVerifyMutation() function
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
         alt={classname ?? 'Gym_logo'}
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
        <h2 className="text-center nav_logo-name" style={{paddingTop:'-1em',color:' #2b69dd'}}>Create Class Bill 
        </h2>
      </div>
    </div>
    <br/>
   <form onSubmit={handleSubmit(handleSubmit01)}> 

  {/**<!---- Username and Email section -------------------->   **/}                   

   <h4>Username: {user?.fullName}</h4>
   <h4>Email: {user?.email}</h4>
   <h4>classe Name: {classe?.classname}</h4>
   <h4>Time Days: {classe?.session_time}</h4>
   <h4>Price: {classe?.price}</h4>
    <br/>

  {/***<!----client_CI section ------------------------->**/}                       
        <div className="mb-3">
          <label for="name" className="form-label">
            
            <IoPersonCircleSharp  size="32px"/> &nbsp; 
            Client CI:
          </label>
           <input {...register("client_CI", { required: `client CI is required!` })} 
             name="client_CI" 
             id="client_CI" 
             type="text" 
             placeholder="Client CI" 
             className="form-control input" 
             autocomplete="off"
             style={{maxHeight:30, minWidth:'70%'}}/>
          <ErrorMsg msg={errors.client_CI?.message} />        
       </div>
  

 {/*<!----Phone section ------------------------->*/}                       
<div className="mb-3">
    <label for="phone" className="form-label">
      <FiPhoneCall size="32px"/> &nbsp;  
      Phone #:
    </label>
     <input {...register("phone", { required: `client CI is required!` })} 
             name="phone" 
             id="phone" 
             type="text" 
             placeholder="Phone" 
             className="form-control input" 
             autocomplete="off"
             style={{maxHeight:30, minWidth:'70%'}} />
          <ErrorMsg msg={errors.phone?.message} />   
   </div>
{/*<!------ classe Image Section ------------------------->*/}
        
<div className="mb-3">
 <label for="image" className="control-label" style={{color:'aliceblue', fontWeight:'bold'}}>Member Picture:
 </label>
       
    <div className="file-custom"  >
        {/*<!-- ensures that the image is only displayed when a file has been selected and the preview is ready.-->*/}
       <div style={{ margin: '1em', width: 128, height: 160, position: 'relative', borderRadius: 6, overflow: 'hidden' }}>
         <Image
           src={user?.imageFBE ? `${BackendURL}${user.imageFBE}` : '/assets/img/logo/logo2.jpg'}
           alt={user?.fullName ?? 'User'}
           fill
           style={{ objectFit: 'cover' }}
           sizes="128px"
         />
       </div>
    </div>
</div>                        
{/*<!------ End Of classe Image SEction ------------------>*/}
 <div className="text-center">
   <button type="submit" className="btn btn-primary w-100 mt-3 btnLogin" id="btnLogin">
     Create Member
   </button>
 </div>
  <br/>
  <br/>
  <br/>
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

export default SaleDetailsClassArea;