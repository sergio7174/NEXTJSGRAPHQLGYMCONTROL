




export async function deleteclassService (pack)  {

    try {
           // show quick debug alerts if needed (remove in production)
           //alert('I am at editdelPackArea - deletePack - line 99 - Pack.id:'+pack.id);
           //alert('I am at editdelPackArea - deletePack - line 100 - Pack.image:'+pack.image);
    
           // delete image on server first
           const imageToDelete = pack.image;
           const imgResult = await ClassDeleteImageMutation(imageToDelete);
           if (!imgResult) {
             // image deletion failed (we'll still attempt to delete the pack record)
             notifyError('Image deletion failed (will still try to delete pack record)');
           }
           alert('I am at editdelPackArea - deletePack - line 125 - Pack.id:'+pack.id);
           // delete the pack record via Apollo mutation
           const variables = { id: pack.id }
           const packResult = await deletePackMutation({variables});
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

         /******** Function to delete a pack image on the server ***************/
          const PackDeleteImageMutation = async (imageToDelete) => {
         
            //alert('Im at PackDeleteImageMutation - line 134 - imageToDelete: '+imageToDelete);
            try {
              const variables = { image: imageToDelete };
              const response = await deletePackImage({ variables });
         
              // The DELETE_PACK_IMAGE mutation returns the deleted pack (id) under `deletePack`.
              const payload = response?.data?.deletePackImage ?? deletePackImageData?.deletePackImage;
         
             //alert('Im at PackDeleteImageMutation - line 142 - payload: '+ payload)
         
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



}