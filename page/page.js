const imageCount = 2 // how many images we want
let currentImageUrl = ''
// to generate random number between min and max
function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function disableGenerateButton() {
  const generateBtn = document.getElementById('generate')
  generateBtn.disabled = true
}

function enableGenerateButton() {
  const generateBtn = document.getElementById('generate')
  generateBtn.disabled = false
}

function clearImageGrid() {
  // to clear the images after each generate button click...
  const imageGrid = document.getElementById('image-grid')
  imageGrid.innerHTML = ''
  const enlargedImageContainer = document.getElementById(
    'enlarged-image-container'
  )
  enlargedImageContainer.style.display = 'none'
}

// generate images - openjourney-v4 model
// async function generateImages(input) {
//   disableGenerateButton();
//   clearImageGrid();

//   const loading = document.getElementById("loading");
//   loading.style.display = "block";

//   const imageUrls = []; // array to store all the image links
//   for (let i = 0; i < imageCount; i++) {
//     const randomNum = getRandomNum(1, 1000);

//     const prompt = `${input} ${randomNum}`;

//     try {
//       // Call the server's endpoint
//       const response = await fetch(
//         "https://image-generator-proxy-server.vercel.app/generate-images",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ prompt }), // Send the prompt to the server
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // Get the response as a blob
//       const result = await response.blob();

//       // Create an object URL for the image blob
//       const imageUrl = URL.createObjectURL(result);
//       imageUrls.push(imageUrl);

//       // Creating image elements
//       const img = document.createElement("img");
//       img.src = imageUrl;
//       img.alt = `art-${i + 1}`;
//       img.addEventListener("click", () => showEnlargedImage(imageUrl, i));
//       document.getElementById("image-grid").appendChild(img);
//     } catch (error) {
//       console.error("Error generating image:", error);
//       alert("Unable to generate an image...");
//     }
//   }

//   loading.style.display = "none";
//   enableGenerateButton();
// }

// generate images - stability model
async function generateImages(input) {
  disableGenerateButton()
  clearImageGrid()

  const loading = document.getElementById('loading')
  loading.style.display = 'block'

  const imageUrls = [] // array to store all the image links
  for (let i = 0; i < imageCount; i++) {
    const randomNum = getRandomNum(1, 1000)

    const prompt = `${input} ${randomNum}`

    try {
      // Call the server's endpoint
      const response = await fetch(
        'https://image-generator-proxy-server.vercel.app/stability-model',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }), // Send the prompt to the server
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const result = await response.json()
      const base64String = result[0].base64
      const imageUrl = `data:image/png;base64,${base64String}`
      imageUrls.push(imageUrl)

      // Creating image elements
      const img = document.createElement('img')
      img.src = imageUrl
      img.alt = `art-${i + 1}`
      img.addEventListener('click', () => showEnlargedImage(imageUrl, i))
      document.getElementById('image-grid').appendChild(img)
    } catch (error) {
      console.error('Error generating image:', error)
      alert('Unable to generate an image...')
    }
  }

  loading.style.display = 'none'
  enableGenerateButton()
}

function showEnlargedImage(imageUrl, imageNumber) {
  const enlargedImageContainer = document.getElementById(
    'enlarged-image-container'
  )
  const enlargedImage = document.getElementById('enlarged-image')
  enlargedImage.src = imageUrl
  enlargedImageContainer.style.display = 'block'
  currentImageUrl = imageUrl
}

function downloadImage() {
  if (currentImageUrl) {
    // Check if there is a current image URL
    const link = document.createElement('a')
    link.href = currentImageUrl
    link.download = `image-${new Date().getTime()}.png` // Use a timestamp to avoid naming conflicts
    link.click()
  } else {
    alert('No image to download')
  }
}

// Event listener for the download button
const downloadBtn = document.getElementById('download-btn')
downloadBtn.addEventListener('click', () => downloadImage())

// event listener for generate button
const generateBtn = document.getElementById('generate')
generateBtn.addEventListener('click', () => {
  const input = document.getElementById('user-prompt').value
  generateImages(input)
})
