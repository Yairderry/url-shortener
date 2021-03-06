const shortenButton = document.querySelector("#short_button");
const searchButton = document.querySelector(".search_button");
const searchAllButton = document.querySelector(".search_all_button");
const currentOrigin = document.querySelector("#custom_url span");
const navbar = document.querySelector("#navbar");

currentOrigin.textContent = `${window.location.origin}/api/shorturl/`;

shortenButton.addEventListener("click", postNewUrl);
navbar.addEventListener("click", switchTabs);
searchAllButton.addEventListener("click", addAllStatistics);
searchButton.addEventListener("click", addStatistics);

// Printing elements to HTML
function createTableRow(rowData) {
  const table = document.querySelector("tbody");

  const row = document.createElement("tr");

  const originalUrl = document.createElement("td");
  originalUrl.textContent = rowData.originalUrl;

  const creationDate = document.createElement("td");
  creationDate.textContent = rowData.creationDate;

  const shortUrlId = document.createElement("td");
  shortUrlId.textContent = rowData.shortUrlId;

  const redirectCount = document.createElement("td");
  redirectCount.textContent = rowData.redirectCount;

  row.append(originalUrl, creationDate, shortUrlId, redirectCount);

  table.append(row);
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
  const tabs = document.querySelectorAll("li");

  if (tab.id === "statistic") {
    containers[0].className = "container hidden";
    containers[1].className = "container wide";

    tabs[0].className = "";
    tabs[1].className = "active";
  }

  if (tab.id === "shorten") {
    containers[0].className = "container";
    containers[1].className = "container hidden";

    tabs[0].className = "active";
    tabs[1].className = "";
  }
}

function addStatistics(event) {
  const table = document.querySelector("tbody");

  table.innerHTML = "";

  const searchInput = document.querySelector(".search_container input");
  const shortUrlId = searchInput.value;

  axios
    .get(`${window.location.origin}/api/statistic/${shortUrlId}`)
    .then((statistic) => createTableRow(statistic.data))
    .catch((err) => {
      alert(`${err.response.data.error}`);
    });

  searchInput.value = "";
}

function addAllStatistics(event) {
  const table = document.querySelector("tbody");

  table.innerHTML = "";

  axios
    .get(`${window.location.origin}/api/statistic`)
    .then((statistics) => {
      statistics.data.forEach((statistic) => createTableRow(statistic));
    })
    .catch((err) => {
      alert(`${err.response.data.error}`);
    });
}
