import  { useState }   from "react";
/** to build search component */
import { MDBInputGroup, MDBInput, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';
/*** Notify toast */
import ErrorMsg from "@/components/common/error-msg";
import ClassItem from "./class-item";
/****Search area */
import { useSearchParams } from "next/navigation";
import { PaginationControl } from 'react-bootstrap-pagination-control';
import { IoSearch } from "react-icons/io5";
/*** import graphQL apollo libs */
import { useQuery } from '@apollo/client';
import { GET_CLASSES } from '../../../../queries/classesqueries';

const ShowClassesListArea = () => {

// Handle the case where it's not an array (e.g., set currentClass to an empty array)
  let currentClass = [];  

// const to handle state search function
  const searchParams = useSearchParams();
  const [searchdata, setSearchdata] = useState("");

// function to get all staff data from backend
    const { loading, error, data } = useQuery(GET_CLASSES);
    const isLoading = loading;
    const isError = error;

// vars to handle pagination
    
    const [currentPage, setCurrentPage] = useState(1);
    const [classesPerPage] = useState(8);
    const indexOfLastClass = currentPage * classesPerPage;
    const indexOfFirstClass = indexOfLastClass - classesPerPage;
    currentClass = data?.classes?.slice(indexOfFirstClass, indexOfLastClass);

  // decide what to render
  let content = null;

  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (data?.classes?.length === 0) {
    content = <ErrorMsg msg="No Classes found!" />;
    
  }
  if (data?.classes?.length > 0) {
      
     content = currentClass.filter((klass) => {
      // here it is the function to search the products
      // if it is empty, returns all list
        if (searchdata == null) {
                return {klass}
              // if search data is not empty return product filtered with search data string  
            } else if (klass.code.toLowerCase().includes(searchdata.toLowerCase())) {
                return klass
            }
        }).map((klass,index) => (   
      <div key={index} className="col-xl-3 col-lg-3 col-sm-6">
      
        <ClassItem klass={klass}/>
      </div>
    
    ))}
return (
<section class="classes-pag">
  <div class="container">
 
   
 
     
          {/*****Search area beging */}  

     <MDBInputGroup>
      <MDBInput
         placeholder="Search Item By Name"
         onChange={(e) =>{setSearchdata(e.target.value)}}
         defaultValue={searchParams?.searchTerm?.toString()}
        name="searchTerm"
         />
      <MDBBtn rippleColor='dark'>
        <IoSearch size="20px" />
      </MDBBtn>
    </MDBInputGroup>
  
   
    {/*****SEarch area End */} 

    <div className="row">
       
          {content}
    </div>
        <PaginationControl
            page={currentPage}
            between={8}
            total={data?.classes?.length}
            limit={8}
            changePage={(currentPage) => { setCurrentPage(currentPage)}}
        ellipsis={1}/>


      </div>
 

 </section>

)}



export default ShowClassesListArea;