// ==========================================
// EMAILJS INITIALIZATION
// ==========================================
if (window.__ENV__ && window.__ENV__.EMAILJS_PUBLIC_KEY) {
    emailjs.init(window.__ENV__.EMAILJS_PUBLIC_KEY);
} else {
    console.error("EmailJS Public Key not found in __ENV__");
}

const SERVICE_ID = window.__ENV__ ? window.__ENV__.EMAILJS_SERVICE_ID : "";
const TEMPLATE_ID = window.__ENV__ ? window.__ENV__.EMAILJS_TEMPLATE_ID : "";

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
Frontend Developer`;
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
Fullstack Developer`;
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
Junior Golang Developer`;
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
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto remove
    const autoRemoveId = setTimeout(() => {
        dismissToast(toast);
    }, 4000);
    
    // Manual close button click
    toast.querySelector('.toast-close').addEventListener('click', () => {
        clearTimeout(autoRemoveId);
        dismissToast(toast);
    });
}

function dismissToast(toast) {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => {
        toast.remove();
    });
}

// ==========================================
// FORM STATE & LOGIC
// ==========================================
let activePosition = "frontend";

function getSubjectLine(type) {
    switch (type) {
        case "frontend":
            return "Application for Frontend Engineer Position - Badriana";
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
    
    // Update live mockup fields
    document.getElementById("mockupTo").textContent = emailToInput || "(Silakan isi email tujuan)";
    document.getElementById("mockupSubject").textContent = getSubjectLine(activePosition);
    
    const bodyContent = getTemplate(activePosition, hrName);
    document.getElementById("previewBody").textContent = bodyContent;
}

function selectPosition(pos) {
    activePosition = pos;
    
    // Update UI template cards active state
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
        .then(() => {
            showToast("Teks email berhasil disalin ke clipboard!", "success");
        })
        .catch(err => {
            console.error("Gagal menyalin email: ", err);
            showToast("Gagal menyalin email. Silakan coba manual.", "error");
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
    
    // 1. Domain Check
    const publicDomains = ['gmail.com', 'yahoo.com', 'ymail.com', 'outlook.com', 'hotmail.com', 'live.com', 'icloud.com', 'zoho.com', 'protonmail.com', 'proton.me', 'mail.com'];
    const isPublicDomain = publicDomains.includes(domain);
    if (!isPublicDomain) {
        recruiterScore += 2; // Corporate domains are likely recruiters
    }
    
    // 2. Username Check
    const recruiterKeywords = /hr|hrd|recruitment|recruiting|recruit|career|careers|job|jobs|hiring|people|talent|info|join|apply|work|hello|loker/i;
    if (recruiterKeywords.test(username)) {
        recruiterScore += 3;
    }
    
    // 3. Context Recruiter Phrases (specifically pointing to the email)
    const recruiterPhrases = [
        'kirim cv', 'kirimkan cv', 'send cv', 'send your cv', 'email your cv', 
        'email ke', 'kirim ke', 'send to', 'apply to', 'apply at', 'recruitment at', 
        'hiring at', 'loker ke', 'hubungi hrd', 'cv to', 'resume to', 'email it to',
        'we are hiring', "we're hiring", 'job opening', 'kesempatan karir'
    ];
    
    recruiterPhrases.forEach(phrase => {
        if (contextLower.includes(phrase)) {
            recruiterScore += 3;
        }
    });
    
    // 4. Context Candidate Phrases
    const candidatePhrases = [
        'email saya', 'my email', 'cv saya', 'my cv', 'resume saya', 'my resume', 
        'tertarik', 'interested', 'hubungi saya', 'contact me', 'nomor wa', 
        'no hp', 'mencari kerja', 'lulusan', 'fresh graduate', 'portofolio saya',
        'saya minat', 'ready to join', 'ini email', 'berikut email', 'silakan hubungi'
    ];
    
    candidatePhrases.forEach(phrase => {
        if (contextLower.includes(phrase)) {
            candidateScore += 4;
        }
    });
    
    // 5. Check if it's in a comment block / candidate post
    if (/\bopen to work\b/i.test(contextLower) || /\bcommented\b/i.test(contextLower) || /\b1st\b|\b2nd\b|\b3rd\b/i.test(contextLower)) {
        candidateScore += 2;
    }
    
    const finalScore = recruiterScore - candidateScore;
    
    return {
        isRecruiter: finalScore >= 0,
        score: finalScore
    };
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

    let scores = { frontend: 0, fullstack: 0, golang: 0 };
    if (/react|vue\.?js|angular|ui engineer|ui developer/.test(lower)) scores.frontend += 2;
    if (/html|css|javascript|typescript|tailwind/.test(lower)) scores.frontend += 1;
    if (/node|express|database|sql|postgres|mysql/.test(lower)) {
        scores.fullstack += 2;
        scores.golang += 1;
    }

    if (scores.fullstack > scores.frontend && scores.fullstack > scores.golang) return ['fullstack'];
    if (scores.golang > scores.frontend && scores.golang > scores.fullstack) return ['golang'];
    return ['frontend'];
}

function detectHRName(text) {
    const viewMatch = text.match(/View\s+(.+?)\s*[''\u2019]s\s*profile/i);
    if (viewMatch) return viewMatch[1].trim();

    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (/recruiter|hr\b|talent|hiring/i.test(lines[i])) {
            for (let j = i - 1; j >= 0 && j >= i - 3; j--) {
                const prev = lines[j].trim();
                if (prev && !prev.includes('\u2022') && !prev.includes('Follow') && prev.length < 50) {
                    return prev;
                }
            }
            break;
        }
    }

    for (const line of lines) {
        const t = line.trim();
        if (t && /^[A-Za-z\u00C0-\u0179\s'\/.]{2,50}$/.test(t) &&
            !t.includes('@') && !t.includes('http') &&
            !/(frontend|fullstack|golang|developer|engineer|hiring|experience|requirements|responsibilities)/i.test(t) &&
            t.split(/\s+/).length >= 2 && t.split(/\s+/).length <= 4) {
            return t;
        }
    }

    return '';
}

function fillForm(data) {
    document.getElementById('email').value = data.email;
    document.getElementById('hrName').value = data.hr || '';
    
    // Select position and update UI
    selectPosition(data.pos);
    
    showToast("Form berhasil terisi secara otomatis!", "success");
    
    // Smooth scroll to the form panel or preview
    document.getElementById('previewBody').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

    const hr = detectHRName(text);
    const sortedEmails = emails
        .map(email => ({ email, idx: text.indexOf(email) }))
        .sort((a, b) => a.idx - b.idx);

    const results = [];
    const candidates = [];

    sortedEmails.forEach((item, i) => {
        // Extract surrounding text for context analysis
        const classificationContext = text.substring(
            Math.max(0, item.idx - 150),
            Math.min(text.length, item.idx + 150)
        );
        const classification = classifyEmail(item.email, classificationContext);
        
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

    // Build modern results list using DOM elements to avoid injection vulnerability and manage click handlers safely
    resultElement.innerHTML = '';
    resultElement.className = 'detect-result success show';

    const headerText = document.createElement('div');
    headerText.style.fontWeight = '600';
    headerText.style.marginBottom = '0.5rem';
    headerText.textContent = `Ditemukan ${results.length} potensi email lamaran:`;
    resultElement.appendChild(headerText);

    const listContainer = document.createElement('div');
    listContainer.className = 'result-list';

    results.forEach((r, index) => {
        const item = document.createElement('div');
        item.className = 'result-item';
        
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
            fillForm({
                email: r.email,
                pos: r.pos,
                hr: r.hr
            });
        });

        const sendRowBtn = item.querySelector('.btn-send-row');
        sendRowBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            sendEmailDirect(r.email, r.pos, r.hr, sendRowBtn);
        });

        listContainer.appendChild(item);
    });

    resultElement.appendChild(listContainer);

    if (candidates.length > 0) {
        const filterNote = document.createElement('div');
        filterNote.style.fontSize = '0.75rem';
        filterNote.style.color = 'var(--text-light)';
        filterNote.style.marginTop = '0.75rem';
        filterNote.style.fontStyle = 'italic';
        filterNote.textContent = `* Sistem menyaring ${candidates.length} email milik pelamar/kandidat lain (${candidates.join(', ')}) untuk mencegah salah kirim.`;
        resultElement.appendChild(filterNote);
    }
}

// ==========================================
// SEND EMAIL DIRECTLY FROM ROW
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
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            {
                to_email: email,
                email: email,
                recipient: email,
                subject: subject,
                message: message,
                candidate_name: "Badriana"
            }
        );
        console.log("EMAILJS RESPONSE:", response);
        
        // Success state
        button.classList.remove("sending");
        button.classList.add("success");
        button.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Terkirim</span>
        `;
        showToast(`Email berhasil dikirim ke ${email}!`, "success");
    } catch (error) {
        console.error(error);
        button.disabled = false;
        button.classList.remove("sending");
        button.innerHTML = originalHTML;
        showToast(`Gagal mengirim ke ${email}: [${error.status || 'Error'}] ${error.text || 'Koneksi bermasalah'}`, "error");
    }
}

