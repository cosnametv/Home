// DOM elements
    const shortenForm = document.getElementById('shorten-form');
    const urlInput = document.getElementById('url');
    const shortenBtn = document.getElementById('shorten-btn');
    const linkResult = document.getElementById('link-result');
    const shortUrl = document.getElementById('short-url');
    const copyLinkBtn = document.getElementById('copy-link');
    
    const fileInput = document.getElementById('file');
    const fileName = document.getElementById('file-name');
    const uploadBtn = document.getElementById('upload');
    const imagePreview = document.getElementById('image-preview');
    const imageResult = document.getElementById('image-result');
    const imageUrl = document.getElementById('image-url');
    const copyImageBtn = document.getElementById('copy-image');
    
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
    
    // Tab switching
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show active content
        tabContents.forEach(content => {
          content.classList.remove('active');
          if (content.id === `${tabId}-tab`) {
            content.classList.add('active');
          }
        });
      });
    });

    // File input handling
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        fileName.textContent = file.name;
        
        // Preview image
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.src = e.target.result;
          imagePreview.classList.add('active');
        };
        reader.readAsDataURL(file);
      } else {
        fileName.textContent = 'No file selected';
        imagePreview.classList.remove('active');
      }
    });
    
    // URL shortening
    shortenForm.addEventListener('submit', async e => {
      e.preventDefault();
      const longUrl = urlInput.value.trim();
      if (!longUrl) return;
      
      // Validate URL
      if (!isValidUrl(longUrl)) {
        showToast('Please enter a valid URL including http:// or https://', 'error');
        return;
      }
      
      shortenBtn.disabled = true;
      shortenBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Shortening...';
      
      const short = await shortenLink(longUrl);
      
      if (short) {
        shortUrl.href = short;
        shortUrl.textContent = short;
        linkResult.classList.add('active');
        showToast('URL shortened successfully!');
      } else {
        showToast('Failed to shorten URL. Please try again.', 'error');
      }
      
      shortenBtn.disabled = false;
      shortenBtn.innerHTML = '<i class="fas fa-compress-alt"></i> Shorten';
    });
    
    // Image upload
    uploadBtn.addEventListener('click', async () => {
      const file = fileInput.files[0];
      if (!file) {
        showToast('Please select an image first.', 'error');
        return;
      }
      
      uploadBtn.disabled = true;
      uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
      
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        const res = await fetch('https://api.imgbb.com/1/upload?key=451868b52e08d90382eef79eaa680e94', {
          method: 'POST',
          body: formData
        });
        
        const data = await res.json();
        
        if (data && data.data && data.data.url) {
          imageUrl.href = data.data.url;
          imageUrl.textContent = data.data.url;
          imageResult.classList.add('active');
          showToast('Image uploaded successfully!');
        } else {
          showToast('Failed to upload image. Please try again.', 'error');
        }
      } catch (error) {
        showToast('Error uploading image. Please try again.', 'error');
      }
      
      uploadBtn.disabled = false;
      uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Image';
    });
    
    // Copy buttons
    copyLinkBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(shortUrl.href)
        .then(() => showToast('Short URL copied to clipboard!'));
    });
    
    copyImageBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(imageUrl.href)
        .then(() => showToast('Image URL copied to clipboard!'));
    });
    
  // Helper functions
  async function shortenLink(longUrl) {
    // Try CleanURI first
    try {
      const res = await fetch('https://cleanuri.com/api/v1/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ url: longUrl })
      });
      const data = await res.json();
      if (data && data.result_url) {
        return data.result_url;
      }
    } catch (e) {
      // ignore and try fallback
    }

    // Fallback to is.gd
    try {
      const res2 = await fetch('https://is.gd/create.php?format=json&url=' + encodeURIComponent(longUrl));
      const data2 = await res2.json();
      if (data2 && data2.shorturl) {
        return data2.shorturl;
      }
    } catch (e) {
      return null;
    }

    return null; // both services failed
  }

    function isValidUrl(url) {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }
    
    function showToast(message, type = 'success') {
      toastMessage.textContent = message;
      toast.className = 'toast show ' + type;
      
      setTimeout(() => {
        toast.className = 'toast';
      }, 3000);
    }

  
