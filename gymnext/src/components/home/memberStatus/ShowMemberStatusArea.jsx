import { useDispatch, useSelector } from "react-redux";
/*** service to get member data *****/
import { useGetMemberQuery } from "@/redux/features/apis/memberApi";
import { useGetPackByCodeQuery } from "@/redux/features/apis/packApi";
import ErrorMsg from "@/components/common/error-msg";
import { useRouter } from "next/router";
import Image from "next/image";
/*** import graphQL apollo libs */
import { useQuery } from '@apollo/client';
import { GET_MEMBER, GET_MEMBER_CLASSSES } from '../../../queries/memberqueries';
import { GET_PACK_MEMBER } from '../../../queries/packqueries';
import  ShowMemberClasses  from './showmemberclasses';


  const ShowMemberStatusArea = () => {

  // to handle member Data to backend
 
  const BackendURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const { redirect } = router.query;
    // you can get the user from the store , because in login.form, you set it, using the useLoginUserMutation(),
  const { user } = useSelector((state) => state.auth);
  const email = user?.email;
  const UserName = user?.fullName;
  

// function to get member data from backend (Apollo)
// GET_MEMBER requires an email variable; skip until we have the user's email
const { loading, error, data } = useQuery(GET_MEMBER, { variables: { email }, skip: !email });
// GET CLASSES FOR MEMBER
const { data : DataMemeberClasses } = useQuery(GET_MEMBER_CLASSSES, { variables: { email }, skip: !email });


const isLoading = loading;
const isError = error;
// pack code to get Pack image from backend (extracted from returned member)
const codePack = data?.member?.code;
//alert("Im in showMemberStatusArea line 34 - codePack: "+codePack);

//if ( codePack ) { setMemberFound(1); }
//alert("Im in showMemberStatusArea line 33 - memberFound: " + memberFound);


// function to get pack data from backend

//const {data:pack } = useGetPackByCodeQuery(codePack);
// GET_PACK_MEMBER requires a `code` variable; skip until we have the pack code
const { data: getpackdata } = useQuery(GET_PACK_MEMBER, { variables: { code: codePack }, skip: !codePack });
                       

  // calc daysleft section
  // vars to handle daysleft
const currentDate = new Date();
const today = (currentDate).getTime();  

  //const Finish_day= new Date(member?.data[0]?.finishAt).getTime();
  const Finish_day= new Date(data?.member?.finishAt).getTime();
  //alert("Im in showMemberStatusArea line 48 - member?.data?.finishAt: " + member?.data?.finishAt);
  const minisecondsLeft= [(Finish_day - today)];
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = minisecondsLeft/millisecondsPerDay
  const daysLeft_mathFloor = Math.floor(daysLeft);

 
  const isPositive = daysLeft_mathFloor > 0;
  const colorClass = isPositive ? 'text-success' : 'text-danger';

  //const memberStatus = member?.data[0]?.status;
  const memberStatus = data?.member?.status;

 //alert('Im at topbar - line 11 - email: '+user?.email);
 //alert('Im at topbar - line 12 - user?.fullName: '+user?.fullName);
//alert('Im at topbar - line 35 - UserName: '+UserName);
//alert('Im in showMemberStatusArea line 54 - email: '+user?.email)

// If user is not admin and is not logged, go login
 if (user?.isAdmin != 'true' && !user?.fullName) {
    router.push(redirect || "/login");
  }


  const tableclasses = {

   


  }
 // decide what to render
  let content = null;

  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && !data?.member) {
    content = <ErrorMsg msg="No Member found!" />;
  }
  //if (member?.data?.length > 0) {
  if (codePack) {
  return (
     <>
     
     {/**<!-- Start className Details  Section -->**/}
     
     <div className="container mt-4" style={{height: '80em', marginBottom:'2em'}}>
      <div className="window rounded-3">
       <div className="row" style={{display:'flex', flexDirection:'row', justifyContent:'center', flexWrap:'wrap'}}>
         {/***<!-- Columna para la imagen --> */}
       
        <div className="col-md-5" style={{margin:'2em', maxWidth:'85%', minHeight:'100%'}}>            
          <div style={{ position: 'relative', width: '100%', height: 0, paddingBottom: '75%', margin: '1em' }}>
            <Image
              src={getpackdata?.packMember?.image ? `${BackendURL}${getpackdata.packMember.image}` : '/assets/images/pack-fallback.png'}
              alt={getpackdata?.packMember?.nameplan ?? 'Pack image'}
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
             <img src="/assets/img/logo/logo2.jpg" width="50em" alt="Gym-logo"/>&nbsp;&nbsp;
             <span className="nav_logo-name"  style={{color:' #2b69dd'}}>Sergio Fitness</span>
             <span className="nav_logo-name"  style={{color:' #0b0a4b', fontSize:'1rem', position: 'relative',top:'-5px',left:'5px'}}>App</span>
           </div>
          </div>
         </div>
         <div className="form">
          <div style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
           <div>
             <h2 className="text-center nav_logo-name" style={{paddingTop:'-1em',color:' #2b69dd'}}>User Status 
             </h2>
           </div>
         </div>
         <br/>
        
     
       {/**<!---- Username and Email section -------------------->   **/}                   
     
        <h4>Username: {user?.fullName}</h4>
        <h4>Email: {user?.email}</h4>
        <h4>Pack Name: {data?.member?.nameplan}</h4>
        <h4>Time Days: {data?.member?.timedays}</h4>
        <h4>Price: {data?.member?.cost} $</h4>
        <h4 >Days Left:<em className={`p-2 ${colorClass}`}>{daysLeft_mathFloor}</em></h4>
        <h5 >Status: <em className={`p-2 ${colorClass}`}> {memberStatus}</em></h5>

         <br/>
     
     <div className="mb-3">
      <label for="image" className="control-label" style={{color:'aliceblue', fontWeight:'bold'}}>Member Picture:
      </label>
            
         <div className="file-custom"  >
             {/*<!-- ensures that the image is only displayed when a file has been selected and the preview is ready.-->*/}
           <div style={{ margin: '1em', width: 128, height: 160, position: 'relative', borderRadius: 6, overflow: 'hidden' }}>
             <Image
               src={data?.member?.imageUser ? `${BackendURL}${data.member.imageUser}` : '/assets/images/user-fallback.png'}
               alt={data?.member?.namemember ?? 'User'}
               fill
               style={{ objectFit: 'cover' }}
             />
           </div>
         </div>
     
     </div>                        
     {/*<!------ End Of Pack Image SEction ------------------>*/}
     
       <br/>
       <br/>
       <br/>
       
         </div>
        </div>
        {/** begin of the member classes section */}
          <div>
            <div style={{ marginBottom:'3em', textAlign:'center'}}>{/**** header member classes section */}
               <span className="nav_logo-name" style={{ textAlign: 'center', color:' #2b69dd;'}}>Member Classes Section
           </span>    
            </div>
            <div className="table-responsive" style={{overflowY:'scroll',
                           maxHeight:'64vh', overflowX:'scroll', marginBottom:'5em'}}>
        <table className="table table-responsive" style={{borderRadius:10}}>
          <thead className="table-dark" style={{position:'sticky', top:0}}>
            <tr>
              <th scope="col" className="text-center" >#</th>
              <th scope="col" className="text-center">Client CI</th>
              <th scope="col" className="text-center">Image</th>
              <th scope="col" className="text-center">Class Name</th>
              <th scope="col" className="text-center">Time Days</th>
              <th scope="col" className="text-center ">Cost</th>
              <th scope="col" className="text-center ">Code</th>
              <th scope="col" className="text-center ">Status</th>
              <th scope="col" className="text-center ">Days Left</th>
              
            </tr>
          </thead>
          <tbody>

           {DataMemeberClasses?.memberclasses?.map((member, index) => <ShowMemberClasses key={member.id} member={member} index = {index} />)}
          </tbody>
        </table>
        </div> 
          
         <br/>
         <br/>
         <br/>
       </div> {/** End of className="row" */}     
      </div> {/*** end of "window rounded-3" */}
     </div>
       <br/>
       <br/>
       <br/>
     </div>  
     
     </>


  )}

}


export default ShowMemberStatusArea;