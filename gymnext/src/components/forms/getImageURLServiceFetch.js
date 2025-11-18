

export async function GetUserImageService (setImage, selectedFile)  {

  alert('I am at getImageUrlService - line 02 : ');
  alert('I am at getImageUrlService - line 03 - selectedFile: ' + selectedFile);
    
  // send the image file to backend
  const formData = new FormData();
    formData.append('Dataimage', selectedFile);
    
async function postImage() {

  const res = await fetch('http://localhost:5000/upload-image', {
        method: 'POST',
        body: formData,
      });
  // The return value is *not* serialized.
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    alert('Failed to fetch data');
  }
  
  return res.json();
}

const ImageUser = await (postImage());
setImage(ImageUser.image);
 
}
