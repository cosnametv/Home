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
  
  // Greetings
  if (msg.match(/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/)) {
    return "Hello there! 👋 How can we help you today? Are you looking for <a href='#projects'>Website design & development</a>, <a href='#projects'>Android and IOS app development</a>, Graphic design, branding & logos, Laptop & PC repairs or Professional video editing?";
  }
  
  // How are you
  if (msg.includes("how are you") || msg.includes("how's it going") || msg.includes("how do you do") || msg.includes("what's up") || msg.includes("how have you been") || msg.includes("how are things") || msg.includes("how's everything") || msg.includes("how's life") || msg.includes("how's your day") || msg.includes("how's your week")) {
    return "We're doing great, thanks for asking! 😊 The whole Cosname team is energized and ready to help with your project. What are you working on?";
  }
  
  // Websites
  if (msg.includes("websites") || msg.includes("website") || msg.includes("web") || msg.includes("portfolio") || msg.includes("business website") || msg.includes("landing page") || msg.includes("company site")) {
    return "Yes, we build responsive and modern websites using HTML, CSS, JavaScript, and React. 🚀 Our team creates custom designs that reflect your brand identity. Check our <a href='#projects'>projects</a> and tell us a bit about your idea! We also offer e-commerce solutions, blogs, and corporate sites.";
  }
  
  // E-commerce
  if (msg.includes("e-commerce") || msg.includes("E-commerce") || msg.includes("E-Commerce") || msg.includes("ECOMMERCE") || msg.includes("ecommerce") || msg.includes("Ecommerce") || msg.includes("e commerce") || msg.includes("E commerce") || msg.includes("E Commerce") || msg.includes("E COMMERCE") || msg.includes("online store") || msg.includes("shop") || msg.includes("shopping cart")) {
    return "Absolutely! We can create a secure and user-friendly e-commerce website with online payments, inventory management, and customer accounts. 💳 We've built stores for fashion, electronics, and local businesses. What products do you plan to sell? We integrate with M-Pesa, PayPal, and credit cards.";
  }
  
  // Apps
  if (msg.includes("app") || msg.includes("apps") || msg.includes("app development") || msg.includes("apps development") || msg.includes("mobile app") || msg.includes("android app")) {
    return "Yes! We develop Android and iOS apps using Java, Kotlin, and Flutter. 📱 See our <a target='_blank' href='https://cosnametech.com/projects'>apps here</a>. Our team handles everything from UI/UX design to Play Store publication. Do you need a brand new app or updates to an existing one? We also offer maintenance packages!";
  }
  
  // Games
  if (msg.includes("games") || msg.includes("game") || msg.includes("game app") || msg.includes("mobile game") || msg.includes("android game")) {
    return "Yes! We develop Games for Android, iOS and Webpages. 🧩 Check out our own app: <a href='https://play.google.com/store/apps/details?id=com.cosname.infiniteriddle' target='_blank'>Infinite Riddle</a>. Our team specializes in puzzle games, educational games, and casual entertainment. Would you like us to build something similar for you? We can also add ads and in-app purchases!";
  }
  
  // Status Saver
  if (msg.includes("status saver") || msg.includes("whatsapp saver") || msg.includes("download status") || msg.includes("status downloader")) {
    return "We've already built a WhatsApp Status Saver app! 📥 See it here: <a href='https://play.google.com/store/apps/details?id=com.cosname.statussaver' target='_blank'>Status Saver</a>. It has over 10,000 downloads! Would you like your own custom version with extra features like automatic saving, privacy options, or sharing capabilities?";
  }
  
  // Blog/News app
  if (msg.includes("blog app") || msg.includes("news app") || msg.includes("content app") || msg.includes("magazine app") || msg.includes("article app")) {
    return "We can create a blog or news app to showcase articles and updates. 📰 Check this example: <a href='https://play.google.com/store/apps/details?id=com.cosname.statussaver' target='_blank'>Tech News App</a>. Our apps include categories, push notifications, and offline reading. What kind of content will you feature? We can integrate with WordPress as a backend!";
  }
  
  // Play Store
  if (msg.includes("play store") || msg.includes("publish app") || msg.includes("google play") || msg.includes("PlayStore") || msg.includes("app store") || msg.includes("publishing")) {
    return "We can help you publish your app on the Google Play Store and Apple App Store, including developer account setup, app optimization, and submission. 🛠️ Do you already have a developer account? We also provide ASO (App Store Optimization) to help your app rank higher!";
  }
  
  // Graphic Design
  if (msg.includes("logo") || msg.includes("flyer") || msg.includes("poster") || msg.includes("banner") || msg.includes("graphic design") || msg.includes("branding") || msg.includes("business card") || msg.includes("brochure") || msg.includes("social media") || msg.includes("instagram post") || msg.includes("facebook ad")) {
    return "Yes, we design logos, flyers, posters, business cards, brochures, social media graphics, and more! 🎨 Our creative team works closely with you to capture your vision. You can explore some of our work here: <a href='https://cosnametech.com/projects' target='_blank'>our designs</a>. We offer unlimited revisions until you're 100% satisfied. Feel free to share your ideas, and we'll bring them to life!";
  }
  
  // Repairs
  if (msg.includes("repair") || msg.includes("laptop") || msg.includes("pc") || msg.includes("computer") || msg.includes("fix") || msg.includes("broken") || msg.includes("not working") || msg.includes("slow") || msg.includes("virus") || msg.includes("malware") || msg.includes("crash") || msg.includes("blue screen") || msg.includes("hard drive") || msg.includes("ram") || msg.includes("battery")) {
    return "We provide laptop and PC repair services, including hardware fixes, software troubleshooting, virus removal, data recovery, and performance optimization. 🛠️ Our technicians have over 10 years of experience with all major brands (HP, Dell, Lenovo, Acer, Apple). What issues are you experiencing with your device? We offer free diagnostics and same-day service for most repairs!";
  }
  
  // Video Editing
  if (msg.includes("video edit") || msg.includes("edit video") || msg.includes("youtube") || msg.includes("thumbnails") || msg.includes("video production") || msg.includes("film") || msg.includes("movie") || msg.includes("reel") || msg.includes("tiktok") || msg.includes("short")) {
    return "We offer professional video editing for YouTube, social media, commercials, and more — including custom thumbnails, transitions, effects, and color grading. 🎬 Our editors use Adobe Premiere Pro, After Effects, and DaVinci Resolve. What's your video about? We can also add background music, voiceovers, and captions!";
  }
  
  // Pricing
  if (msg.includes("price") || msg.includes("cost") || msg.includes("charge") || msg.includes("how much") || msg.includes("rates") || msg.includes("fee") || msg.includes("budget") || msg.includes("expensive") || msg.includes("cheap") || msg.includes("affordable")) {
    return "Our prices depend on the project size and features. 💵 We offer competitive rates and custom quotes for every client. Can you share more about what you need so we can give you an accurate estimate? We also offer package deals for multiple services and payment plans for larger projects!";
  }
  
  // Payment
  if (msg.includes("mpesa") || msg.includes("ksh") || msg.includes("pay") || msg.includes("payment") || msg.includes("money") || msg.includes("transfer") || msg.includes("bank") || msg.includes("cash") || msg.includes("mobile money") || msg.includes("till") || msg.includes("paybill")) {
    return "Yes, we accept M-Pesa (Till number and Paybill), bank transfers, PayPal, and credit/debit cards. ✅ We also accept cryptocurrency (Bitcoin, Ethereum) for international clients. Would you like us to send you <a href='https://cosnametech.com/Contact' target='_blank'>payment details</a>? We provide receipts and invoices for all transactions.";
  }
  
  // Deposit
  if (msg.includes("deposit") || msg.includes("advance") || msg.includes("down payment") || msg.includes("upfront") || msg.includes("half") || msg.includes("50%")) {
    return "We usually request a 50% deposit before starting the project, as it helps secure the booking and ensures commitment from both sides. 🔒 The remaining balance is paid upon delivery, once the final work is completed to your satisfaction. For very large projects, we can arrange milestone payments (30-30-40).";
  }
  
  // Timeline
  if (msg.includes("how long") || msg.includes("timeline") || msg.includes("delivery") || msg.includes("deadline") || msg.includes("time") || msg.includes("duration") || msg.includes("when") || msg.includes("complete") || msg.includes("finish") || msg.includes("ready")) {
    return "Most projects take between a few days and two weeks, depending on complexity. ⏱️ Simple logos: 2-3 days, Basic websites: 5-7 days, Mobile apps: 2-4 weeks, Complex e-commerce: 3-4 weeks. Do you have a specific deadline in mind? We can also offer rush delivery for an additional fee!";
  }
  
  // Revisions
  if (msg.includes("revisions") || msg.includes("changes") || msg.includes("modify") || msg.includes("edit") || msg.includes("update") || msg.includes("adjust") || msg.includes("feedback") || msg.includes("correction") || msg.includes("improve") || msg.includes("redo")) {
    return "Yes, we offer unlimited free revisions within the project scope to make sure you're 100% happy with the results. 🔄 Your satisfaction is our priority! We'll work with you until everything is perfect. After project completion, we offer maintenance packages for ongoing updates and support.";
  }
  
  // How to start
  if (msg.includes("how do we start") || msg.includes("start") || msg.includes("process") || msg.includes("order") || msg.includes("begin") || msg.includes("work together") || msg.includes("next steps") || msg.includes("get started") || msg.includes("procedure") || msg.includes("workflow")) {
    return "We start by discussing your requirements via email, phone, or WhatsApp. Then we provide a detailed quote and timeline. After a 50% deposit, we begin work and share regular updates until delivery. 🚀 You can reach us directly on <a href='https://cosnametech.com/Contact' target='_blank'>contacts page</a>. We're very responsive and will get back to you within 24 hours!";
  }
  
  // Location
  if (msg.includes("where are you") || msg.includes("location") || msg.includes("based") || msg.includes("country") || msg.includes("city") || msg.includes("office") || msg.includes("address") || msg.includes("headquarters") || msg.includes("kenya") || msg.includes("nairobi") || msg.includes("africa")) {
    return "We're based in Nairobi, Kenya 🌍 but we work with clients worldwide through online communication. Our team operates remotely to serve you better! You can find us here: <a href='https://cosnametech.com/Contact' target='_blank'>contacts</a>. We're available during East Africa Time (EAT) but respond to messages promptly regardless of timezone.";
  }
  
  // WhatsApp/Contact
  if (msg.includes("whatsapp") || msg.includes("phone number") || msg.includes("call") || msg.includes("text") || msg.includes("message") || msg.includes("contact") || msg.includes("reach") || msg.includes("email") || msg.includes("telephone") || msg.includes("mobile")) {
    return "Sure! You can reach us via WhatsApp at +254738387257, email at contact@cosnametech.com, or through our <a href='https://cosnametech.com/Contact' target='_blank'>contact form</a>. 📞 We typically respond within a few hours. For urgent matters, WhatsApp is fastest! Once we discuss your project details, we can share direct numbers for our project managers.";
  }
  
  // Multiple services
  if (msg.includes("logo and website") || msg.includes("multiple services") || msg.includes("both") || msg.includes("full package") || msg.includes("all in one") || msg.includes("bundle") || msg.includes("package deal") || msg.includes("combination") || msg.includes("everything")) {
    return "Yes, we can handle multiple services together as a full package! 🎯 Many clients choose our bundles: Logo + Website + Business Cards, or App + Website + Branding. You save money with package deals and get a cohesive brand identity. Check <a href='https://cosnametech.com/projects' target='_blank'>projects</a> for examples of our complete packages.";
  }
  
  // SEO
  if (msg.includes("seo") || msg.includes("search engine") || msg.includes("google ranking") || msg.includes("optimize") || msg.includes("rank") || msg.includes("visibility") || msg.includes("traffic") || msg.includes("search results")) {
    return "We provide comprehensive SEO setup to ensure your website ranks high on Google. 🔍 This includes keyword research, on-page optimization (titles, meta descriptions, headers, image alt tags), technical SEO (site speed, mobile-friendliness, sitemaps), and content strategy. We also offer monthly SEO packages to maintain and improve your rankings. Our goal is to drive organic traffic and grow your business!";
  }
  
  // Social Media
  if (msg.includes("social media") || msg.includes("facebook") || msg.includes("instagram") || msg.includes("twitter") || msg.includes("linkedin") || msg.includes("tiktok") || msg.includes("youtube channel") || msg.includes("social marketing") || msg.includes("smm")) {
    return "We offer complete social media management services! 📱 This includes profile setup, content creation (posts, stories, reels), scheduling, engagement, and analytics reporting. We can help you grow your following and increase engagement. Check out our <a href='https://cosnametech.com/projects' target='_blank'>social media packages</a> for businesses of all sizes!";
  }
  
  // Content Writing
  if (msg.includes("content") || msg.includes("writing") || msg.includes("copywriting") || msg.includes("blog post") || msg.includes("article") || msg.includes("website content") || msg.includes("product description") || msg.includes("script") || msg.includes("text")) {
    return "Our team includes professional content writers and copywriters! ✍️ We create engaging website copy, blog posts, product descriptions, social media captions, video scripts, and email newsletters. All content is SEO-optimized and tailored to your brand voice. Tell us about your project and we'll provide samples!";
  }
  
  // Photography
  if (msg.includes("photo") || msg.includes("photography") || msg.includes("product photo") || msg.includes("shoot") || msg.includes("camera") || msg.includes("images") || msg.includes("pictures")) {
    return "We offer professional photography services! 📸 Product photography for e-commerce, event coverage, corporate headshots, and real estate photography. Our photographers use professional equipment and can shoot at your location or our studio. Contact us for rates and portfolio samples!";
  }
  
  // Training
  if (msg.includes("training") || msg.includes("learn") || msg.includes("course") || msg.includes("class") || msg.includes("teach") || msg.includes("tutorial") || msg.includes("workshop") || msg.includes("mentor") || msg.includes("skills")) {
    return "We provide training and workshops in web development, app development, graphic design, and digital marketing! 🎓 Our courses are available online or in-person in Nairobi. Whether you're a beginner or looking to upgrade skills, we have customized programs. Check our <a href='https://cosnametech.com/training' target='_blank'>training schedule</a> for upcoming sessions!";
  }
  
  // Internship
  if (msg.includes("internship") || msg.includes("intern") || msg.includes("job") || msg.includes("career") || msg.includes("opportunity") || msg.includes("work with you") || msg.includes("join team") || msg.includes("employment") || msg.includes("vacancy") || msg.includes("hiring")) {
    return "We occasionally offer internship and job opportunities for talented individuals! 👥 Send your CV and portfolio to careers@cosnametech.com. We're always looking for developers, designers, and marketers who are passionate about technology. Follow us on social media for announcements about openings!";
  }
  
  // Partnership
  if (msg.includes("partner") || msg.includes("collaborate") || msg.includes("partnership") || msg.includes("joint venture") || msg.includes("work together") || msg.includes("affiliate") || msg.includes("referral")) {
    return "We're open to partnerships and collaborations! 🤝 Whether you're an agency looking for a development partner, a freelancer needing backup, or a business wanting to refer clients, let's talk. We offer competitive referral commissions and white-label services. Email partnerships@cosnametech.com to discuss opportunities!";
  }
  
  // Consultation
  if (msg.includes("consult") || msg.includes("consultation") || msg.includes("advice") || msg.includes("strategy") || msg.includes("planning") || msg.includes("brainstorm") || msg.includes("meeting") || msg.includes("discuss")) {
    return "We offer free initial consultations to understand your project and provide expert advice! 📞 During the consultation, we'll discuss your goals, budget, timeline, and recommend the best solutions. Schedule a call with us through our <a href='https://cosnametech.com/Contact' target='_blank'>contact page</a>. We're happy to be your technology advisors!";
  }
  
  // Portfolio
  if (msg.includes("portfolio") || msg.includes("previous work") || msg.includes("past projects") || msg.includes("examples") || msg.includes("samples") || msg.includes("showcase") || msg.includes("work done") || msg.includes("clients")) {
    return "You can view our complete portfolio at <a href='https://cosnametech.com/projects' target='_blank'>cosnametech.com/projects</a>! 🖼️ We've worked with clients from Kenya, USA, UK, and across Africa on websites, mobile apps, branding, and more. Would you like to see examples similar to your project? Just let us know what you're interested in!";
  }
  
  // Testimonials
  if (msg.includes("testimonial") || msg.includes("review") || msg.includes("feedback") || msg.includes("rating") || msg.includes("recommend") || msg.includes("trust") || msg.includes("reputation") || msg.includes("experience with you")) {
    return "Our clients love working with us! ⭐ Here's what some say: 'Cosname delivered an amazing website for my business' - James K. 'Professional, timely, and creative' - Mary W. 'They transformed our brand identity' - TechStart Kenya. Read more <a href='https://cosnametech.com/testimonials' target='_blank'>testimonials here</a>!";
  }
  
  // Refund Policy
  if (msg.includes("refund") || msg.includes("money back") || msg.includes("guarantee") || msg.includes("warranty") || msg.includes("satisfaction") || msg.includes("return") || msg.includes("cancel")) {
    return "We have a client satisfaction guarantee! ✅ If you're not happy with our initial concepts, we offer a full refund of the deposit before work begins. Once development starts, we'll work with you until you're satisfied. We also provide 30-day post-delivery support for all projects. Our goal is 100% client happiness!";
  }
  
  // Support/Maintenance
  if (msg.includes("support") || msg.includes("maintenance") || msg.includes("update") || msg.includes("keep") || msg.includes("after delivery") || msg.includes("post launch") || msg.includes("ongoing") || msg.includes("care")) {
    return "We offer ongoing support and maintenance packages for all our projects! 🔧 Monthly plans include security updates, backups, content updates, and priority support. Website hosting packages start at KES 2,000/month. App maintenance includes bug fixes and compatibility updates. Let us know what you need and we'll create a custom plan!";
  }
  
  // Technology Stack
  if (msg.includes("technology") || msg.includes("tech stack") || msg.includes("tools") || msg.includes("programming language") || msg.includes("framework") || msg.includes("what do you use") || msg.includes("built with") || msg.includes("developed in")) {
    return "We use modern technologies for all our projects: 💻 Websites: HTML5, CSS3, JavaScript, React, Vue, WordPress. 📱 Mobile Apps: Java, Kotlin, Flutter, React Native. 🎨 Design: Adobe Creative Suite, Figma, Canva. 🛠️ Backend: Node.js, PHP, Python, Firebase, MySQL. We always choose the best tools for your specific needs!";
  }
  
  // Project Management
  if (msg.includes("project management") || msg.includes("communication") || msg.includes("updates") || msg.includes("progress") || msg.includes("track") || msg.includes("monitor") || msg.includes("report")) {
    return "We use industry-standard project management tools to keep you informed every step of the way! 📊 You'll get access to Trello/Asana boards, regular progress reports, and milestone demonstrations. We communicate via WhatsApp, email, or scheduled video calls. Transparency is our policy - you'll never wonder about your project status!";
  }
  
  // Copyright/Ownership
  if (msg.includes("copyright") || msg.includes("ownership") || msg.includes("rights") || msg.includes("intellectual property") || msg.includes("ip") || msg.includes("who owns") || msg.includes("source code") || msg.includes("files")) {
    return "Upon full payment, you receive 100% ownership and all rights to your project! 📜 We provide complete source code, design files, and documentation. Nothing is held back. You're free to modify, sell, or use your project however you wish. We also sign NDAs and IP transfer agreements if needed.";
  }
  
  // Team size
  if (msg.includes("how many") || msg.includes("team size") || msg.includes("people") || msg.includes("employees") || msg.includes("staff") || msg.includes("workers") || msg.includes("who are the")) {
    return "Cosname Technologies is a growing team of 12+ passionate professionals! 👥 We have developers (4), designers (3), content creators (2), project managers (2), and support staff. Each project is assigned a dedicated team including a project manager, lead developer/designer, and quality assurance. You get the power of a full agency with personal attention!";
  }
  
  // Founder/Owner
  if (msg.includes("founder") || msg.includes("owner") || msg.includes("ceo") || msg.includes("director") || msg.includes("boss") || msg.includes("management") || msg.includes("leadership")) {
    return "Cosname Technologies was founded by [Founder Name], a passionate technologist with over 10 years of experience in software development and digital design. 🚀 The leadership team includes experts in development, design, and business strategy. They're personally involved in major projects and client satisfaction!";
  }
  
  // Awards/Recognition
  if (msg.includes("award") || msg.includes("recognition") || msg.includes("achievement") || msg.includes("accolade") || msg.includes("certified") || msg.includes("recognized") || msg.includes("winning")) {
    return "We're proud to have been recognized in the tech community! 🏆 Winner of Kenya Digital Innovation Award 2023, Top 10 Web Developers in Nairobi 2024, and Google Certified Partners. Our apps have been featured on the Play Store and our designs have received industry recognition. We constantly strive for excellence!";
  }
  
  // CSR/Social responsibility
  if (msg.includes("csr") || msg.includes("social responsibility") || msg.includes("community") || msg.includes("give back") || msg.includes("charity") || msg.includes("donate") || msg.includes("volunteer") || msg.includes("non profit")) {
    return "Giving back to the community is important to us! ❤️ We offer discounted rates for non-profits and social enterprises. We also mentor young developers through free coding workshops in Nairobi schools. A portion of our profits goes to supporting tech education in underserved communities. We believe in technology for good!";
  }
  
  // Future plans
  if (msg.includes("future") || msg.includes("plans") || msg.includes("vision") || msg.includes("goals") || msg.includes("roadmap") || msg.includes("expansion") || msg.includes("growing") || msg.includes("next steps")) {
    return "We're excited about the future! 🚀 Our plans include launching a mobile app development academy, expanding to other East African countries, introducing AI-powered solutions, and building more in-house products like Infinite Riddle and Status Saver. We're also working on a platform to connect local businesses with digital services. Stay tuned!";
  }
  
  // Events
  if (msg.includes("event") || msg.includes("conference") || msg.includes("seminar") || msg.includes("webinar") || msg.includes("meetup") || msg.includes("hackathon") || msg.includes("workshop") || msg.includes("exhibition")) {
    return "We regularly participate in tech events and exhibitions! 📅 Follow us on social media for announcements about upcoming workshops, webinars, and networking events. We also host monthly free webinars on topics like 'Getting Started with Web Development' and 'Digital Marketing for Small Businesses'. Join our mailing list for invites!";
  }
  
  // Emergency
  if (msg.includes("emergency") || msg.includes("urgent") || msg.includes("asap") || msg.includes("immediately") || msg.includes("right now") || msg.includes("quick") || msg.includes("fast") || msg.includes("hurry") || msg.includes("rush")) {
    return "For urgent projects or emergencies, we offer priority service! ⚡ Contact us immediately via WhatsApp at +254738387257 and mention 'URGENT'. We'll respond within 30 minutes and can often start same-day. Priority handling may include a rush fee depending on the project scope, but we'll always be transparent about costs.";
  }
  
  // Privacy/Security
  if (msg.includes("privacy") || msg.includes("secure") || msg.includes("confidential") || msg.includes("data protection") || msg.includes("gdpr") || msg.includes("nda") || msg.includes("non disclosure") || msg.includes("safe")) {
    return "Your privacy and data security are our top priorities! 🔒 We sign NDAs before discussing project details. All client information is confidential, and we follow industry best practices for data protection. Our systems are encrypted and secure. We're happy to sign your company's NDA or provide our own. Security is built into every project!";
  }
  
  // B2B vs B2C
  if (msg.includes("b2b") || msg.includes("b2c") || msg.includes("business to business") || msg.includes("business to consumer") || msg.includes("corporate") || msg.includes("enterprise") || msg.includes("small business")) {
    return "We serve both B2B and B2C clients! 🏢 For B2B, we create corporate websites, internal tools, and enterprise software. For B2C, we build consumer apps, e-commerce stores, and engaging brand experiences. Our team adapts to your target audience. Tell us about your business and we'll recommend the best approach!";
  }
  
  // Languages
  if (msg.includes("language") || msg.includes("speak") || msg.includes("english") || msg.includes("swahili") || msg.includes("kiswahili") || msg.includes("french") || msg.includes("translation")) {
    return "Our team communicates fluently in English and Swahili. 🗣️ We also have team members who speak French and Arabic for international clients. All project documentation and deliverables are in English, but we can accommodate language preferences for communication. Let us know your preferred language!";
  }
  
  // Working hours
  if (msg.includes("hours") || msg.includes("working hours") || msg.includes("business hours") || msg.includes("open") || msg.includes("closed") || msg.includes("time") || msg.includes("availability")) {
    return "Our team is available Monday-Friday, 8:00 AM - 6:00 PM East Africa Time (EAT). ⏰ However, our support team monitors messages 24/7 and will respond as soon as possible. For urgent matters outside business hours, WhatsApp is best. We're closed on Kenyan public holidays but always have someone on call for emergencies!";
  }
  
  // Remote work
  if (msg.includes("remote") || msg.includes("work from home") || msg.includes("virtual") || msg.includes("online only") || msg.includes("distance") || msg.includes("telecommute")) {
    return "We're a fully remote-friendly team! 💻 While we have an office in Nairobi, most of our work is done online. We collaborate using Zoom, Slack, Trello, and Google Workspace. This allows us to serve clients worldwide efficiently. You can work with us completely remotely - we're experienced with virtual collaboration!";
  }
  
  // Office visit
  if (msg.includes("visit") || msg.includes("come to office") || msg.includes("meet in person") || msg.includes("face to face") || msg.includes("physical meeting") || msg.includes("drop by")) {
    return "You're welcome to visit our office in Nairobi! 🏢 We're located at [Office Address]. Please schedule an appointment first so we can properly prepare for your visit and ensure the right team members are available. We're happy to meet in person to discuss your project over a cup of coffee!";
  }
  
  // Startup
  if (msg.includes("startup") || msg.includes("new business") || msg.includes("entrepreneur") || msg.includes("small business") || msg.includes("beginner") || msg.includes("just starting")) {
    return "We LOVE working with startups and new businesses! 🚀 We offer special startup packages with affordable rates, flexible payment plans, and mentorship. From branding to MVP development, we help you launch successfully. Many successful businesses in Kenya started with us! Tell us about your startup dream and we'll help make it reality.";
  }
  
  // Freelancer
  if (msg.includes("freelancer") || msg.includes("solo") || msg.includes("independent") || msg.includes("individual") || msg.includes("just me")) {
    return "We work with freelancers too! Whether you need a website for your freelance portfolio, a logo, or help with client projects, we've got you covered. Many freelancers partner with us when projects get too big or require skills they don't have. We're happy to collaborate and offer freelancer discounts!";
  }
  
  // International
  if (msg.includes("international") || msg.includes("outside kenya") || msg.includes("abroad") || msg.includes("overseas") || msg.includes("foreign") || msg.includes("global") || msg.includes("worldwide")) {
    return "We have clients worldwide! 🌍 Currently serving clients in USA, UK, Canada, Australia, and across Africa. Time zone differences? No problem! We communicate asynchronously and schedule calls at your convenience. All payments can be made internationally via PayPal, wire transfer, or cryptocurrency. Distance is no barrier!";
  }
  
  // Comparison with competitors
  if (msg.includes("better than") || msg.includes("compare") || msg.includes("competitor") || msg.includes("versus") || msg.includes("vs") || msg.includes("different from") || msg.includes("unique")) {
    return "What makes Cosname unique? 🤔 We combine technical expertise with personalized attention. Unlike large agencies where you're just a number, we treat every client as a partner. Our pricing is transparent, we communicate regularly, and we don't outsource your work. Plus, we're a one-stop shop for all digital needs. Check our portfolio and testimonials to see the difference!";
  }
  
  // Innovation
  if (msg.includes("innovation") || msg.includes("innovative") || msg.includes("cutting edge") || msg.includes("latest") || msg.includes("trending") || msg.includes("modern") || msg.includes("newest")) {
    return "Innovation is at our core! 💡 We constantly research and implement the latest technologies and design trends. Our team attends conferences, takes courses, and experiments with new tools. When you work with us, you get modern, future-proof solutions. Check out our blog at <a href='https://cosnametech.com/blog' target='_blank'>cosnametech.com/blog</a> for insights on tech trends!";
  }
  
  // Blog
  if (msg.includes("blog") || msg.includes("articles") || msg.includes("posts") || msg.includes("read") || msg.includes("resources") || msg.includes("learning")) {
    return "Visit our blog at <a href='https://cosnametech.com/projects' target='_blank'>cosnametech.com/blog</a> for helpful articles on web development, app creation, digital marketing, design tips, and technology trends! 📚 We publish weekly content to help businesses grow digitally. Subscribe to stay updated! Would you like recommendations on specific topics?";
  }
  
  // Newsletter
  if (msg.includes("newsletter") || msg.includes("subscribe") || msg.includes("mailing list") || msg.includes("email updates") || msg.includes("sign up") || msg.includes("news")) {
    return "Sign up for our newsletter at <a href='https://cosnametech.com/#footer' target='_blank'>cosnametech.com/subscribe</a>! 📧 Get monthly updates on new services, special offers, tech tips, and company news. We respect your inbox - no spam, just valuable content. You can unsubscribe anytime. Subscribe today and get a free digital marketing checklist!";
  }
  
  // Request Quote
  if (msg.includes("quote") || msg.includes("estimate") || msg.includes("proposal") || msg.includes("bid") || msg.includes("quotation") || msg.includes("get price") || msg.includes("tell me how much")) {
    return "To get an accurate quote, please visit our <a href='https://cosnametech.com/Contact' target='_blank'>contact page</a> and provide details about your project! 📝 Include: type of service, specific requirements, timeline, and budget range. We'll get back to you within 24 hours with a detailed proposal. For complex projects, we may schedule a quick call to clarify requirements. We're excited to work with you!";
  }
  
  // Discounts/Promotions
  if (msg.includes("discount") || msg.includes("promo") || msg.includes("offer") || msg.includes("deal") || msg.includes("special") || msg.includes("sale") || msg.includes("coupon") || msg.includes("promotion")) {
    return "We regularly offer special promotions! 🎉 Current offers: 10% off for first-time clients, 15% discount on bundled services (website + logo), and referral rewards - refer a friend and get 10% off your next project! Follow us on social media for flash sales and seasonal discounts. Check our website for current promo codes!";
  }
  
  // Referral
  if (msg.includes("refer") || msg.includes("referral") || msg.includes("friend") || msg.includes("colleague") || msg.includes("recommend") || msg.includes("tell others")) {
    return "Thank you for considering referring us! 🙏 Our referral program gives you 10% off your next project when someone you refer becomes a client (they also get 5% off!). Just have them mention your name when contacting us. Refer multiple people and earn even more! Spread the word about Cosname Technologies!";
  }
  
  // Payment Plan
  if (msg.includes("payment plan") || msg.includes("installment") || msg.includes("monthly payment") || msg.includes("finance") || msg.includes("spread the cost") || msg.includes("pay over time")) {
    return "We offer flexible payment plans for larger projects! 💳 For projects over KES 50,000, we can arrange 3-6 monthly installments. Standard terms: 50% deposit to start, 25% at midpoint, 25% upon delivery. Custom plans available based on your needs. Contact us to discuss a payment structure that works for your budget!";
  }
  
  // Minimum budget
  if (msg.includes("minimum") || msg.includes("lowest") || msg.includes("starting from") || msg.includes("entry level") || msg.includes("basic") || msg.includes("small project")) {
    return "Our minimum project budget starts at KES 5,000 for simple logo design and KES 15,000 for basic websites. 📉 But don't worry - we're happy to work with various budgets and can suggest solutions that fit your needs. We believe in transparency and will always recommend cost-effective approaches. Tell us your budget and we'll make it work!";
  }
  
  // Case Studies
  if (msg.includes("case study") || msg.includes("success story") || msg.includes("client story") || msg.includes("project example") || msg.includes("real example")) {
    return "We love sharing success stories! 📚 Case studies available on our website: How we helped a local restaurant increase orders by 200% with a mobile app, branding a startup that secured $50k funding, e-commerce store that reached 1000+ monthly sales, and more. Visit <a href='https://cosnametech.com/case-studies' target='_blank'>our case studies</a> for inspiring stories!";
  }
  
  // Industry expertise
  if (msg.includes("industry") || msg.includes("sector") || msg.includes("field") || msg.includes("niche") || msg.includes("specialize") || msg.includes("experience in")) {
    return "We have experience across many industries! 🏥 Healthcare (clinic management systems), 📚 Education (e-learning platforms), 🏬 Retail (e-commerce), 🏦 Finance (mobile banking apps), 🎨 Creative (portfolio sites), 🏗️ Real Estate (property listing apps), 🍔 Food & Beverage (restaurant apps), and more. Whatever your industry, we can help!";
  }
  
  // Government
  if (msg.includes("government") || msg.includes("county") || msg.includes("state") || msg.includes("public sector") || msg.includes("ministry") || msg.includes("parastatal") || msg.includes("cbd")) {
    return "Yes, we work with government agencies and parastatals! 🏛️ We understand procurement processes, compliance requirements, and can handle large-scale projects. We've developed systems for [example projects]. Contact our government liaison team at government@cosnametech.com for specialized assistance with public sector projects.";
  }
  
  // Non-profit
  if (msg.includes("nonprofit") || msg.includes("non profit") || msg.includes("ngo") || msg.includes("charity") || msg.includes("foundation") || msg.includes("cbo") || msg.includes("community organization")) {
    return "We love supporting non-profits and NGOs! ❤️ We offer discounted rates for registered non-profit organizations. Whether you need a donation platform, awareness website, or volunteer management system, we're here to help. Some of our most meaningful work has been with organizations making a difference. Tell us about your mission!";
  }
  
  // Student
  if (msg.includes("student") || msg.includes("college") || msg.includes("university") || msg.includes("campus") || msg.includes("school") || msg.includes("project") || msg.includes("assignment")) {
    return "Students welcome! 🎓 We offer special student rates for academic projects, final year assignments, and startup ideas. We also provide mentorship and can help you learn while we build. Many of our interns started as students working with us! Show your student ID for a 15% discount on selected services.";
  }
  
  // Thank you variations
  if (msg.includes("thank") || msg.includes("thanks") || msg.includes("thank you") || msg.includes("thx") || msg.includes("ty") || msg.includes("appreciate it") || msg.includes("grateful")) {
    return "You're very welcome! 😄 We're delighted to help. Thank YOU for considering Cosname Technologies. If you have more questions, just ask. We're here for you!";
  }
  
  // Goodbye
  if (msg.includes("bye") || msg.includes("goodbye") || msg.includes("see you") || msg.includes("later") || msg.includes("talk to you") || msg.includes("catch you") || msg.includes("farewell") || msg.includes("take care") || msg.includes("peace") || msg.includes("ciao") || msg.includes("adios") || msg.includes("sayonara") || msg.includes("au revoir") || msg.includes("arrivederci") || msg.includes("tschüss") || msg.includes("do widzenia") || msg.includes("zàijiàn") || msg.includes("annyeong")) {
    return "Goodbye! 👋 Come back anytime if you need help. Remember, we're just a message away. Have a wonderful day! The Cosname team wishes you success!";
  }
  
  // Bible/God
  if (msg.includes("bible") || msg.includes("verse") || msg.includes("scripture") || msg.includes("god") || msg.includes("jesus") || msg.includes("christ") || msg.includes("faith") || msg.includes("hope") || msg.includes("pray") || msg.includes("prayer") || msg.includes("church") || msg.includes("gospel") || msg.includes("salvation") || msg.includes("sin") || msg.includes("forgiveness") || msg.includes("heaven") || msg.includes("eternal life") || msg.includes("holy spirit") || msg.includes("christianity")) {
    return "Here's a great verse: Jeremiah 29:11 — \"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.\" 🙏 Would you like another verse? We're blessed to serve you!";
  }
  
  // Love
  if (msg.includes("love") || msg.includes("like") || msg.includes("appreciate") || msg.includes("adore") || msg.includes("cherish") || msg.includes("value") || msg.includes("respect") || msg.includes("admire") || msg.includes("fond") || msg.includes("devoted") || msg.includes("passion") || msg.includes("heart") || msg.includes("care") || msg.includes("affection") || msg.includes("warmth") || msg.includes("tenderness") || msg.includes("attachment") || msg.includes("emotion") || msg.includes("feeling") || msg.includes("sentiment")) {
    return "We're grateful for your kind words! ❤️ The whole Cosname team appreciates you. Remember, God loves you even more — John 3:16: \"For God so loved the world that He gave His only Son, that whoever believes in Him shall not perish but have eternal life.\" We're here to help with your projects!";
  }
  
  // Services overview
  if (msg.includes("services") || msg.includes("help") || msg.includes("offer") || msg.includes("provide") || msg.includes("do") || msg.includes("what can you do") || msg.includes("what services do you offer") || msg.includes("what help can you provide") || msg.includes("capabilities")) {
    return "Here's everything we can help you with:<br><br>• 🌐 Website design & development (corporate, e-commerce, blogs, portfolios)<br>• 📱 Android & iOS app development (native and cross-platform)<br>• 🎨 Graphic design, branding, logos, business cards, flyers<br>• 🎬 Professional video editing & motion graphics<br>• 💻 Laptop & PC repairs, maintenance, upgrades<br>• 📸 Photography & content creation<br>• 🔍 SEO & digital marketing<br>• 📝 Content writing & copywriting<br>• 🤝 IT consulting & training<br><br>Each service is tailored to your needs. You can <a href='https://cosnametech.com/Contact' target='_blank'>contact us directly here</a> to discuss your project!";
  }
  
  // Positive feedback
  if (msg.includes("good") || msg.includes("great") || msg.includes("awesome") || msg.includes("fantastic") || msg.includes("excellent") || msg.includes("amazing") || msg.includes("wonderful") || msg.includes("perfect") || msg.includes("nice") || msg.includes("superb") || msg.includes("fabulous") || msg.includes("terrific") || msg.includes("brilliant") || msg.includes("outstanding") || msg.includes("impressive") || msg.includes("marvelous") || msg.includes("splendid") || msg.includes("exceptional") || msg.includes("magnificent") || msg.includes("phenomenal") || msg.includes("incredible") || msg.includes("remarkable") || msg.includes("sensational") || msg.includes("stunning") || msg.includes("spectacular")) {
    return "We're absolutely thrilled to hear that! 😃 Your positive feedback energizes our whole team. It's clients like you who make what we do worthwhile. We look forward to delivering even more excellence for you! Thank you for choosing Cosname Technologies.";
  }
  
  // Complaint/Dissatisfaction
  if (msg.includes("complaint") || msg.includes("dissatisfied") || msg.includes("unhappy") || msg.includes("problem") || msg.includes("issue") || msg.includes("wrong") || msg.includes("mistake") || msg.includes("error") || msg.includes("blame") || msg.includes("disappointed") || msg.includes("upset") || msg.includes("angry") || msg.includes("frustrated")) {
    return "We're sorry to hear you're not satisfied. 😔 At Cosname, client satisfaction is our priority. Please email our support team at support@cosnametech.com with details, and we'll make it right. We take all feedback seriously and will address your concerns within 24 hours. Thank you for giving us the chance to improve.";
  }
  
  // Default response
  return "We're not sure we understood that completely. 🤔 But we're here to help with websites, apps, graphic design, video editing, or computer repairs! Which one are you interested in? Check our <a href='https://cosnametech.com/projects' target='_blank'>projects</a> or tell us more about what you need. You can also visit our <a href='https://cosnametech.com/Contact' target='_blank'>contact page</a> to speak with a team member directly!";
}