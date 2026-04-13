const shortenForm = document.getElementById("shorten-form");
const urlInput = document.getElementById("url");
const shortenBtn = document.getElementById("shorten-btn");
const linkResult = document.getElementById("link-result");
const shortUrl = document.getElementById("short-url");
const copyLinkBtn = document.getElementById("copy-link");
const fileInput = document.getElementById("file");
const fileName = document.getElementById("file-name");
const uploadBtn = document.getElementById("upload");
const imagePreview = document.getElementById("image-preview");
const imageResult = document.getElementById("image-result");
const imageUrl = document.getElementById("image-url");
const copyImageBtn = document.getElementById("copy-image");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
if (shortenForm &&
    urlInput &&
    shortenBtn &&
    linkResult &&
    shortUrl &&
    copyLinkBtn &&
    fileInput &&
    fileName &&
    uploadBtn &&
    imagePreview &&
    imageResult &&
    imageUrl &&
    copyImageBtn &&
    toast &&
    toastMessage &&
    hamburger &&
    navMenu) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        });
    });
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const tabId = tab.getAttribute("data-tab");
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            tabContents.forEach((content) => {
                content.classList.remove("active");
                if (content.id === `${tabId}-tab`) {
                    content.classList.add("active");
                }
            });
        });
    });
    fileInput.addEventListener("change", (e) => {
        var _a;
        const target = e.target;
        const file = (_a = target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            fileName.textContent = file.name;
            const reader = new FileReader();
            reader.onload = (event) => {
                var _a;
                const result = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
                if (typeof result === "string") {
                    imagePreview.src = result;
                    imagePreview.classList.add("active");
                }
            };
            reader.readAsDataURL(file);
        }
        else {
            fileName.textContent = "No file selected";
            imagePreview.classList.remove("active");
        }
    });
    shortenForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const longUrl = urlInput.value.trim();
        if (!longUrl)
            return;
        if (!isValidUrl(longUrl)) {
            showToast("Please enter a valid URL including http:// or https://", "error");
            return;
        }
        shortenBtn.disabled = true;
        shortenBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Shortening...';
        const short = await shortenLink(longUrl);
        if (short) {
            shortUrl.href = short;
            shortUrl.textContent = short;
            linkResult.classList.add("active");
            showToast("URL shortened successfully!");
        }
        else {
            showToast("Failed to shorten URL. Please try again.", "error");
        }
        shortenBtn.disabled = false;
        shortenBtn.innerHTML = '<i class="fas fa-compress-alt"></i> Shorten';
    });
    uploadBtn.addEventListener("click", async () => {
        var _a, _b;
        const file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file) {
            showToast("Please select an image first.", "error");
            return;
        }
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        const formData = new FormData();
        formData.append("image", file);
        try {
            const res = await fetch("https://api.imgbb.com/1/upload?key=451868b52e08d90382eef79eaa680e94", {
                method: "POST",
                body: formData
            });
            const data = (await res.json());
            if ((_b = data === null || data === void 0 ? void 0 : data.data) === null || _b === void 0 ? void 0 : _b.url) {
                imageUrl.href = data.data.url;
                imageUrl.textContent = data.data.url;
                imageResult.classList.add("active");
                showToast("Image uploaded successfully!");
            }
            else {
                showToast("Failed to upload image. Please try again.", "error");
            }
        }
        catch {
            showToast("Error uploading image. Please try again.", "error");
        }
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Image';
    });
    copyLinkBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(shortUrl.href).then(() => showToast("Short URL copied to clipboard!"));
    });
    copyImageBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(imageUrl.href).then(() => showToast("Image URL copied to clipboard!"));
    });
    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        }
        catch {
            return false;
        }
    }
    function showToast(message, type = "success") {
        toastMessage.textContent = message;
        toast.className = `toast show ${type}`;
        setTimeout(() => {
            toast.className = "toast";
        }, 3000);
    }
}
async function shortenLink(longUrl) {
    try {
        const res = await fetch("https://cleanuri.com/api/v1/shorten", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ url: longUrl })
        });
        const data = (await res.json());
        if (data === null || data === void 0 ? void 0 : data.result_url) {
            return data.result_url;
        }
    }
    catch {
        // ignore and try fallback
    }
    try {
        const res2 = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`);
        const data2 = (await res2.json());
        if (data2 === null || data2 === void 0 ? void 0 : data2.shorturl) {
            return data2.shorturl;
        }
    }
    catch {
        return null;
    }
    return null;
}
