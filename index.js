// ==========================================
// GMAIL API INTEGRATION (AUTHENTICATION & SENDER WITH ATTACHMENTS)
// ==========================================

const DEFAULT_WEB_CLIENT_ID = "397056968836-gi10r5ddo38dt33ld2q9f2o2797604m5.apps.googleusercontent.com";

let googleTokenClient = null;
let accessToken = localStorage.getItem("gmail_access_token") || null;
let userEmail = localStorage.getItem("gmail_user_email") || null;
let selectedCvFile = null;

// Clear old desktop client ID if cached in browser localStorage
if (localStorage.getItem("gmail_client_id") && localStorage.getItem("gmail_client_id").includes("6qbg2djp")) {
    localStorage.removeItem("gmail_client_id");
    localStorage.removeItem("gmail_access_token");
    accessToken = null;
}

let customClientId = localStorage.getItem("gmail_client_id") || (window.__ENV__ ? window.__ENV__.GOOGLE_CLIENT_ID : "") || DEFAULT_WEB_CLIENT_ID;

function initGoogleAuth(pendingAction = null) {
    const clientId = (window.__ENV__ && window.__ENV__.GOOGLE_CLIENT_ID) ? window.__ENV__.GOOGLE_CLIENT_ID : (customClientId || DEFAULT_WEB_CLIENT_ID);
    
    if (!clientId) {
        openClientModal();
        showToast("Silakan masukkan Google OAuth Client ID terlebih dahulu.", "warning");
        return;
    }

    if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        googleTokenClient = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email",
            callback: async (tokenResponse) => {
                if (tokenResponse.access_token) {
                    accessToken = tokenResponse.access_token;
                    localStorage.setItem("gmail_access_token", accessToken);
                    await fetchUserProfile();
                    updateStatusUI();
                    showToast("Berhasil terhubung ke akun Gmail!", "success");
                    
                    if (pendingAction) {
                        pendingAction();
                    }
                }
            }
        });

        googleTokenClient.requestAccessToken();
    } else {
        showToast("Google Identity SDK belum dimuat. Periksa koneksi internet Anda.", "error");
    }
}

async function fetchUserProfile() {
    if (!accessToken) return;
    try {
        const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (res.ok) {
            const data = await res.json();
            userEmail = data.email;
            localStorage.setItem("gmail_user_email", userEmail);
        }
    } catch (e) {
        console.error("Gagal mengambil profil user:", e);
    }
}

function updateStatusUI() {
    const tag = document.getElementById("gmailAccountStatus");
    if (tag) {
        if (accessToken && userEmail) {
            tag.textContent = `Gmail: ${userEmail}`;
            tag.className = "gmail-status-tag active";
        } else {
            tag.textContent = "Gmail API Ready";
            tag.className = "gmail-status-tag";
        }
    }
}

