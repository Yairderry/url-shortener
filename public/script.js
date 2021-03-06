const shortenButton = document.querySelector("#short_button");
const searchButton = document.querySelector("#search_button");
const searchAllButton = document.querySelector("#sreach_all_button");
const currentOrigin = document.querySelector("#custom_url span");
const navbar = document.querySelector("#navbar");

currentOrigin.textContent = `${window.location.origin}/api/shorturl/`;

shortenButton.addEventListener("click", postNewUrl);
navbar.addEventListener("click", switchTabs);

// Printing elements to HTML
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

// event handlers
function copyToClipboard(event) {
  const copyText = document.querySelector(".short_url");

  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
}

function postNewUrl(event) {
  const urlInput = document.querySelector("#url_input");
  const customUrlInput = document.querySelector("#custom_url_input");

  const data = { url: urlInput.value, customUrl: customUrlInput.value };

  urlInput.value = "";
  customUrlInput.value = "";

  axios
    .post(`${window.location.origin}/api/shorturl/new`, data)
    .then((res) => addUrlsToHTML(res.data))
    .catch((err) => alert(`${err.response.data.error}`));
}

function switchTabs(event) {
  const tab = event.target;
  if (!tab.tagName === "li") return;

  const containers = document.querySelectorAll(".container");

  if (tab.id === "statistic") {
    containers[0].className = "container hidden";
    containers[1].className = "container wide";
  }

  if (tab.id === "shorten") {
    containers[0].className = "container";
    containers[1].className = "container hidden";
  }
}
