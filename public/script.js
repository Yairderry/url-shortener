const shortenButton = document.querySelector("#short_button");
const currentOrigin = document.querySelector("#custom_url span");

currentOrigin.textContent = `${window.location.origin}/api/shorturl/`;

shortenButton.addEventListener("click", postNewUrl);

function postNewUrl(e) {
  const urlInput = document.querySelector("#url_input");
  const customUrlInput = document.querySelector("#custom_url_input");

  const data = { url: urlInput.value, customUrl: customUrlInput.value };

  urlInput.value = "";
  customUrlInput.value = "";

  axios
    .post(`${window.location.origin}/api/shorturl/new`, data)
    .then((res) => addUrlsToHTML(res.data))
    .catch((err) => console.log(err));
}

function addUrlsToHTML(data) {
  const originalUrl = document.querySelector(".original_url");
  const shortUrl = document.querySelector(".short_url");
  const copyButton = document.querySelector(".copy_button");
  const originalAndShortUrls = document.querySelector(
    ".original_and_short_urls"
  );

  originalUrl.value = data.original_url;
  shortUrl.value = `${window.location.origin}/api/shorturl/${data.short_url}`;
  originalAndShortUrls.classList.remove("hidden");

  copyButton.addEventListener("click", copyToClipboard);
}

function copyToClipboard(e) {
  const copyText = document.querySelector(".short_url");

  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
}
