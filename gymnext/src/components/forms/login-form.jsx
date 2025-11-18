'use client'
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from 'next/router';
// internal
import { CloseEye, OpenEye } from '@/svg';
import ErrorMsg from '../common/error-msg';
import { notifyError, notifySuccess } from '@/utils/toast';
import Image from "next/image";
/***Icons for form */
import { IoMdMail } from "react-icons/io";
import { MdOutlineKey } from "react-icons/md";
import { LOGIN_USER } from './authmutations';
import { GET_USERS } from './authqueries';
import { useMutation } from '@apollo/client';
// libs to update the store
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { userLoggedIn } from "../../redux/features/auth/authSlice";


// schema
const schema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(5).label("Password"),
});
const LoginForm = () => {

  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState(false);
  const [password, setPassword] = useState(false);

  // post mutation graphQL
  const [loginUser,{ data }] = useMutation(LOGIN_USER, {
        variables: { email, password }, refetchQueries: [{ query: GET_USERS }]
        });
  /** libs to handle routes */
  const router = useRouter();
  const { redirect } = router.query;
  
  // react hook form
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });
  // onSubmit
 
const onSubmit = async(Data) => {
  //alert("Im in login-form component - line 44 - email:  " + Data.email );
  //alert("Im in login-form component - line 45 - password:  " + Data.password);
  setEmail(Data.email);
  setPassword(Data.password);
     try{
            const { data } = await loginUser(email, password);

            if(data){

            //alert('Im at login component - line 59 - token: ' + data.loginUser.token );
            //alert('Im at login component - line 60 - isAdmin: ' + data.loginUser.user.isAdmin);
            const accessToken = data.loginUser.token;
            //alert('Im at login component - line 67 - token: ' + accessToken );
            const isAdmin = data.loginUser.user.isAdmin;
            //alert('Im at login component - line 69 - isAdmin: ' + isAdmin)

             if(accessToken){
                //localStorage.setItem("token", accessToken);
                // add data to local storage cookies
                Cookies.set(
                            "userInfo",
                            JSON.stringify({
                              // query: (data) => ({ data, from backend data.token
                              accessToken: accessToken,
                              user: data.loginUser.user,
                            }),
                            { expires: 0.5 }
                          );
                dispatch(
                            userLoggedIn({
                              accessToken: accessToken, // taking this inf from backend
                              user: data.loginUser.user, // taking this inf from backend
                            })
                          );          
                /** if isAdmin = true go to AdminDashboard */
                 if (isAdmin=='true') {
                         notifySuccess("Login successfully, Admin");
                          //alert("Im in login-form component - line 82 - role=='Admin':  "+ isAdmin );
                          router.push(redirect || "/AdminDashboard");
                         //router.push("/AdminDashboard");
                       }
                 /** if isAdmin = false go to / */      
                 if (isAdmin=='false') {
                    notifySuccess("Login successfully, User");
                      //alert("Im in login-form component - line 89 - role=='user':  "+ isAdmin );
                           router.push(redirect || "/");
                           //router.push("/"); 
                         }                    
            }else{ alert('Something got wrong ....');}
            }
        }catch(error){ console.log(error)};
            
         
           };
  return (

<div class="container">
 <div class="window rounded-3">
  <div class="row windowsSSheight">
  {/***-- Columna para la imagen --*/}
    <div class="col-md-5 d-flex justify-content-center align-items-center" style={{margin: '1em' }}>
     <Image class="img-fluid rounded-3" src="/assets/images/work-1.png" alt="Gym_logo" width={1000} height={1500}/>
    </div>
     
     <div class="col-md-6 rounded-3" style={{marginLeft:'2em'}}>
      <div class="logo text-center">
       <div class="row nav_logo_texts">
        <div class="col-12" style={{marginTop: '2em',marginBottom:'2em'}}>
         <span class="nav_logo-name" style={{color:'#2b69dd'}}>Gym Control</span>
        </div>
        <div class="col-12">
         <Image src="/assets/img/logo/logo2.jpg" width={60} height={60} alt="Gym-logo"/>&nbsp;&nbsp;
         
          <span class="nav_logo-name"  style={{color:' #2b69dd'}}>
            Sergio Fitness
          </span>
          <span class="nav_logo-name"  style={{color:' #0b0a4b', fontSize:'1rem', position: 'relative', top:'-5px', left:'5px'}}>
            App
          </span>
         <div>
          <h2 class="text-center nav_logo-name" style={{paddingTop:'0.5em', color:' #2b69dd'}}>LogIn 
          </h2>
        </div>
      </div>
    </div>
  </div>         
    <div class="formLoginNo" style={{height: '20em', marginBottom: '2em'}}>
     <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
      <br/>
       <div class="col-lg-6"> 
        
         <form onSubmit={handleSubmit(onSubmit)}>
         
         {/*** Email section */}   
         <div class="mb-3">
          <label for="username" class="form-label">
            <IoMdMail size="32px"/> &nbsp;
             Email:
          </label>
              <input {...register("email", { required: `Email is required!` })} name="email" id="email" type="email" placeholder="Gym@mail.com" class="form-control input" autocomplete="off" />
              <ErrorMsg msg={errors.email?.message} />
          </div> {/*** End of Email section */}

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
            style={{border:'none', width:'90%'}}/>
              <span className="open-eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? <CloseEye /> : <OpenEye />}
              </span>
             </div> 
          <ErrorMsg msg={errors.password?.message}/>
        </div>

         <div class="text-center">
          <button type="submit" class="btn btn-primary w-100 mt-3 btnLogin" id="btnLogin" >Login</button>
        </div>
        <br/>
        <br/>
        <br/>
        </form>
        
        </div> 
       </div>
      </div>
    </div> 


   </div>
  </div>
  </div>
  )
}

export default LoginForm;