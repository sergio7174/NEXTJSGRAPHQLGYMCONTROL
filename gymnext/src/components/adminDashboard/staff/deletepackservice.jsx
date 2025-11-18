// to get your Apollo Client instance
import { useMutation } from '@apollo/client';
import { DELETE_PACK, DELETE_PACK_IMAGE } from '../../../mutations/packmutation';

/*imported anywhere.
 * @param {{ id?: string, _id?: string, image?: string }} pack
 * @returns {Promise<object|null>} deleted pack payload or null on failure*/
 //const [deletePackMutation, { data: deletePackData }] = useMutation(DELETE_PACK);
 // const [deletePackImage, { data: deletePackImageData }] = useMutation(DELETE_PACK_IMAGE);

function DeletePackService (pack)  {

  const [deletePackImage, { data: deletePackImageData }] = useMutation(DELETE_PACK_IMAGE);
  // deletePack, deletePackImage mutations functions, pass variables when calling the functions
      

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
     
  }; // end of delete pack func block

 /******** Function to delete a pack image on the server ***************/
 const PackDeleteImageMutation = async (imageToDelete) => {

   alert('Im at DeletePackService - PackDeleteImageMutation - line 56 - imageToDelete: '+imageToDelete);
   try {
     const variables = { image: imageToDelete };
     const response = await deletePackImage({ variables });

    /* const response = await mutate({
      mutation: DELETE_PACK_IMAGE, // Import from graphql/mutations.js
      variables: { variables },
    });*/
                    
     // The DELETE_PACK_IMAGE mutation returns the deleted pack (id) under `deletePack`.
     const payload = response?.data?.deletePackImage ?? deletePackImageData?.deletePackImage;

    alert('Im at DeletePackService - PackDeleteImageMutation - line 64 - payload: '+ payload)

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
 
export default DeletePackService;