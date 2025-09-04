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
    return "Hello there! 👋 How can I help you today? Are you looking for <a href='#projects'>Website design & development</a>, <a href='#projects'>Android and IOS app development</a>, Graphic design, branding & logos,  Laptop & PC repairs or Professional video editing?";
  }
  if (msg.includes("how are you") || msg.includes("how's it going") || msg.includes("how do you do") || msg.includes("what's up") || msg.includes("how have you been") || msg.includes("how are things") || msg.includes("how's everything") || msg.includes("how's life") || msg.includes("how's your day") || msg.includes("how's your week")) {
    return "I'm doing great, thanks for asking! 😊 What project are you working on?";
  }
  if (msg.includes("websites") || msg.includes("website") || msg.includes("web") || msg.includes("portfolio") || msg.includes("business website")) {
    return "Yes, I build responsive and modern websites using HTML, CSS, and JavaScript. 🚀 Check my <a href='#projects'>projects</a> and tell me a bit about your idea!";
  }
  if (msg.includes("e-commerce") || msg.includes("E-commerce") || msg.includes("E-Commerce") || msg.includes("ECOMMERCE") || msg.includes("ecommerce") || msg.includes("Ecommerce") || msg.includes("e commerce") || msg.includes("E commerce") || msg.includes("E Commerce") || msg.includes("E COMMERCE")) {
    return "Absolutely! I can create a secure and user-friendly e-commerce website with online payments. 💳 What products do you plan to sell?";
  }
  if (msg.includes("app") || msg.includes("apps") || msg.includes("app development") || msg.includes("apps development")) {
    return "Yes! I develop Android apps using Java and Android Studio. 📱 See my <a href='#projects'>apps here</a>. Do you need a brand new app or updates to an existing one?";
  }
    if (msg.includes("android app") || msg.includes("mobile app") || msg.includes("app development")) {
    return "Yes! I develop Android apps using Java and Android Studio. 📱 See my <a href='https://cosname.web.app/projects' target='_blank'>apps here</a>. Do you need a brand new app or updates to an existing one?";
  }
  if (msg.includes("games") || msg.includes("game") || msg.includes("game app")) {
    return "Yes! I develop Games for Android, IOS and Webpages. 🧩 Check out my own app: <a href='https://play.google.com/store/apps/details?id=com.cosname.infiniteriddle' target='_blank'>Infinite Riddle</a>. Would you like me to build something similar for you?";
  }
  if (msg.includes("status saver") || msg.includes("whatsapp saver") || msg.includes("download status")) {
    return "I’ve already built a WhatsApp Status Saver app! 📥 See it here: <a href='https://play.google.com/store/apps/details?id=com.cosname.statussaver' target='_blank'>Status Saver</a>. Would you like your own custom version with extra features?";
  }
  if (msg.includes("blog app") || msg.includes("news app") || msg.includes("content app")) {
    return "I can create a blog or news app to showcase articles and updates. 📰 Check this example: <a href='https://play.google.com/store/apps/details?id=com.cosname.statussaver' target='_blank'>Tech News App</a>. What kind of content will you feature?";
  }
  if (msg.includes("play store") || msg.includes("publish app") || msg.includes("google play") || msg.includes("PlayStore")) {
    return "I can help you publish your app on the Google Play Store, including setup and optimization. 🛠️ Do you already have a developer account?";
  }
  if (msg.includes("logo") || msg.includes("flyer") || msg.includes("poster") || msg.includes("banner") || msg.includes("graphic design")) {
 return "Yes, I design logos, flyers, posters, business cards, brochures, social media graphics, and more! 🎨 You can explore some of my work here: <a href='https://cosname.web.app/projects' target='_blank'>my designs</a>. Feel free to share your ideas, and I’ll bring them to life!";
  }
  if (msg.includes("repair") || msg.includes("laptop") || msg.includes("pc") || msg.includes("computer") || msg.includes("fix")) {
    return "I provide laptop and PC repair services, including hardware fixes, software troubleshooting, virus removal, and performance optimization. 🛠️ What issues are you experiencing with your device?";
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
   return "I usually request a 50% deposit before starting the project, as it helps secure the booking and ensures commitment from both sides. 🔒 The remaining balance is paid upon delivery, once the final work is completed to your satisfaction.";
  }
  if (msg.includes("how long") || msg.includes("timeline") || msg.includes("delivery") || msg.includes("deadline")) {
    return "Most projects take between a few days and two weeks, depending on complexity. ⏱️ Do you have a specific deadline in mind?";
  }
  if (msg.includes("revisions") || msg.includes("changes") || msg.includes("changes") || msg.includes("modify") || msg.includes("edit") || msg.includes("update") || msg.includes("fix") || msg.includes("adjust") ) {
    return "Yes, I offer free revisions within the project scope to make sure you're happy with the results. 🔄";
  }
  if (msg.includes("how do we start") || msg.includes("start") || msg.includes("process") || msg.includes("order") || msg.includes("begin") || msg.includes("work together") ) {
    return "We start by discussing your requirements, then I give you a quote. After a deposit, I begin work and share updates until delivery. 🚀 You can reach me directly on <a href='https://cosname.web.app/Contact' target='_blank'>contacts page</a>.";
  }
  if (msg.includes("where are you") || msg.includes("location") || msg.includes("based") || msg.includes("country") || msg.includes("city")) {
    return "I'm based in Kenya 🌍 but I work with clients worldwide through online communication. You can find me here: <a href='https://cosname.web.app/Contact' target='_blank'>contacts</a>";
  }
  if (msg.includes("whatsapp") || msg.includes("phone number") || msg.includes("call") || msg.includes("text") || msg.includes("message") || msg.includes("contact") ) {
    return "Sure! I can share my WhatsApp number privately once we confirm your project details. 📞 See <a href='https://cosname.web.app/Contact' target='_blank'>contacts</a>.";
  }
  if (msg.includes("logo and website") || msg.includes("multiple services") || msg.includes("both") || msg.includes("full package") || msg.includes("all in one")) {
    return "Yes, I can handle multiple services like logos, websites, and videos together a full package! 🎯 Check <a href='https://cosname.web.app/projects' target='_blank'>projects</a> for examples.";
  }
  if (msg.includes("seo") || msg.includes("search engine") || msg.includes("google ranking") || msg.includes("optimize") ) {
    return "I provide a basic SEO setup to ensure your website is search-friendly. 🔍 This includes optimizing page titles, meta descriptions, headers, and image alt tags. I also make sure your site is mobile-friendly and loads quickly, which helps with better ranking. These steps improve visibility on search engines, making it easier for people to discover your site.";
  }
  if (msg.includes("hack") || msg.includes("wifi") || msg.includes("illegal") || msg.includes("crack") || msg.includes("password") || msg.includes("pirate") || msg.includes("theft") || msg.includes("steal") || msg.includes("scam") || msg.includes("fraud") || msg.includes("cheat") || msg.includes("fake") || msg.includes("malware") || msg.includes("virus") || msg.includes("spyware") || msg.includes("ransomware") || msg.includes("phishing") || msg.includes("ddos") || msg.includes("keylogger") || msg.includes("botnet") || msg.includes("exploit") || msg.includes("vulnerability") || msg.includes("backdoor") || msg.includes("rootkit") || msg.includes("trojan") || msg.includes("worm") || msg.includes("adware") || msg.includes("spam") || msg.includes("scam")) {
    return "Sorry, I can’t assist with that request. 🚫 However, I specialize in creating secure, reliable websites and mobile apps. 🔒 My focus is on building solutions that protect user data, run smoothly, and meet your business needs.";
  }
  if (msg.includes("real person") || msg.includes("ai") || msg.includes("bot") || msg.includes("robot") || msg.includes("machine") || msg.includes("automation") || msg.includes("software") || msg.includes("program") || msg.includes("code") || msg.includes("script") || msg.includes("algorithm") || msg.includes("system") || msg.includes("technology") || msg.includes("digital") || msg.includes("virtual") || msg.includes("online") || msg.includes("internet")) {
    return "I’m your friendly Cosname assistant 🤖 here to guide you! Behind the scenes, I’m powered by real expertise in design, development, and digital solutions so you’ll always get helpful answers and professional support.";
  }
  if (msg.includes("favorite color") || msg.includes("fun") || msg.includes("joke") || msg.includes("humor") || msg.includes("laugh") || msg.includes("funny") || msg.includes("entertain") || msg.includes("amuse") || msg.includes("cheer up") || msg.includes("lighten up") || msg.includes("smile") || msg.includes("happy") || msg.includes("joy") || msg.includes("happiness") || msg.includes("laughter") || msg.includes("giggle") || msg.includes("chuckle") || msg.includes("jester") || msg.includes("comedian") || msg.includes("humorous") || msg.includes("witty") || msg.includes("sarcastic") || msg.includes("pun") || msg.includes("cartoon") || msg.includes("meme") ) {
    return "I like <span style='color:#4cc9f0;'>#4cc9f0</span>—our theme color! 😎 Funny thing is, I tried drinking it once… turns out hex codes don’t taste as good as they look! 😂 What’s your favorite color?";
  }
  if (msg.includes("day") || msg.includes("days") || msg.includes("quick") || msg.includes("urgent") || msg.includes("fast") || msg.includes("speedy") || msg.includes("rush") || msg.includes("immediate") || msg.includes("asap") || msg.includes("soon") || msg.includes("hurry") || msg.includes("emergency") || msg.includes("priority")) {
    return "Yes, I can prioritize urgent projects if the scope is clear. ⏱️ For rush work, I allocate extra time and resources to ensure fast delivery without compromising quality. Depending on the complexity, there may be an additional fee for priority handling, but this guarantees your project is completed on time and with full attention.";
  }
