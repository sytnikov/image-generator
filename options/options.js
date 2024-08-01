const numberOfImagesInput = document.getElementById("number-of-images");
numberOfImagesInput.addEventListener("change", (event) => {
  const val = event.target.value;
  if (val < 1 || val > 4) {
    numberOfImagesInput.value = 4;
    alert("Number of images should not be less than 1 or more than 4");
  }
});

const saveBtn = document.getElementById("save-btn");
saveBtn.addEventListener("click", () => {
  const numberOfImages = numberOfImagesInput.value;
  chrome.storage.local.set({
    numberOfImages,
  });
});

// default value of number of images
chrome.storage.local.get(["numberOfImages"], (res) => {
  numberOfImagesInput.value = res.numberOfImages ? res.numberOfImages : 4;
});
