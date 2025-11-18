import { useSearchParams } from 'next/navigation';
// internal
import SEO from '@/components/seo/seo';
import MainMenu from '../../../../components/layout/headers/mainmenu';
import Footer from '@/components/layout/footers/footer.component';
import TopBar from '../../../../components/layout/headers/topBar';
import ErrorMsg from '@/components/common/error-msg';
import CommonBreadcrumb from '../../../../components/breadcrumb/common-breadcrumb';
import SaleDetailsClassArea from '@/components/home/sales/sale-details-Class-area';
import Loader from '@/components/loader/loader';
import {  useSelector } from "react-redux";
import { useRouter } from "next/router";
/*** import graphQL apollo libs */
import { useQuery } from '@apollo/client';
import { GET_CLASSE } from "../../../../queries/classesqueries";


const SaleDetailsClassPage = ( ) => {

  // get user from store
    const { user } = useSelector((state) => state.auth);
    const router = useRouter();
    const { redirect } = router.query;

  // to get the name parameter from url
  const searchParams = useSearchParams();
  const ClassId = searchParams.get('id');

  // function to get class data from backend
  const { loading, error, data } = useQuery(GET_CLASSE, { variables: { id: ClassId }, skip: !ClassId });

  // decide what to render
  let content = null;

  if (loading) {
    content = <Loader loading={true} />;
  }

  if (!loading && error) {
    content = <ErrorMsg msg="There was an error loading the class." />;
  }
  // If user is not admin and is not logged, go login
 if (user?.isAdmin != 'true' && !user?.fullName) {
    router.push(redirect || "/login")}

  if (user?.fullName) {
    if (!loading && !error && data?.classe) {
      content = (
        <>
          <CommonBreadcrumb title="Sales Class Details" subtitle="Class Bill" center={true} />
          <SaleDetailsClassArea classe={data.classe} />
        </>
      );
    }
  return (
    <>
    <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
      <div>
         <SEO pageTitle="Pack Sale Details" />
      </div>
      <div>
         <TopBar/>
        <MainMenu />
      </div>
      <div style={{marginBottom:'14em'}}>
        {content}
      </div>  
      <div>
        <Footer primary_style={true} />
      </div>
    </div>  
    </>
  );
}};

export default SaleDetailsClassPage;