// Base64URL encoder for RFC 2822 MIME message (Supports PDF/File Attachments)
function createRawMimeMessage(to, subject, bodyText, attachmentObj = null) {
    if (!attachmentObj) {
        const message = [
            `To: ${to}`,
            'Content-Type: text/plain; charset="UTF-8"',
            'MIME-Version: 1.0',
            `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
            '',
            bodyText
        ].join('\r\n');

        return btoa(unescape(encodeURIComponent(message)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    const boundary = "====MailCraftBoundary_" + Date.now();
    let mime = "";
    mime += `To: ${to}\r\n`;
    mime += `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=\r\n`;
    mime += `MIME-Version: 1.0\r\n`;
    mime += `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`;

    // Part 1: Email Text Body
    mime += `--${boundary}\r\n`;
    mime += `Content-Type: text/plain; charset="UTF-8"\r\n`;
    mime += `Content-Transfer-Encoding: 8bit\r\n\r\n`;
    mime += `${bodyText}\r\n\r\n`;

    // Part 2: Attachment File
    mime += `--${boundary}\r\n`;
    mime += `Content-Type: ${attachmentObj.mimeType || 'application/pdf'}; name="${attachmentObj.filename}"\r\n`;
    mime += `Content-Disposition: attachment; filename="${attachmentObj.filename}"\r\n`;
    mime += `Content-Transfer-Encoding: base64\r\n\r\n`;
    mime += `${attachmentObj.base64Data}\r\n\r\n`;

    mime += `--${boundary}--`;

    return btoa(unescape(encodeURIComponent(mime)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

async function sendEmailViaGmailApi(email, subject, message, buttonToAnimate = null) {
    if (!accessToken) {
        initGoogleAuth(() => sendEmailViaGmailApi(email, subject, message, buttonToAnimate));
        return;
    }

    try {
        const rawMessage = createRawMimeMessage(email, subject, message, selectedCvFile);
        const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ raw: rawMessage })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("GMAIL API SUCCESS:", data);
            const attachmentNote = selectedCvFile ? ` (dengan lampiran CV "${selectedCvFile.filename}")` : "";
            showToast(`Email lamaran berhasil dikirim ke ${email}${attachmentNote}!`, "success");
            return true;
        } else {
            const errorData = await response.json();
            if (response.status === 401) {
                localStorage.removeItem("gmail_access_token");
                accessToken = null;
                updateStatusUI();
                showToast("Sesi Gmail kedaluwarsa. Mengautentikasi ulang...", "warning");
                initGoogleAuth(() => sendEmailViaGmailApi(email, subject, message, buttonToAnimate));
            } else {
                throw new Error(errorData.error ? errorData.error.message : "Gagal mengiriim email");
            }
            return false;
        }
    } catch (err) {
        console.error("GMAIL API ERROR:", err);
        showToast(`Gagal mengirim ke ${email}: ${err.message || err}`, "error");
        throw err;
    }
}

// ==========================================
// TEMPLATES DATA
// ==========================================
function getTemplate(type, hrName) {
    if (type === "frontend") {
        return `Dear ${hrName},

Perkenalkan, saya Badriana, seorang Frontend Developer dengan pengalaman lebih dari 2+ tahun dalam mengembangkan aplikasi web yang scalable, responsive, dan high-performance.

Selama berkarier, saya telah mengembangkan berbagai aplikasi berbasis web, seperti Ticketing Management System, Live Chat Platform, Reporting Dashboard, QA Monitoring System, serta berbagai proyek di bidang perbankan, asuransi, pendidikan, dan customer service. Saya juga memiliki pengalaman membangun UI modern, melakukan integrasi REST API, mengoptimalkan performa aplikasi, serta mengimplementasikan business logic pada aplikasi berskala enterprise.

Keahlian yang saya miliki meliputi:

• React.js
• Next.js
• Remix
• Vue.js
• TypeScript
• JavaScript (ES6+)
• HTML5 & CSS3
• Tailwind CSS
• Bootstrap
• Redux Toolkit
• Zustand
• Context API
• REST API Integration
• Node.js (Express)
• PostgreSQL & MySQL
• Git & GitHub

Selain pengalaman profesional, saya juga aktif mengembangkan berbagai proyek pribadi dan package open source yang dipublikasikan di NPM, sebagai bentuk komitmen saya untuk terus belajar dan memberikan kontribusi bagi ekosistem JavaScript.

Saya yakin pengalaman dan kemampuan yang saya miliki dapat memberikan kontribusi positif bagi perusahaan Bapak/Ibu.

Sebagai bahan pertimbangan, saya telah melampirkan CV pada email ini. Besar harapan saya dapat diberikan kesempatan untuk mengikuti proses wawancara agar dapat menjelaskan lebih lanjut mengenai pengalaman dan kemampuan yang saya miliki.

Terima kasih atas waktu dan perhatian Bapak/Ibu. Saya menantikan kesempatan untuk berdiskusi lebih lanjut.

Hormat saya,

Badriana
Frontend Developer 

WhatsApp: 085887535612
Portfolio: https://portfolio-badriana.vercel.app/`;
    }
    
    if (type === "fullstack") {
        return `Dear ${hrName},

Perkenalkan, saya Badriana, seorang Fullstack Developer dengan pengalaman lebih dari 2+ tahun dalam mengembangkan aplikasi web modern dari sisi frontend maupun backend. Saya memiliki keahlian yang kuat di pengembangan frontend serta pengalaman membangun REST API, mengelola database, dan mengembangkan aplikasi end-to-end.

Selama berkarier, saya telah mengembangkan berbagai sistem enterprise, seperti Ticketing Management System, Live Chat Platform, Reporting Dashboard, QA Monitoring System, serta berbagai proyek di sektor perbankan, asuransi, pendidikan, dan customer service. Saya juga terbiasa melakukan integrasi API, mengimplementasikan business logic, mengoptimalkan performa aplikasi, serta berkolaborasi dengan tim lintas divisi untuk menghasilkan solusi yang berkualitas.

Keahlian:

Frontend
• React.js
• Next.js
• Remix
• Vue.js
• TypeScript
• JavaScript (ES6+)
• HTML5 & CSS3
• Tailwind CSS
• Bootstrap
• Redux Toolkit
• Zustand

Backend
• Node.js
• Express.js
• Golang (Echo)
• REST API Development
• JWT Authentication
• API Integration

Database
• PostgreSQL
• MySQL

Tools
• Git & GitHub
• CI/CD Basics

Pengalaman Proyek
• Ticketing Management System
• Live Chat Platform
• Reporting Dashboard
• QA Monitoring System
• WhatsApp Integration
• Banking Platform
• Insurance Platform
• Educational Platform
• Internal Business System

Selain pengalaman profesional, saya juga aktif mengembangkan berbagai proyek pribadi dan package open source yang telah dipublikasikan di NPM. Hal ini mencerminkan komitmen saya untuk terus belajar, mengembangkan solusi yang bermanfaat, dan mengikuti perkembangan teknologi web modern.

Sebagai bahan pertimbangan, saya telah melampirkan CV pada email ini. Besar harapan saya dapat diberikan kesempatan untuk mengikuti proses wawancara agar dapat menjelaskan lebih lanjut mengenai pengalaman dan kemampuan yang saya miliki.

Terima kasih atas waktu dan perhatian Bapak/Ibu. Saya menantikan kesempatan untuk berdiskusi lebih lanjut.

Hormat saya,

Badriana
Fullstack Developer

WhatsApp: 085887535612
Portfolio: https://portfolio-badriana.vercel.app/`;
    }

    if (type === "golang") {
        return `Dear ${hrName},

Perkenalkan, saya Badriana, seorang Junior Golang Developer dengan pengalaman lebih dari 2+ tahun dalam pengembangan aplikasi web. Meskipun latar belakang saya lebih banyak berfokus pada frontend development, saya juga memiliki pengalaman membangun backend menggunakan Golang (Echo Framework) serta mengembangkan REST API dan mengelola database relasional melalui berbagai proyek pribadi maupun implementasi fullstack.

Selama berkarier, saya telah terlibat dalam pengembangan berbagai sistem enterprise, seperti Ticketing Management System, Live Chat Platform, Reporting Dashboard, QA Monitoring System, serta berbagai proyek di sektor perbankan, asuransi, pendidikan, dan customer service. Pengalaman tersebut memberikan saya pemahaman yang baik mengenai arsitektur aplikasi, integrasi API, implementasi business logic, dan kolaborasi dengan tim lintas divisi.

Keahlian yang saya miliki meliputi:

Backend
• Golang (Echo Framework)
• Node.js (Express.js)
• REST API Development
• JWT Authentication
• JSON Processing
• API Integration

Database
• PostgreSQL
• MySQL

Frontend
• React.js
• Next.js
• TypeScript
• JavaScript

Tools
• Git & GitHub
• CI/CD Basics

Saya memiliki semangat belajar yang tinggi dan terus mengembangkan kemampuan backend, khususnya menggunakan Golang, melalui berbagai proyek pribadi dan implementasi fullstack. Saya siap mempelajari teknologi baru serta berkontribusi secara maksimal dalam pengembangan produk di perusahaan Bapak/Ibu.

Sebagai bahan pertimbangan, saya telah melampirkan CV pada email ini. Besar harapan saya dapat diberikan kesempatan untuk mengikuti proses wawancara agar dapat menjelaskan lebih lanjut mengenai pengalaman dan kemampuan yang saya miliki.

Terima kasih atas waktu dan perhatian Bapak/Ibu. Saya menantikan kesempatan untuk berdiskusi lebih lanjut.

Hormat saya,

Badriana
Junior Golang Developer

WhatsApp: 085887535612
Portfolio: https://portfolio-badriana.vercel.app/`;
    }
    
    return "";
}

// ==========================================
// TOAST SYSTEM
// ==========================================
function getToastContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

function showToast(message, type = 'success') {
    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
        iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'warning') {
        iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
        iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    }

    toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-message">${message}</div>
        <div class="toast-close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </div>
    `;
    
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    const autoRemoveId = setTimeout(() => dismissToast(toast), 4000);
    
    toast.querySelector('.toast-close').addEventListener('click', () => {
        clearTimeout(autoRemoveId);
        dismissToast(toast);
    });
}

function dismissToast(toast) {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
}

// ==========================================
// FORM STATE & LOGIC
// ==========================================
let activePosition = "frontend";

function getSubjectLine(type) {
    switch (type) {
        case "frontend":
            return "Application for Frontend Position - Badriana";
        case "fullstack":
            return "Application for Fullstack Developer Position - Badriana";
        case "golang":
            return "Application for Junior Golang Developer Position - Badriana";
        default:
            return "Job Application - Badriana";
    }
}

function generateEmail() {
    const hrNameInput = document.getElementById("hrName").value.trim();
    const hrName = hrNameInput || "HR Team";
    const emailToInput = document.getElementById("email").value.trim();
    
    document.getElementById("mockupTo").textContent = emailToInput || "(Silakan isi email tujuan)";
    document.getElementById("mockupSubject").textContent = getSubjectLine(activePosition);
    
    const bodyContent = getTemplate(activePosition, hrName);
    document.getElementById("previewBody").textContent = bodyContent;
}

function selectPosition(pos) {
    activePosition = pos;
    
    document.querySelectorAll(".template-card").forEach(card => {
        if (card.dataset.value === pos) {
            card.classList.add("active");
        } else {
            card.classList.remove("active");
        }
    });
    
    generateEmail();
}

function copyEmail() {
    const text = document.getElementById("previewBody").textContent;
    if (!text) {
        showToast("Tidak ada teks email untuk disalin", "warning");
        return;
    }
    
    navigator.clipboard.writeText(text)
        .then(() => showToast("Teks email berhasil disalin ke clipboard!", "success"))
        .catch(err => {
            console.error("Gagal menyalin email: ", err);
            showToast("Gagal menyalin email. Silakan coba manual.", "error");
        });
}

// ==========================================
// CV FILE ATTACHMENT HANDLER
// ==========================================
function setupCvAttachment() {
    const cvInput = document.getElementById("cvInput");
    const cvStatus = document.getElementById("cvFileStatus");
    const attachmentMockRow = document.getElementById("attachmentMockRow");
    const mockupAttachmentName = document.getElementById("mockupAttachmentName");

    if (!cvInput) return;

    cvInput.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (!file) {
            selectedCvFile = null;
            if (cvStatus) cvStatus.textContent = "Pilih file CV dari komputer Anda (Otomatis terlampir di Gmail API).";
            if (attachmentMockRow) attachmentMockRow.style.display = "none";
            return;
        }

        // Limit file size to 10MB
        if (file.size > 10 * 1024 * 1024) {
            showToast("Ukuran file CV maksimal 10MB!", "warning");
            e.target.value = "";
            selectedCvFile = null;
            if (attachmentMockRow) attachmentMockRow.style.display = "none";
            return;
        }

        const reader = new FileReader();
        reader.onload = function(evt) {
            const dataUrl = evt.target.result;
            const base64Data = dataUrl.split(',')[1];
            selectedCvFile = {
                filename: file.name,
                mimeType: file.type || "application/pdf",
                base64Data: base64Data
            };

            if (cvStatus) cvStatus.textContent = `✓ Lampiran CV "${file.name}" siap dikirim!`;
            if (attachmentMockRow) attachmentMockRow.style.display = "grid";
            if (mockupAttachmentName) mockupAttachmentName.textContent = file.name;

            showToast(`File CV "${file.name}" berhasil terlampir!`, "success");
        };
        reader.readAsDataURL(file);
    });
}

// ==========================================
// LINKEDIN POST DETECTOR LOGIC
// ==========================================

function classifyEmail(email, context) {
    const emailLower = email.toLowerCase();
    const contextLower = context.toLowerCase();
    const parts = emailLower.split('@');
    const username = parts[0] || '';
    const domain = parts[1] || '';
    
    let recruiterScore = 0;
    let candidateScore = 0;
    
    const publicDomains = ['gmail.com', 'yahoo.com', 'ymail.com', 'outlook.com', 'hotmail.com', 'live.com', 'icloud.com', 'zoho.com', 'protonmail.com', 'proton.me', 'mail.com'];
    if (!publicDomains.includes(domain)) recruiterScore += 2;
    
    if (/hr|hrd|recruitment|recruiting|recruit|career|careers|job|jobs|hiring|people|talent|info|join|apply|work|hello|loker/i.test(username)) {
        recruiterScore += 3;
    }
    
    const recruiterPhrases = [
        'kirim cv', 'kirimkan cv', 'send cv', 'send your cv', 'email your cv', 
        'email ke', 'kirim ke', 'send to', 'apply to', 'apply at', 'recruitment at', 
        'hiring at', 'loker ke', 'hubungi hrd', 'cv to', 'resume to', 'email it to',
        'we are hiring', "we're hiring", 'job opening', 'kesempatan karir'
    ];
    recruiterPhrases.forEach(phrase => {
        if (contextLower.includes(phrase)) recruiterScore += 3;
    });
    
    const candidatePhrases = [
        'email saya', 'my email', 'cv saya', 'my cv', 'resume saya', 'my resume', 
        'tertarik', 'interested', 'hubungi saya', 'contact me', 'nomor wa', 
        'no hp', 'mencari kerja', 'lulusan', 'fresh graduate', 'portofolio saya',
        'saya minat', 'ready to join', 'ini email', 'berikut email', 'silakan hubungi'
    ];
    candidatePhrases.forEach(phrase => {
        if (contextLower.includes(phrase)) candidateScore += 4;
    });
    
    if (/\bopen to work\b/i.test(contextLower) || /\bcommented\b/i.test(contextLower) || /\b1st\b|\b2nd\b|\b3rd\b/i.test(contextLower)) {
        candidateScore += 2;
    }
    
    return { isRecruiter: (recruiterScore - candidateScore) >= 0 };
}

function detectAllPositions(text) {
    const lower = text.toLowerCase();
    const found = [];
    
    const fs = lower.search(/\bfullstack\b|\bfull stack\b/);
    const fe = lower.search(/\bfrontend\b|\bfront end\b/);
    const go = lower.search(/\bgolang\b|\bgo\s*(lang|language)\b/);

    if (fs >= 0) found.push({ pos: 'fullstack', idx: fs });
    if (fe >= 0) found.push({ pos: 'frontend', idx: fe });
    if (go >= 0) found.push({ pos: 'golang', idx: go });

    if (found.length > 0) {
        found.sort((a, b) => a.idx - b.idx);
        return found.map(f => f.pos);
    }
    return ['frontend'];
}

function extractNameFromEmail(email) {
    if (!email || !email.includes('@')) return "";
    const username = email.split('@')[0].toLowerCase();
    
    // Ignore generic role usernames & recruitment bot patterns
    const genericRoles = /^(hr|hrd|recruitment|rekrutmen|recruiter|careers?|jobs?|loker|info|admin|sales|exports?|contact|hello|support|help|team|hiring|hr_rec)/i;
    if (genericRoles.test(username)) {
        return "";
    }

    // Split by dots, underscores, dashes and clean out role suffixes
    let parts = username.split(/[._-]/)
        .map(p => p.replace(/recruiter|hrd|hr|\d+/gi, '').trim())
        .filter(p => p.length >= 2);

    if (parts.length > 0 && parts.length <= 3) {
        return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
    }

    return "";
}

function detectHRName(text, email = "") {
    // 1. Extract individual recruiter name directly from email address (e.g. elvira.y, abdul.sidik, glenn.abednego, senja.recruiter)
    const emailName = extractNameFromEmail(email);
    if (emailName) {
        return emailName;
    }

    // 2. Explicit HR / Contact patterns in post body (e.g. "Attn: Ibu Rina", "Hubungi Bpk Budi")
    const explicitMatch = text.match(/(?:hubungi|contact|u\/p|up|attn|kepada|bpk|bapak|ibu|sdr|sdri)\.?\s+([A-Z][a-zA-Z]{1,20}(?:\s+[A-Z][a-zA-Z]{1,20}){0,2})/i);
    if (explicitMatch) {
        let name = explicitMatch[1].trim();
        const prefixMatch = explicitMatch[0].match(/bapak|bpk|ibu|sdr|sdri/i);
        const prefix = prefixMatch ? prefixMatch[0] + " " : "";
        if (!/(frontend|backend|fullstack|developer|engineer|hiring|job|loker)/i.test(name)) {
            return (prefix + name).trim();
        }
    }

    const hrPrefixMatch = text.match(/(?:hrd|hr|recruiter|talent acquisition)\s*[:\-]\s*([A-Z][a-zA-Z]{1,20}(?:\s+[A-Z][a-zA-Z]{1,20}){0,2})/i);
    if (hrPrefixMatch) {
        let name = hrPrefixMatch[1].trim();
        if (!/(frontend|backend|fullstack|developer|engineer|hiring|job|loker)/i.test(name)) {
            return name;
        }
    }

    // 3. Default clean fallback for company emails: Tim HRD (Sopan & Aman)
    return "Tim HRD";
}

function fillForm(data, itemEl = null) {
    document.getElementById('email').value = data.email;
    document.getElementById('hrName').value = data.hr || 'Tim HRD';
    selectPosition(data.pos);
    generateEmail();

    // Highlight active result item
    document.querySelectorAll('.result-item').forEach(el => el.classList.remove('active'));
    if (itemEl) {
        itemEl.classList.add('active');
    }

    showToast(`Form diisi dengan target email: ${data.email}`, "success");
}

function detectLinkedIn() {
    const text = document.getElementById('linkedinText').value.trim();
    const resultElement = document.getElementById('detectResult');

    if (!text) {
        resultElement.innerHTML = 'Silakan tempel teks postingan LinkedIn terlebih dahulu.';
        resultElement.className = 'detect-result warning show';
        return;
    }

    const emails = [...new Set(text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [])];

    if (emails.length === 0) {
        resultElement.innerHTML = 'Tidak ditemukan alamat email dalam postingan tersebut.';
        resultElement.className = 'detect-result warning show';
        return;
    }

    const sortedEmails = emails
        .map(email => ({ email, idx: text.indexOf(email) }))
        .sort((a, b) => a.idx - b.idx);

    const results = [];
    const candidates = [];

    sortedEmails.forEach((item, i) => {
        const classificationContext = text.substring(
            Math.max(0, item.idx - 150),
            Math.min(text.length, item.idx + 150)
        );
        const classification = classifyEmail(item.email, classificationContext);
        const hr = detectHRName(text, item.email);
        
        if (classification.isRecruiter) {
            const prevEnd = i > 0 ? sortedEmails[i - 1].idx + sortedEmails[i - 1].email.length : 0;
            const context = text.substring(prevEnd, item.idx);
            const positions = detectAllPositions(context);
            positions.forEach(pos => results.push({ email: item.email, pos, hr }));
        } else {
            candidates.push(item.email);
        }
    });

    if (results.length === 0) {
        if (candidates.length > 0) {
            resultElement.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 0.25rem;">Penyaringan Otomatis</div>
                Ditemukan email (${candidates.join(', ')}), tetapi terdeteksi sebagai pelamar/kandidat lain (Open to Work) di kolom komentar atau feed. 
                Sistem menyaringnya secara otomatis untuk mencegah salah kirim.
            `;
            resultElement.className = 'detect-result warning show';
        } else {
            resultElement.innerHTML = 'Tidak ditemukan alamat email dalam postingan tersebut.';
            resultElement.className = 'detect-result warning show';
        }
        return;
    }

    resultElement.innerHTML = '';
    resultElement.className = 'detect-result success show';

    const headerText = document.createElement('div');
    headerText.style.fontWeight = '600';
    headerText.style.marginBottom = '0.5rem';
    headerText.textContent = `Ditemukan ${results.length} potensi email lamaran:`;
    resultElement.appendChild(headerText);

    const listContainer = document.createElement('div');
    listContainer.className = 'result-list';

    results.forEach((r, idx) => {
        const item = document.createElement('div');
        item.className = 'result-item' + (idx === 0 ? ' active' : '');
        
        const posLabel = r.pos === 'frontend' ? 'Frontend' : r.pos === 'fullstack' ? 'Fullstack' : 'Golang';
        const initial = r.hr ? r.hr.charAt(0).toUpperCase() : 'HR';

        item.innerHTML = `
            <div class="result-avatar">${initial}</div>
            <div class="result-details">
                <span class="result-email">${r.email}</span>
                <div class="result-metadata">
                    <span><span class="result-meta-label">Posisi:</span> ${posLabel}</span>
                    ${r.hr ? `<span><span class="result-meta-label">HR:</span> ${r.hr}</span>` : ''}
                </div>
            </div>
            <div class="result-actions">
                <div class="result-badge">${r.pos}</div>
                <button class="btn-send-row" title="Kirim lamaran ke ${r.email}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 2px;">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    <span>Kirim</span>
                </button>
            </div>
        `;

        item.addEventListener('click', () => {
            fillForm({ email: r.email, pos: r.pos, hr: r.hr }, item);
        });

        const sendRowBtn = item.querySelector('.btn-send-row');
        sendRowBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            fillForm({ email: r.email, pos: r.pos, hr: r.hr }, item);
            sendEmailDirect(r.email, r.pos, r.hr, sendRowBtn);
        });

        listContainer.appendChild(item);
    });

    resultElement.appendChild(listContainer);

    // Auto-fill form with the first detected result immediately
    if (results.length > 0) {
        fillForm({ email: results[0].email, pos: results[0].pos, hr: results[0].hr }, listContainer.children[0]);
    }
}

