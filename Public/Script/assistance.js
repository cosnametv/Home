const toggleBtn = document.getElementById('chatToggle');
const chatWindow = document.getElementById('chatWindow');
const closeBtn = document.getElementById('chatClose');
const sendBtn = document.getElementById('chatSend');
const chatInput = document.getElementById('chatInput');
const chatBody = document.getElementById('chatBody');

toggleBtn.addEventListener('click', () => chatWindow.classList.toggle('open'));
closeBtn.addEventListener('click', () => chatWindow.classList.remove('open'));
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  appendMessage('user', text);
  chatInput.value = '';
  setTimeout(() => appendMessage('bot', botReply(text)), 600);
}
function appendMessage(sender, text) {
  const div = document.createElement('div');
  div.style.margin = '8px 0';
  div.innerHTML = sender === 'user' 
    ? `<div style="text-align:right;"><span style="background:#4cc9f0;color:#000;padding:6px 10px;border-radius:8px;display:inline-block;">${text}</span></div>`
    : `<div style="text-align:left;"><span style="background:#1e293b;padding:6px 10px;border-radius:8px;display:inline-block;">${text}</span></div>`;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}
function botReply(msg) {
  msg = msg.toLowerCase();
  if (msg.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/)) {
    return "Hello there! 👋 How can I help you today? Are you looking for <a href='https://cosname.web.app/projects' target='_blank'>web</a>, <a href='https://cosname.web.app/projects' target='_blank'>app</a>, design, or video services?";
  }
  if (msg.includes("how are you")) {
    return "I'm doing great, thanks for asking! 😊 What project are you working on?";
  }
  if (msg.includes("build websites") || msg.includes("create website") || msg.includes("web development") || msg.includes("portfolio site") || msg.includes("business website")) {
    return "Yes, I build responsive and modern websites using HTML, CSS, and JavaScript. 🚀 Check my <a href='https://cosname.web.app/projects' target='_blank'>projects</a> and tell me a bit about your idea!";
  }
  if (msg.includes("e-commerce")) {
    return "Absolutely! I can create a secure and user-friendly e-commerce website with online payments. 💳 What products do you plan to sell?";
  }
  if (msg.includes("android app") || msg.includes("mobile app") || msg.includes("app development")) {
    return "Yes! I develop Android apps using Java and Android Studio. 📱 See my <a href='https://cosname.web.app/projects' target='_blank'>apps here</a>. Do you need a brand new app or updates to an existing one?";
  }
    if (msg.includes("android app") || msg.includes("mobile app") || msg.includes("app development")) {
    return "Yes! I develop Android apps using Java and Android Studio. 📱 See my <a href='https://cosname.web.app/projects' target='_blank'>apps here</a>. Do you need a brand new app or updates to an existing one?";
  }
  if (msg.includes("riddle") || msg.includes("puzzle game") || msg.includes("game app")) {
    return "Yes! I develop riddle and puzzle games for Android. 🧩 Check out my own app: <a href='https://play.google.com/store/apps/details?id=com.cosname.infiniteriddle' target='_blank'>Infinite Riddle</a>. Would you like me to build something similar for you?";
  }

  if (msg.includes("status saver") || msg.includes("whatsapp saver") || msg.includes("download status")) {
    return "I’ve already built a WhatsApp Status Saver app! 📥 See it here: <a href='https://play.google.com/store/apps/details?id=com.cosname.statussaver' target='_blank'>Status Saver</a>. Would you like your own custom version with extra features?";
  }
  if (msg.includes("blog app") || msg.includes("news app") || msg.includes("content app")) {
    return "I can create a blog or news app to showcase articles and updates. 📰 Check this example: <a href='https://play.google.com/store/apps/details?id=com.cosname.statussaver' target='_blank'>Tech News App</a>. What kind of content will you feature?";
  }
  if (msg.includes("play store") || msg.includes("publish app")) {
    return "I can help you publish your app on the Google Play Store, including setup and optimization. 🛠️ Do you already have a developer account?";
  }
  if (msg.includes("logo") || msg.includes("flyer") || msg.includes("poster") || msg.includes("banner") || msg.includes("graphic design")) {
    return "Yes, I design logos, flyers, posters, and more! 🎨 Check <a href='https://cosname.web.app/projects' target='_blank'>my designs</a> and share your ideas!";
  }
  if (msg.includes("video edit") || msg.includes("edit video") || msg.includes("youtube") || msg.includes("thumbnails")) {
    return "I offer video editing for YouTube, social media, and more — including custom thumbnails. 🎬 What’s your video about?";
  }
  if (msg.includes("price") || msg.includes("cost") || msg.includes("charge") || msg.includes("how much")) {
    return "My prices depend on the project size and features. 💵 Can you share more about what you need so I can give you an accurate quote?";
  }
  if (msg.includes("mpesa") || msg.includes("ksh") || msg.includes("pay")) {
    return "Yes, I accept MPesa and other payment methods. ✅ Would you like me to send you <a href='https://cosname.web.app/Contact' target='_blank'>payment details</a>?";
  }
  if (msg.includes("deposit") || msg.includes("advance")) {
    return "Typically I ask for a 50% deposit to start, then the rest on delivery. 🔒 Does that work for you?";
  }
  if (msg.includes("how long") || msg.includes("timeline") || msg.includes("delivery") || msg.includes("deadline")) {
    return "Most projects take between a few days and two weeks, depending on complexity. ⏱️ Do you have a specific deadline in mind?";
  }
  if (msg.includes("revisions") || msg.includes("changes")) {
    return "Yes, I offer free revisions within the project scope to make sure you're happy with the results. 🔄";
  }
  if (msg.includes("how do we start") || msg.includes("start") || msg.includes("process") || msg.includes("order")) {
    return "We start by discussing your requirements, then I give you a quote. After a deposit, I begin work and share updates until delivery. 🚀 You can reach me directly on <a href='https://cosname.web.app/Contact' target='_blank'>contacts page</a>.";
  }
  if (msg.includes("where are you") || msg.includes("location")) {
    return "I'm based in Kenya 🌍 — but I work with clients worldwide through online communication. You can find me here: <a href='https://cosname.web.app/Contact' target='_blank'>contacts</a>";
  }
  if (msg.includes("whatsapp") || msg.includes("phone number")) {
    return "Sure! I can share my WhatsApp number privately once we confirm your project details. 📞 See <a href='https://cosname.web.app/Contact' target='_blank'>contacts</a>.";
  }
  if (msg.includes("logo and website") || msg.includes("multiple services") || msg.includes("both")) {
    return "Yes, I can handle multiple services like logos, websites, and videos together a full package! 🎯 Check <a href='https://cosname.web.app/projects' target='_blank'>projects</a> for examples.";
  }
  if (msg.includes("seo") || msg.includes("search engine")) {
    return "I provide basic SEO setup to make sure your website is search-friendly. 🔍 Would you like this included?";
  }
  if (msg.includes("hack") || msg.includes("wifi") || msg.includes("illegal")) {
    return "Sorry, I can't help with that. 🚫 But I can definitely build secure websites and apps if you need!";
  }
  if (msg.includes("real person") || msg.includes("ai") || msg.includes("bot")) {
    return "I'm your friendly cosname assistant bot 🤖 powered by real expertise behind the scenes!";
  }
  if (msg.includes("favorite color") || msg.includes("fun")) {
    return "I like <span style='color:#4cc9f0;'>#4cc9f0</span> the same as our theme color! 😎 What's yours?";
  }
  if (msg.match(/\b(yes|sure|okay|alright|of course)\b/)) {
    return "Great! Let's move forward. 🚀 Would you like me to share <a href='https://cosname.web.app/Contact' target='_blank'>next steps</a>?";
  }
  if (msg.match(/\b(no|not now|later)\b/)) {
    return "No problem. I'll be here whenever you're ready! 🙂 Meanwhile, check <a href='https://cosname.web.app/projects' target='_blank'>projects</a>.";
  }
  if (msg.includes("day") || msg.includes("days") || msg.includes("quick") || msg.includes("urgent")) {
    return "Yes, I can prioritize urgent projects if the scope is clear. ⏱️ Can you share more details so I can confirm?";
  }
  if (msg.includes("about")) {
    return "We specialize in crafting custom web and mobile applications, dynamic branding solutions, and strategic IT consulting services. From startups to established enterprises, we help our clients scale and stay ahead in the digital age. Also, You can learn more about me on the <a href='https://cosname.web.app/About' target='_blank'>About page</a>.";
  }
  if (msg.includes("thank")) {
  return "You're welcome! 😄 Happy to help!";
  }
  if (msg.includes("bye") || msg.includes("goodbye") || msg.includes("see you")) {
    return "Goodbye! 👋 Come back anytime if you need help!";
  }
  if (msg.includes("love")) {
    return "I’m just code, but I think you’re awesome! ❤️ God loves you even more — John 3:16: \"For God so loved the world that He gave His only Son, that whoever believes in Him shall not perish but have eternal life.\"";
  }
  if (msg.includes("bible") || msg.includes("verse") || msg.includes("scripture")) {
    return "Here’s a great verse: Jeremiah 29:11 — \"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.\" Would you like another verse?";
  }
  return "I’m not sure I got that, but I can help with websites, apps, graphics, or video editing. Which one are you interested in? Check <a href='https://cosname.web.app/projects' target='_blank'>projects</a>.";
}

