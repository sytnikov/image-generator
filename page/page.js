chrome.storage.local.get(["numberOfImages"], (res) => {
  const imageCount = res.numberOfImages;
});

const imageCount = 4; // how many images we want
let selectImageNumber = null;

// to generate random number between min and max
function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function disableGenerateButton() {
  document.getElementById("generate").disable = true;
}

function enableGenerateButton() {
  document.getElementById("generate").disable = false;
}

function clearImageGrid() {
  // to clear the images after each generate button click...
  const imageGrid = document.getElementById("image-grid");
  imageGrid.innerHTML = "";
}

// generate images
async function generateImages(input) {
  disableGenerateButton();
  clearImageGrid();

  const loading = document.getElementById("loading");
  loading.style.display = "block";

  const imageUrls = []; // array to store all the image links
  for (let i = 0; i < imageCount; i++) {
    const randomNum = getRandomNum(1, 1000);

    const prompt = `${input} ${randomNum}`;

    try {
      // Call the server's endpoint
      const response = await fetch(
        "https://image-generator-proxy-server.vercel.app/generate-images",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }), // Send the prompt to the server
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the response as a blob
      const result = await response.blob();

      // Create an object URL for the image blob
      const imageUrl = URL.createObjectURL(result);
      imageUrls.push(imageUrl);

      // Creating image elements
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = `art-${i + 1}`;
      img.onclick = () => downloadImage(imageUrl, i);
      document.getElementById("image-grid").appendChild(img);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Unable to generate images...");
    }
  }

  loading.style.display = "none";
  enableGenerateButton();

  selectImageNumber = null;
}

function downloadImage(imageUrl, imageNumbers) {
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = `image-${imageNumbers + 1}.png`;
  link.click();
}

// event listener for generate button
document.getElementById("generate").addEventListener("click", () => {
  const input = document.getElementById("user-prompt").value;
  generateImages(input);
});