// ==========================================
// SEND EMAIL LOGIC
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
        Mengirim...
    `;

    try {
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            {
                to_email: email,
                email: email,
                recipient: email,
                subject: subject,
                message: message,
                candidate_name: "Badriana"
            }
        );
        console.log("EMAILJS RESPONSE:", response);
        showToast("Email berhasil dikirim!", "success");
    } catch (error) {
        console.error(error);
        showToast(`Gagal mengirim: [${error.status || 'Error'}] ${error.text || 'Koneksi bermasalah'}`, "error");
    } finally {
        sendBtn.disabled = false;
        sendBtn.innerHTML = originalText;
    }
}

// Add spin keyframe animation to document programmatically to avoid style pollution
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
    // Setup Position click cards listeners
    document.querySelectorAll(".template-card").forEach(card => {
        card.addEventListener("click", () => {
            selectPosition(card.dataset.value);
        });
    });

    // Auto-update preview inputs listeners
    document.getElementById("hrName").addEventListener("input", generateEmail);
    document.getElementById("email").addEventListener("input", generateEmail);

    // Auto-detect pasting LinkedIn post text
    document.getElementById("linkedinText").addEventListener("paste", () => {
        setTimeout(detectLinkedIn, 150);
    });

    // Button click triggers
    document.getElementById("detectBtn").addEventListener("click", detectLinkedIn);
    document.getElementById("copyBtn").addEventListener("click", copyEmail);
    document.getElementById("sendBtn").addEventListener("click", sendEmail);

    // Initialize first preview
    selectPosition("frontend");
});
