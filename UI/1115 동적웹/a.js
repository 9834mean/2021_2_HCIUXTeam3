const img= document.querySelector(".imgg");
document.body.onload = addElement;

function create_image(){
  let image = document.createElement('image');
 
  image.setAttribute('class', 'pTag');
  var imagee = document.createTextNode("생길 이미지");
  image.appendChild(imagee);
 

}
function create_title(){
    let title = document.createElement('title');
   
    title.setAttribute('class', 'pTag');
    var titlee = document.createTextNode("생길 이미지");
    image.appendChild(titlee);
}

