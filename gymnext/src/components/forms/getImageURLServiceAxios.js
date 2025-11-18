import axios from 'axios';
import { notifyError} from '@/utils/toast';

export function GetUserImageAxiosService (selectedFile, setImageFBE)  {

  //alert('I am at getImageAxiosUrlService - line 07 : ');
  //alert('I am at getImageAxiosUrlService - line 07 - selectedFile: ' + selectedFile);
    
  // send the image file to backend
  const formData = new FormData();
    formData.append('Dataimage', selectedFile);

   axios.post('http://localhost:5000/upload-image', formData).then(res => {
      // server should return the uploaded image URL/name in res.data.image
      //alert('I am at getImageAxiosUrlService - line 15 - res.data.image  : ' + res.data.image);
      if (res.data && res.data.image) {
        
       
        const imageUrl = res.data.image;
        // store in state for UI and debugging
        setImageFBE(imageUrl);
        return imageUrl;
       
      } else {
        notifyError('Image upload failed, please try again.');
      }
    }).catch(err => {
      console.error('Upload image error:', err);
      notifyError('Image upload error');
    })

  }