if (msg.includes("about") || msg.includes("cosname") || msg.includes("who are you") || msg.includes("what do you do") || msg.includes("company") || msg.includes("business") || msg.includes("expertise") || msg.includes("specialize") ) {
  return "We specialize in crafting custom web and mobile applications, dynamic branding solutions, and strategic IT consulting services. From startups to established enterprises, we help our clients scale and stay ahead in the digital age. You can learn more on the <a href='https://cosname.web.app/About' target='_blank'>About page</a>.";
}
  if (msg.includes("thank") || msg.includes("thanks") || msg.includes("thank you") || msg.includes("thx") || msg.includes("ty")) {
  return "You're welcome! 😄 Happy to help!";
  }
  if (msg.includes("bye") || msg.includes("goodbye") || msg.includes("see you") || msg.includes("later") || msg.includes("talk to you") || msg.includes("catch you") || msg.includes("farewell") || msg.includes("take care") || msg.includes("peace") || msg.includes("ciao") || msg.includes("adios") || msg.includes("sayonara") || msg.includes("au revoir") || msg.includes("arrivederci") || msg.includes("tschüss") || msg.includes("do widzenia") || msg.includes("zàijiàn") || msg.includes("annyeong") ) {
    return "Goodbye! 👋 Come back anytime if you need help!";
  }
  if (msg.includes("love") || msg.includes("like") || msg.includes("appreciate") || msg.includes("adore") || msg.includes("cherish") || msg.includes("value") || msg.includes("respect") || msg.includes("admire") || msg.includes("fond") || msg.includes("devoted") || msg.includes("passion") || msg.includes("heart") || msg.includes("care") || msg.includes("affection") || msg.includes("warmth") || msg.includes("tenderness") || msg.includes("attachment") || msg.includes("emotion") || msg.includes("feeling") || msg.includes("sentiment")) {
    return "I’m just code, but I think you’re awesome! ❤️ God loves you even more — John 3:16: \"For God so loved the world that He gave His only Son, that whoever believes in Him shall not perish but have eternal life.\"";
  }
  if (msg.includes("bible") || msg.includes("verse") || msg.includes("scripture") || msg.includes("god") || msg.includes("jesus") || msg.includes("christ") || msg.includes("faith") || msg.includes("hope") || msg.includes("pray") || msg.includes("prayer") || msg.includes("church") || msg.includes("gospel") || msg.includes("salvation") || msg.includes("sin") || msg.includes("forgiveness") || msg.includes("heaven") || msg.includes("eternal life") || msg.includes("holy spirit") || msg.includes("christianity") ) {
    return "Here’s a great verse: Jeremiah 29:11 — \"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.\" Would you like another verse?";
  }
  if (msg.includes("services") || msg.includes("help") || msg.includes("offer") || msg.includes("provide") || msg.includes("do") || msg.includes("what can you do") || msg.includes("what services do you offer") || msg.includes("what help can you provide")) {
  return "Here’s what I can help you with:<br>• Website design & development 🌐<br>• Android app development 📱<br>• Professional video editing 🎬<br>• Laptop & PC repairs 💻<br>• Graphic design, branding & logos 🎨<br><br>Each service is tailored to your needs, ensuring quality results. You can <a href='https://cosname.web.app/Contact' target='_blank'>contact me directly here</a> to discuss your project!";
  }
  if (msg.includes("good") || msg.includes("great") || msg.includes("awesome") || msg.includes("fantastic") || msg.includes("excellent") || msg.includes("amazing") || msg.includes("wonderful") || msg.includes("perfect") || msg.includes("nice") || msg.includes("superb") || msg.includes("fabulous") || msg.includes("terrific") || msg.includes("brilliant") || msg.includes("outstanding") || msg.includes("impressive") || msg.includes("marvelous") || msg.includes("splendid") || msg.includes("exceptional") || msg.includes("magnificent") || msg.includes("phenomenal") || msg.includes("incredible") || msg.includes("remarkable") || msg.includes("sensational") || msg.includes("stunning") || msg.includes("spectacular")) {
  return "I’m glad to hear that! 😃 Your positive feedback keeps me motivated to deliver the best results every time.";
 }
  return "I’m not sure I got that, but I can help with websites, apps, graphics, or video editing. Which one are you interested in? Check <a href='https://cosname.web.app/projects' target='_blank'>projects</a>.";
}