// ==========================================
// SEND EMAIL DIRECTLY FROM ROW (GMAIL API)
// ==========================================
async function sendEmailDirect(email, pos, hr, button) {
    if (!email) {
        showToast("Email tujuan tidak valid!", "warning");
        return;
    }

    const hrName = hr || "HR Team";
    const subject = getSubjectLine(pos);
    const message = getTemplate(pos, hrName);

    const originalHTML = button.innerHTML;
    button.disabled = true;
    button.classList.add("sending");
    button.innerHTML = `
        <svg class="spinner" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="10"></circle>
        </svg>
    `;

    try {
        await sendEmailViaGmailApi(email, subject, message);
        button.classList.remove("sending");
        button.classList.add("success");
        button.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Terkirim</span>
        `;
    } catch (error) {
        button.disabled = false;
        button.classList.remove("sending");
        button.innerHTML = originalHTML;
    }
}

// ==========================================
// MAIN SEND EMAIL LOGIC (GMAIL API)
// ==========================================
async function sendEmail() {
    const email = document.getElementById("email").value.trim();
    if (!email) {
        showToast("Email tujuan wajib diisi!", "warning");
        document.getElementById("email").focus();
        return;
    }

    const hrNameInput = document.getElementById("hrName").value.trim();
    const hrName = hrNameInput || "HR Team";
    const subject = getSubjectLine(activePosition);
    const message = getTemplate(activePosition, hrName);
    
    const sendBtn = document.getElementById("sendBtn");
    const originalText = sendBtn.innerHTML;
    
    sendBtn.disabled = true;
    sendBtn.innerHTML = `
        <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="animation: spin 1s linear infinite; margin-right: 0.5rem; display: inline-block;">
            <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="10"></circle>
        </svg>
        Mengirim via Gmail API...
    `;

    try {
        await sendEmailViaGmailApi(email, subject, message);
    } catch (error) {
        console.error(error);
    } finally {
        sendBtn.disabled = false;
        sendBtn.innerHTML = originalText;
    }
}

// ==========================================
// MODAL CLIENT ID LOGIC
// ==========================================
function openClientModal() {
    const modal = document.getElementById("clientModal");
    const input = document.getElementById("clientIdInput");
    input.value = customClientId;
    modal.classList.add("show");
}

function closeClientModal() {
    document.getElementById("clientModal").classList.remove("show");
}

// Add spin keyframe animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ==========================================
// EVENT LISTENERS & SETUP
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".template-card").forEach(card => {
        card.addEventListener("click", () => {
            selectPosition(card.dataset.value);
        });
    });

    document.getElementById("hrName").addEventListener("input", generateEmail);
    document.getElementById("email").addEventListener("input", generateEmail);

    document.getElementById("linkedinText").addEventListener("paste", () => {
        setTimeout(detectLinkedIn, 150);
    });

    document.getElementById("detectBtn").addEventListener("click", detectLinkedIn);
    document.getElementById("copyBtn").addEventListener("click", copyEmail);
    document.getElementById("sendBtn").addEventListener("click", sendEmail);

    // Setup CV File attachment reader
    setupCvAttachment();

    // Modal Events
    document.getElementById("configBtn").addEventListener("click", openClientModal);
    document.getElementById("closeModalBtn").addEventListener("click", closeClientModal);
    document.getElementById("saveClientBtn").addEventListener("click", () => {
        const val = document.getElementById("clientIdInput").value.trim();
        customClientId = val;
        localStorage.setItem("gmail_client_id", val);
        closeClientModal();
        showToast("Client ID berhasil disimpan!", "success");
    });

    updateStatusUI();
    selectPosition("frontend");
});
