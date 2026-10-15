/* =========================================================================
   CryptoSub · Web3 Subscription Platform  (COMPLETE)
   Network : BNB Smart Chain Testnet (chainId 97 / 0x61)
   Payment : Native tBNB  OR  SubCoin (SUB) ERC-20 token
   =========================================================================
   ↓↓↓ WHERE TO EDIT ↓↓↓
   1. CONFIG.subToken.address  → deployed SUB contract (already set)
   2. CONFIG.treasuryAddress   → where tBNB/SUB payments go
                                 ⚠️ EMPTY = self-transfer (demo only)
                                 Set to a merchant wallet to see real deduction
   3. CONFIG.tbnbToSubRate     → demo conversion rate (1 tBNB = 1 SUB)
   ========================================================================= */

const CONFIG = {
    chainId:            '0x61',
    chainName:          'BNB Smart Chain Testnet',
    nativeCurrency:     { name: 'tBNB', symbol: 'tBNB', decimals: 18 },
    rpcUrls:            ['https://data-seed-prebsc-1-s1.bnbchain.org:8545'],
    blockExplorerUrls:  ['https://testnet.bscscan.com'],

    subToken: {
        address:  '0xcb14E5EfcaA05Dd4B20fad9bD0fa1c8A10f96DDf',
        symbol:   'SUB',
        name:     'SubCoin',
        decimals: 18,
    },

    // ⚠️ Set this to a different wallet to actually see SUB leave the user's account.
    // Empty string = transfer back to the user (self-transfer demo).
    treasuryAddress: '0x5B7011EC780a01FeAe98A89Af38427ddB7160d25',

    tbnbToSubRate: 1,
    balanceRefreshMs: 15000,
};

const ERC20_ABI = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
];

const PLATFORMS_DATA = [
    {
        id: 'chatgpt', name: 'ChatGPT Plus', category: 'ai',
        iconClass: 'fa-solid fa-robot text-emerald-400',
        description: 'เข้าถึง GPT-4o, DALL-E 3 และปลั๊กอิน AI ชั้นนำระดับโลก',
        plans: [
            { id: 'chatgpt-basic',      title: 'Basic Plan',      price: 5,  durationDays: 30, features: ['เข้าถึง GPT-3.5 Unlimited','ความเร็วการตอบกลับปกติ','สร้างภาพ 5 ภาพ/วัน'] },
            { id: 'chatgpt-pro',        title: 'Pro Plan',        price: 15, durationDays: 30, isPopular: true, features: ['เข้าถึง GPT-4o โมเดลล่าสุด','วิเคราะห์ไฟล์ & โค้ดโปรแกรม','สร้างภาพ DALL-E 3 ไม่จำกัด','สิทธิ์ลองฟีเจอร์ใหม่ก่อนใคร'] },
            { id: 'chatgpt-enterprise', title: 'Enterprise Plan', price: 30, durationDays: 30, features: ['ทุกฟีเจอร์ใน Pro Plan','ความเร็วสูงสุด High-Priority','โควต้าใช้งาน API เสริมพิเศษ','การซัพพอร์ตแบบดูแลเฉพาะบุคคล'] },
        ],
    },
    {
        id: 'netflix', name: 'Netflix Ultra 4K', category: 'streaming',
        iconClass: 'fa-solid fa-tv text-red-500',
        description: 'สตรีมมิ่งภาพยนตร์ ซีรีส์ และอนิเมะคมชัดระดับ Ultra HD 4K',
        plans: [
            { id: 'netflix-mobile',   title: 'Mobile / SD',      price: 6,  durationDays: 30, features: ['รับชมผ่านมือถือ 1 จอ','ความละเอียด SD 480p'] },
            { id: 'netflix-standard', title: 'Standard Full HD', price: 12, durationDays: 30, features: ['รับชมพร้อมกัน 2 อุปกรณ์','Full HD 1080p','ดาวน์โหลดดูออฟไลน์'] },
            { id: 'netflix-ultra',    title: 'Ultra 4K Premium', price: 18, durationDays: 30, isPopular: true, features: ['รับชมพร้อมกัน 4 อุปกรณ์','Ultra HD 4K + HDR','ระบบเสียง Spatial Audio','ดาวน์โหลดได้สูงสุด 6 เครื่อง'] },
        ],
    },
    {
        id: 'midjourney', name: 'Midjourney Pro', category: 'ai',
        iconClass: 'fa-solid fa-palette text-purple-400',
        description: 'สร้างสรรค์งานศิลปะดิจิทัลระดับมืออาชีพด้วยปัญญาประดิษฐ์',
        plans: [
            { id: 'midjourney-basic', title: 'Basic Plan', price: 8,  durationDays: 30, features: ['Fast GPU 3.3 ชม./เดือน','ใช้งานเพื่อการค้าได้'] },
            { id: 'midjourney-pro',   title: 'Pro Plan',   price: 20, durationDays: 30, isPopular: true, features: ['Fast GPU 15 ชม./เดือน','Relax GPU ไม่จำกัดชั่วโมง','โหมด Stealth ปกปิดผลงาน','รันภาพพร้อมกัน 12 คิว'] },
        ],
    },
    {
        id: 'spotify', name: 'Spotify Premium', category: 'streaming',
        iconClass: 'fa-solid fa-music text-green-400',
        description: 'ฟังเพลง พอดแคสต์ ไร้โฆษณาคั่น คุณภาพเสียงระดับ Hi-Fi',
        plans: [
            { id: 'spotify-individual', title: 'Individual Plan', price: 4, durationDays: 30, features: ['ฟังเพลงไร้โฆษณา 1 บัญชี','ดาวน์โหลดฟังออฟไลน์'] },
            { id: 'spotify-family',     title: 'Family Plan',     price: 8, durationDays: 30, isPopular: true, features: ['ใช้งานได้สูงสุด 6 บัญชี','เพลย์ลิสต์พิเศษ Family Mix','กรองเนื้อหาสำหรับเด็ก'] },
        ],
    },
    {
        id: 'canva', name: 'Canva Pro', category: 'design',
        iconClass: 'fa-solid fa-pen-nib text-cyan-400',
        description: 'ออกแบบกราฟิก วิดีโอ และสไลด์พรีเซนเทชัน ด้วยแม่แบบนับล้าน',
        plans: [
            { id: 'canva-pro', title: 'Pro Single Plan', price: 10, durationDays: 30, isPopular: true, features: ['พรีเมียมเทมเพลต 100M+','ลบพื้นหลังในคลิกเดียว','คลังภาพ & ฟอนต์ไม่จำกัด','พื้นที่คลาวด์ 1TB'] },
        ],
    },
    {
        id: 'cryptosub-vip', name: 'CryptoSub VIP Pass', category: 'crypto',
        iconClass: 'fa-solid fa-gem text-amber-400',
        description: 'สิทธิพิเศษลดค่าธรรมเนียม สมัครสมาชิกแพลตฟอร์มพันธมิตรราคาพิเศษ',
        plans: [
            { id: 'vip-pass', title: 'CryptoSub Pass (30 วัน)', price: 25, durationDays: 30, isPopular: true, features: ['ส่วนลด 15% ทุกการต่ออายุ','สิทธิ์โหวต DAO Governance','เหรียญ Cashback พิเศษกลับกระเป๋า'] },
        ],
    },
];

const STORAGE_KEY = 'CryptoSub_State_v2';

const appState = {
    walletConnected: false,
    walletMode:      null,
    walletAddress:   '',
    walletBalance:   0,
    subBalance:      0,

    provider:            null,
    signer:              null,
    subContract:         null,
    subContractWritable: null,

    activeTabCategory:      'all',
    activeManagementFilter: 'all',

    userSubscriptions:   [],
    paymentTransactions: [],

    pendingPaymentTarget: null,
    pendingPaymentMethod: 'tbnb',
    pendingCancelTarget:  null,
};

let balanceRefreshTimer = null;
let autoRefreshEnabled  = true;

/* =========================================================================
   BOOT
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    loadStateFromStorage();
    renderHeaderWalletInfo();
    renderLandingPageGrid();
    renderPlatformsPage();
    renderUserDashboard();
    renderSubscriptionManagement();
    renderPaymentHistory();
    navigateTo('landing');
    autoReconnect();
    startBalanceAutoRefresh();
});

/* =========================================================================
   STORAGE
   ========================================================================= */
function loadStateFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const p = JSON.parse(saved);
            if (Array.isArray(p.userSubscriptions))   appState.userSubscriptions   = p.userSubscriptions;
            if (Array.isArray(p.paymentTransactions)) appState.paymentTransactions = p.paymentTransactions;
            if (p.walletMode)      appState.walletMode      = p.walletMode;
            if (p.walletAddress)   appState.walletAddress   = p.walletAddress;
            if (p.walletConnected) appState.walletConnected = p.walletConnected;
        } catch (e) { console.error('Parse failed', e); }
    } else {
        appState.userSubscriptions = [
            { id: 'sub_1', platformId: 'chatgpt', platformName: 'ChatGPT Plus', planTitle: 'Pro Plan', price: 15, method: 'tBNB', startDate: isoDaysAgo(10), expiryDate: isoDaysFromNow(20), status: 'active', autoRenew: true },
            { id: 'sub_2', platformId: 'netflix', platformName: 'Netflix Ultra 4K', planTitle: 'Ultra 4K Premium', price: 18, method: 'SUB', startDate: isoDaysAgo(15), expiryDate: isoDaysFromNow(15), status: 'active', autoRenew: true },
            { id: 'sub_3', platformId: 'spotify', platformName: 'Spotify Premium', planTitle: 'Individual Plan', price: 4, method: 'tBNB', startDate: isoDaysAgo(60), expiryDate: isoDaysAgo(30), status: 'canceled', autoRenew: false },
        ];
        appState.paymentTransactions = [
            { id: 'tx_1', date: formatDateTime(new Date(Date.now() - 10*864e5)), platformName: 'ChatGPT Plus', planTitle: 'Pro Plan', amount: 15, method: 'tBNB', status: 'completed', txHash: '0x7f2a9910c842bd89ab10293847c19a8e0b91d2a4a4c8f1d6a5e0f2b19a8e0c11' },
            { id: 'tx_2', date: formatDateTime(new Date(Date.now() - 15*864e5)), platformName: 'Netflix Ultra 4K', planTitle: 'Ultra 4K Premium', amount: 18, method: 'SUB', status: 'completed', txHash: '0x3e182390a2394851029384910293847501928374a5b6c7d8e9f0a1b2c3d4e5f6071' },
        ];
        saveStateToStorage();
    }
}

function saveStateToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            userSubscriptions:   appState.userSubscriptions,
            paymentTransactions: appState.paymentTransactions,
            walletMode:          appState.walletMode,
            walletAddress:       appState.walletAddress,
            walletConnected:     appState.walletConnected,
        }));
    } catch (e) {}
}

/* =========================================================================
   UTILITIES
   ========================================================================= */
function isoDaysFromNow(days) { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().split('T')[0]; }
function isoDaysAgo(days)     { const d = new Date(); d.setDate(d.getDate() - days); return d.toISOString().split('T')[0]; }
function formatDateTime(d)    { return d.toLocaleString('th-TH', { hour12: false }).replace(',', ''); }

function shortAddr(addr, head = 6, tail = 4) {
    if (!addr || addr.length < head + tail + 2) return addr || '—';
    return `${addr.substring(0, head)}…${addr.substring(addr.length - tail)}`;
}
function calculateDaysRemaining(expiryISO) {
    const diff = new Date(expiryISO) - new Date();
    const days = Math.ceil(diff / 864e5);
    return days > 0 ? days : 0;
}
function treasuryAddress() {
    return CONFIG.treasuryAddress || appState.walletAddress || '0x0000000000000000000000000000000000000000';
}
function bscTxUrl(h)       { return `https://testnet.bscscan.com/tx/${h}`; }
function bscTokenUrl(a)    { return `https://testnet.bscscan.com/token/${a}`; }
function bscAddressUrl(a)  { return `https://testnet.bscscan.com/address/${a}`; }

/* =========================================================================
   NAVIGATION
   ========================================================================= */
function navigateTo(pageId) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
    const target = document.getElementById(`page-${pageId}`);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active-nav-item', 'text-yellow-400'));
    const active = document.getElementById(`nav-${pageId}`);
    if (active) active.classList.add('active-nav-item', 'text-yellow-400');

    if (pageId === 'dashboard')     renderUserDashboard();
    if (pageId === 'subscriptions') renderSubscriptionManagement();
    if (pageId === 'history')       renderPaymentHistory();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('hidden');
}

/* =========================================================================
   WALLET
   ========================================================================= */
async function ensureTestnet() {
    if (!window.ethereum) throw new Error('MetaMask not detected');
    const current = await window.ethereum.request({ method: 'eth_chainId' });
    if (current === CONFIG.chainId) return;

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: CONFIG.chainId }],
        });
    } catch (e) {
        if (e.code === 4902 || e.code === -32603) {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId:           CONFIG.chainId,
                    chainName:         CONFIG.chainName,
                    nativeCurrency:    CONFIG.nativeCurrency,
                    rpcUrls:           CONFIG.rpcUrls,
                    blockExplorerUrls: CONFIG.blockExplorerUrls,
                }],
            });
        } else {
            throw e;
        }
    }
}

async function connectMetaMask() {
    if (typeof window.ethereum === 'undefined') {
        showNotification('ไม่พบ MetaMask — กรุณาติดตั้งจาก metamask.io', 'error');
        return;
    }
    try {
        await ensureTestnet();

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) throw new Error('No accounts returned');

        appState.provider = new ethers.BrowserProvider(window.ethereum);
        appState.signer   = await appState.provider.getSigner();

        appState.walletAddress   = accounts[0];
        appState.walletConnected = true;
        appState.walletMode      = 'metamask';

        appState.subContract         = new ethers.Contract(CONFIG.subToken.address, ERC20_ABI, appState.provider);
        appState.subContractWritable = new ethers.Contract(CONFIG.subToken.address, ERC20_ABI, appState.signer);

        try { await appState.subContract.symbol(); }
        catch (e) { console.warn('SUB token read failed — check address/network.', e); }

        saveStateToStorage();
        renderHeaderWalletInfo();
        await refreshWalletBalances(true);

        closeWalletModal();
        showNotification('เชื่อมต่อ MetaMask สำเร็จ · BSC Testnet', 'success');

        wireMetaMaskEvents();
    } catch (err) {
        console.error(err);
        showNotification(err.message || 'เชื่อมต่อ MetaMask ไม่สำเร็จ', 'error');
    }
}

function connectDemoWallet() {
    appState.walletConnected = true;
    appState.walletMode      = 'demo';
    appState.walletAddress   = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    appState.walletBalance   = 100.0;
    appState.subBalance      = 500.0;

    saveStateToStorage();
    renderHeaderWalletInfo();
    renderUserDashboard();
    renderWalletModal();
    closeWalletModal();
    showNotification('เชื่อมต่อ Demo Wallet · 100 tBNB + 500 SUB', 'success');
}

function disconnectWallet() {
    Object.assign(appState, {
        walletConnected: false,
        walletMode:      null,
        walletAddress:   '',
        walletBalance:   0,
        subBalance:      0,
        provider:        null,
        signer:          null,
        subContract:     null,
        subContractWritable: null,
    });
    saveStateToStorage();
    renderHeaderWalletInfo();
    renderUserDashboard();
    renderWalletModal();
    closeWalletModal();
    showNotification('ตัดการเชื่อมต่อกระเป๋าแล้ว', 'info');
}

function wireMetaMaskEvents() {
    if (!window.ethereum || window.ethereum._csWired) return;
    window.ethereum._csWired = true;

    window.ethereum.on('accountsChanged', async (accounts) => {
        if (!accounts || accounts.length === 0) { disconnectWallet(); return; }
        appState.walletAddress = accounts[0];
        if (appState.provider) {
            appState.signer = await appState.provider.getSigner();
            appState.subContractWritable = new ethers.Contract(CONFIG.subToken.address, ERC20_ABI, appState.signer);
        }
        saveStateToStorage();
        renderHeaderWalletInfo();
        await refreshWalletBalances(true);
        showNotification('เปลี่ยนบัญชีเป็น ' + shortAddr(accounts[0]), 'info');
    });

    window.ethereum.on('chainChanged', () => {
        showNotification('เครือข่ายเปลี่ยน — กำลังโหลดใหม่', 'info');
        setTimeout(() => location.reload(), 600);
    });
}

async function autoReconnect() {
    if (typeof window.ethereum === 'undefined') return;
    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
            const chain = await window.ethereum.request({ method: 'eth_chainId' });
            if (chain === CONFIG.chainId) await connectMetaMask();
        }
    } catch (e) {}
}

/* =========================================================================
   BALANCES
   ========================================================================= */
async function refreshWalletBalances(showToast = false) {
    if (!appState.walletConnected) return;

    if (appState.walletMode === 'demo') {
        renderHeaderWalletInfo();
        renderUserDashboard();
        renderWalletModal();
        return;
    }

    try {
        if (!appState.provider)    appState.provider    = new ethers.BrowserProvider(window.ethereum);
        if (!appState.subContract) appState.subContract = new ethers.Contract(CONFIG.subToken.address, ERC20_ABI, appState.provider);

        const [bnbWei, subRaw] = await Promise.all([
            appState.provider.getBalance(appState.walletAddress),
            appState.subContract.balanceOf(appState.walletAddress),
        ]);

        appState.walletBalance = parseFloat(ethers.formatEther(bnbWei));
        appState.subBalance    = parseFloat(ethers.formatUnits(subRaw, CONFIG.subToken.decimals));

        renderHeaderWalletInfo();
        renderUserDashboard();
        renderWalletModal();

        if (showToast) showNotification('อัปเดตยอดเงินจาก BSC Testnet แล้ว', 'success');
    } catch (err) {
        console.error('Balance refresh failed:', err);
        if (showToast) showNotification('ดึงยอดเงินไม่สำเร็จ: ' + (err.message || 'unknown'), 'error');
    }
}

function startBalanceAutoRefresh() {
    if (balanceRefreshTimer) clearInterval(balanceRefreshTimer);
    balanceRefreshTimer = setInterval(() => {
        if (autoRefreshEnabled && appState.walletConnected && appState.walletMode === 'metamask') {
            refreshWalletBalances(false);
        }
    }, CONFIG.balanceRefreshMs);
}

function toggleAutoRefresh() {
    autoRefreshEnabled = document.getElementById('setting-autorefresh').checked;
    showNotification(autoRefreshEnabled ? 'เปิดรีเฟรชอัตโนมัติ (15s)' : 'ปิดรีเฟรชอัตโนมัติ', 'info');
}

/* =========================================================================
   HEADER / WALLET MODAL
   ========================================================================= */
function renderHeaderWalletInfo() {
    const btnText = document.getElementById('walletBtnText');
    if (!btnText) return;
    const netDot = document.getElementById('net-dot');
    const netLbl = document.getElementById('net-label');

    if (appState.walletConnected) {
        btnText.textContent = `${shortAddr(appState.walletAddress, 4, 4)} · ${appState.walletBalance.toFixed(3)} tBNB`;
        if (netDot) netDot.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
        if (netLbl) netLbl.textContent = appState.walletMode === 'metamask' ? 'BSC Testnet (97) · Live' : 'BSC Testnet (97) · Demo';
    } else {
        btnText.textContent = 'เชื่อมต่อกระเป๋าเงิน';
        if (netDot) netDot.className = 'w-2 h-2 rounded-full bg-slate-500';
        if (netLbl) netLbl.textContent = 'BSC Testnet (97)';
    }
}

function openWalletModal()  { renderWalletModal(); document.getElementById('walletModal').classList.remove('hidden'); }
function closeWalletModal() { document.getElementById('walletModal').classList.add('hidden'); }

function renderWalletModal() {
    const status = document.getElementById('modal-wallet-connected-status');
    if (!status) return;
    const modeEl = document.getElementById('modal-wallet-mode');
    const addrEl = document.getElementById('modal-wallet-address');
    const balEl  = document.getElementById('modal-wallet-balance');
    const subEl  = document.getElementById('modal-sub-balance');
    const discon = document.getElementById('modal-disconnect-btn');

    if (appState.walletConnected) {
        status.textContent = 'เชื่อมต่อแล้ว 🟢';
        status.className   = 'font-bold text-emerald-400';
        modeEl.textContent = appState.walletMode === 'metamask' ? 'MetaMask (Live)' : 'Demo Wallet';
        addrEl.textContent = appState.walletAddress;
        balEl.textContent  = appState.walletBalance.toFixed(4);
        subEl.textContent  = appState.subBalance.toFixed(2);
        discon.classList.remove('hidden');
    } else {
        status.textContent = 'ยังไม่ได้เชื่อมต่อ 🔴';
        status.className   = 'font-bold text-rose-400';
        modeEl.textContent = '—';
        addrEl.textContent = '0x00...0000';
        balEl.textContent  = '0.0000';
        subEl.textContent  = '0.00';
        discon.classList.add('hidden');
    }
}

/* =========================================================================
   LANDING
   ========================================================================= */
function renderLandingPageGrid() {
    const grid = document.getElementById('landing-platform-grid');
    if (!grid) return;
    grid.innerHTML = '';

    PLATFORMS_DATA.forEach(p => {
        const popular = p.plans.find(x => x.isPopular) || p.plans[0];
        const card = document.createElement('div');
        card.className = 'glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-yellow-500/40 transition group';
        card.innerHTML = `
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <div class="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl">
                        <i class="${p.iconClass}"></i>
                    </div>
                    <span class="bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase">
                        เริ่มต้น ${popular.price} tBNB / SUB
                    </span>
                </div>
                <div>
                    <h3 class="font-bold text-lg text-white group-hover:text-yellow-400 transition">${p.name}</h3>
                    <p class="text-xs text-slate-400 line-clamp-2 mt-1">${p.description}</p>
                </div>
            </div>
            <div class="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span class="text-xs text-slate-400">${popular.title}</span>
                <button onclick="navigateTo('platforms')" class="text-xs font-bold text-yellow-400 hover:text-yellow-300 flex items-center space-x-1">
                    <span>สมัครใช้งาน</span>
                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
            </div>`;
        grid.appendChild(card);
    });

    const activeCount = appState.userSubscriptions.filter(s => s.status === 'active').length;
    const totalTbnb = appState.paymentTransactions.filter(t => t.method !== 'SUB').reduce((s, t) => s + t.amount, 0);
    const totalSub  = appState.paymentTransactions.filter(t => t.method === 'SUB').reduce((s, t) => s + t.amount, 0);

    const el1 = document.getElementById('stat-total-paid');
    if (el1) el1.textContent = `${totalTbnb.toFixed(0)} tBNB + ${totalSub.toFixed(0)} SUB`;
    const el2 = document.getElementById('stat-active-subs');
    if (el2) el2.textContent = activeCount;
    const el3 = document.getElementById('stat-platform-count');
    if (el3) el3.textContent = PLATFORMS_DATA.length;
}

/* =========================================================================
   PLATFORMS PAGE
   ========================================================================= */
function filterPlatforms(cat) {
    appState.activeTabCategory = cat;
    document.querySelectorAll('.cat-tab').forEach(t => {
        t.className = 'cat-tab px-4 py-2 rounded-xl text-sm font-medium bg-slate-800/80 text-slate-300 hover:text-white transition';
    });
    const active = document.getElementById(`tab-${cat}`);
    if (active) active.className = 'cat-tab px-4 py-2 rounded-xl text-sm font-semibold bg-yellow-500 text-slate-950 transition';
    renderPlatformsPage();
}

function renderPlatformsPage() {
    const container = document.getElementById('platform-plans-container');
    if (!container) return;
    container.innerHTML = '';

    const list = appState.activeTabCategory === 'all'
        ? PLATFORMS_DATA
        : PLATFORMS_DATA.filter(p => p.category === appState.activeTabCategory);

    list.forEach(p => {
        const section = document.createElement('div');
        section.className = 'space-y-4';

        let plansHTML = '';
        p.plans.forEach(plan => {
            const border = plan.isPopular ? 'border-2 border-yellow-500/80 bg-slate-900/90 shadow-xl' : 'glass-card';
            plansHTML += `
                <div class="${border} p-6 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
                    ${plan.isPopular ? `<div class="absolute top-0 right-0 bg-yellow-500 text-slate-950 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">แนะนำ</div>` : ''}
                    <div class="space-y-4">
                        <div>
                            <h4 class="text-lg font-bold text-white">${plan.title}</h4>
                            <div class="flex items-baseline space-x-1 mt-2">
                                <span class="text-3xl font-black text-yellow-400">${plan.price}</span>
                                <span class="text-xs text-slate-400 font-semibold">tBNB หรือ SUB / ${plan.durationDays} วัน</span>
                            </div>
                        </div>
                        <ul class="space-y-2 text-xs text-slate-300">
                            ${plan.features.map(f => `<li class="flex items-start space-x-2"><i class="fa-solid fa-circle-check text-emerald-400 mt-0.5"></i><span>${f}</span></li>`).join('')}
                        </ul>
                    </div>
                    <button onclick="initiateSubscriptionModal('${p.id}', '${plan.id}')" class="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition">
                        สมัครสมาชิก (${plan.price} tBNB / SUB)
                    </button>
                </div>`;
        });

        section.innerHTML = `
            <div class="flex items-center space-x-3 border-b border-slate-800/80 pb-3">
                <div class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl">
                    <i class="${p.iconClass}"></i>
                </div>
                <div>
                    <h3 class="text-xl font-black text-white">${p.name}</h3>
                    <p class="text-xs text-slate-400">${p.description}</p>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">${plansHTML}</div>`;
        container.appendChild(section);
    });
}

/* =========================================================================
   DASHBOARD
   ========================================================================= */
function renderUserDashboard() {
    const addrEl = document.getElementById('dash-wallet-address');
    if (!addrEl) return;

    addrEl.textContent = appState.walletConnected ? appState.walletAddress : 'ยังไม่ได้เชื่อมต่อ';
    document.getElementById('dash-wallet-balance').textContent = `${appState.walletBalance.toFixed(4)} tBNB`;
    document.getElementById('dash-sub-balance').textContent    = `${appState.subBalance.toFixed(2)} SUB`;

    const badge = document.getElementById('dash-net-badge');
    if (appState.walletConnected) {
        badge.className = 'bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-medium border border-emerald-500/30';
        badge.textContent = appState.walletMode === 'metamask' ? 'BSC Testnet · Live 🟢' : 'BSC Testnet · Demo 🧪';
    } else {
        badge.className = 'bg-slate-700/40 text-slate-300 text-xs px-2.5 py-1 rounded-full font-medium border border-slate-700';
        badge.textContent = 'ยังไม่เชื่อมต่อ';
    }

    const suffix = document.getElementById('dash-wallet-suffix');
    const link   = document.getElementById('dash-sub-link');
    if (link) link.href = bscTokenUrl(CONFIG.subToken.address);
    if (suffix) suffix.classList.toggle('hidden', !appState.walletConnected);

    const activeSubs = appState.userSubscriptions.filter(s => s.status === 'active');
    document.getElementById('user-active-count').textContent = activeSubs.length;
    const totalMonthly = activeSubs.reduce((s, x) => s + x.price, 0);
    document.getElementById('user-monthly-expense').textContent = `${totalMonthly} tBNB/SUB`;

    const today = new Date();
    const expiringSoon = activeSubs.filter(s => {
        const d = Math.ceil((new Date(s.expiryDate) - today) / 864e5);
        return d >= 0 && d <= 7;
    });
    document.getElementById('user-expiring-count').textContent = expiringSoon.length;

    const grid = document.getElementById('dashboard-active-subs-list');
    grid.innerHTML = '';

    if (activeSubs.length === 0) {
        grid.innerHTML = `
            <div class="col-span-2 glass-card p-8 rounded-2xl text-center space-y-3">
                <i class="fa-solid fa-ghost text-4xl text-slate-600"></i>
                <p class="text-sm text-slate-400">คุณยังไม่มีการสมัครสมาชิกที่เปิดใช้งานในขณะนี้</p>
                <button onclick="navigateTo('platforms')" class="px-4 py-2 bg-yellow-500 text-slate-950 font-bold rounded-xl text-xs">เลือกแพลตฟอร์มเพื่อสมัครสมาชิก</button>
            </div>`;
    } else {
        activeSubs.forEach(sub => {
            const meta = PLATFORMS_DATA.find(p => p.id === sub.platformId) || PLATFORMS_DATA[0];
            const days = calculateDaysRemaining(sub.expiryDate);
            const pct  = Math.max(0, Math.min(100, Math.round((days / 30) * 100)));
            const methodBadge = sub.method === 'SUB'
                ? `<span class="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded">SUB</span>`
                : `<span class="bg-yellow-500/20 text-yellow-400 text-[9px] font-bold px-1.5 py-0.5 rounded">tBNB</span>`;

            const card = document.createElement('div');
            card.className = 'glass-card p-5 rounded-2xl space-y-4';
            card.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-lg">
                            <i class="${meta.iconClass}"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-white text-sm">${sub.platformName}</h4>
                            <div class="flex items-center space-x-2">
                                <span class="text-[10px] text-indigo-400 font-medium">${sub.planTitle}</span>
                                ${methodBadge}
                            </div>
                        </div>
                    </div>
                    <span class="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">ใช้งานอยู่</span>
                </div>
                <div class="space-y-1.5">
                    <div class="flex justify-between text-xs">
                        <span class="text-slate-400">คงเหลือ:</span>
                        <span class="font-bold ${days <= 5 ? 'text-rose-400' : 'text-yellow-400'}">${days} วัน</span>
                    </div>
                    <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full ${days <= 5 ? 'bg-rose-500' : 'bg-yellow-500'} transition-all" style="width: ${pct}%;"></div>
                    </div>
                </div>
                <div class="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                    <span class="text-slate-400">ราคา: <span class="text-white font-bold">${sub.price} ${sub.method || 'tBNB'}</span></span>
                    <div class="space-x-2">
                        <button onclick="openRenewModalFromSubId('${sub.id}')" class="px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg font-semibold transition">ต่ออายุ</button>
                        <button onclick="navigateTo('subscriptions')" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition">จัดการ</button>
                    </div>
                </div>`;
            grid.appendChild(card);
        });
    }

    const tbody = document.getElementById('dash-recent-tx-tbody');
    tbody.innerHTML = '';
    const recent = appState.paymentTransactions.slice(0, 5);
    if (recent.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-500">ยังไม่มีประวัติการชำระเงิน</td></tr>`;
    } else {
        recent.forEach(tx => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-slate-800/40 transition';
            const mb = tx.method === 'SUB'
                ? `<span class="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded">SUB</span>`
                : `<span class="bg-yellow-500/20 text-yellow-400 text-[9px] font-bold px-1.5 py-0.5 rounded">tBNB</span>`;
            row.innerHTML = `
                <td class="p-3.5 text-slate-300">${tx.date}</td>
                <td class="p-3.5 font-bold text-white">${tx.platformName}</td>
                <td class="p-3.5 text-slate-400">${tx.planTitle}</td>
                <td class="p-3.5 font-bold text-yellow-400">${tx.amount} ${mb}</td>
                <td class="p-3.5"><span class="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-semibold">สำเร็จ</span></td>
                <td class="p-3.5 font-mono text-cyan-400"><a href="${bscTxUrl(tx.txHash)}" target="_blank" rel="noopener" class="hover:underline">${tx.txHash.substring(0, 10)}…</a></td>`;
            tbody.appendChild(row);
        });
    }
}

/* =========================================================================
   SUBSCRIPTION MANAGEMENT
   ========================================================================= */
function filterSubManagement(f) {
    appState.activeManagementFilter = f;
    document.querySelectorAll('.subm-tab').forEach(t => {
        t.className = 'subm-tab px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white transition';
    });
    const active = document.getElementById(`subm-tab-${f}`);
    if (active) active.className = 'subm-tab px-4 py-1.5 rounded-lg text-xs font-semibold bg-yellow-500 text-slate-950 transition';
    renderSubscriptionManagement();
}

function renderSubscriptionManagement() {
    const grid = document.getElementById('management-cards-grid');
    if (!grid) return;
    grid.innerHTML = '';

    let list = appState.userSubscriptions;
    if (appState.activeManagementFilter !== 'all') {
        list = list.filter(s => s.status === appState.activeManagementFilter);
    }

    if (list.length === 0) {
        grid.innerHTML = `
            <div class="col-span-2 glass-card p-12 rounded-2xl text-center space-y-3">
                <i class="fa-solid fa-folder-open text-4xl text-slate-600"></i>
                <p class="text-sm text-slate-400">ไม่พบรายการสับสคริปชันตรงตามเงื่อนไขที่เลือก</p>
            </div>`;
        return;
    }

    list.forEach(sub => {
        const meta = PLATFORMS_DATA.find(p => p.id === sub.platformId) || PLATFORMS_DATA[0];
        const days = calculateDaysRemaining(sub.expiryDate);
        const pct  = Math.max(0, Math.min(100, Math.round((days / 30) * 100)));

        let badge = '';
        if (sub.status === 'active')        badge = `<span class="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 font-semibold">เปิดใช้งานอยู่</span>`;
        else if (sub.status === 'canceled') badge = `<span class="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-1 rounded-full border border-amber-500/30 font-semibold">ยกเลิกแล้ว</span>`;
        else                                badge = `<span class="bg-rose-500/20 text-rose-400 text-xs px-2.5 py-1 rounded-full border border-rose-500/30 font-semibold">หมดอายุแล้ว</span>`;

        const mb = sub.method === 'SUB'
            ? `<span class="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">SUB</span>`
            : `<span class="bg-yellow-500/20 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded">tBNB</span>`;

        const card = document.createElement('div');
        card.className = 'glass-card p-6 rounded-2xl space-y-5';
        card.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl">
                        <i class="${meta.iconClass}"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-white text-lg">${sub.platformName}</h3>
                        <div class="flex items-center space-x-2">
                            <p class="text-xs text-indigo-400 font-medium">${sub.planTitle} · ${sub.price} ${sub.method || 'tBNB'} / 30 วัน</p>
                            ${mb}
                        </div>
                    </div>
                </div>
                ${badge}
            </div>
            <div class="bg-slate-950 p-4 rounded-xl space-y-2 text-xs border border-slate-800">
                <div class="flex justify-between text-slate-400">
                    <span>เริ่มต้น: <span class="text-slate-200 font-mono">${sub.startDate}</span></span>
                    <span>หมดอายุ: <span class="text-slate-200 font-mono">${sub.expiryDate}</span></span>
                </div>
                <div class="space-y-1 pt-1">
                    <div class="flex justify-between">
                        <span class="text-slate-400">คงเหลือ:</span>
                        <span class="font-bold text-yellow-400">${days} วัน จาก 30 วัน</span>
                    </div>
                    <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-amber-500 to-yellow-400" style="width: ${pct}%;"></div>
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-between border-t border-b border-slate-800/80 py-3 text-xs">
                <div>
                    <p class="font-semibold text-white">ต่ออายุอัตโนมัติ (Auto-Renew)</p>
                    <p class="text-[10px] text-slate-400">ตัดเงินอัตโนมัติเมื่อถึงกำหนด (Demo)</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" onchange="toggleAutoRenew('${sub.id}')" ${sub.autoRenew ? 'checked' : ''} class="sr-only peer">
                    <div class="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
            </div>
            <div class="flex flex-wrap gap-2 pt-1 text-xs">
                <button onclick="openRenewModalFromSubId('${sub.id}')" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-bold shadow-md transition">
                    <i class="fa-solid fa-arrows-rotate mr-1"></i> ต่ออายุ
                </button>
                <button onclick="navigateTo('platforms')" class="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition">เปลี่ยนแพ็กเกจ</button>
                ${sub.status === 'active' ? `
                    <button onclick="openCancelModalFromSubId('${sub.id}')" class="px-3 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold transition">
                        ยกเลิก
                    </button>` : ''}
            </div>`;
        grid.appendChild(card);
    });
}

function toggleAutoRenew(subId) {
    const sub = appState.userSubscriptions.find(s => s.id === subId);
    if (!sub) return;
    sub.autoRenew = !sub.autoRenew;
    saveStateToStorage();
    showNotification(`Auto-Renew ของ ${sub.platformName}: ${sub.autoRenew ? 'เปิด' : 'ปิด'}`, 'info');
}

/* =========================================================================
   PAYMENT FLOW
   ========================================================================= */
function initiateSubscriptionModal(platformId, planId) {
    if (!appState.walletConnected) {
        openWalletModal();
        showNotification('กรุณาเชื่อมต่อกระเป๋าเงินก่อนชำระเงิน', 'warning');
        return;
    }

    const platform = PLATFORMS_DATA.find(p => p.id === platformId);
    const plan = platform.plans.find(p => p.id === planId);
    appState.pendingPaymentTarget = { platform, plan };
    appState.pendingPaymentMethod = 'tbnb';

    document.getElementById('pay-platform-name').textContent  = platform.name;
    document.getElementById('pay-plan-name').textContent      = plan.title;
    document.getElementById('pay-wallet-address').textContent = shortAddr(appState.walletAddress, 6, 4);

    document.getElementById('pay-bal-tbnb').textContent = appState.walletBalance.toFixed(4);
    document.getElementById('pay-bal-sub').textContent  = appState.subBalance.toFixed(2);

    document.getElementById('pay-rate-note').textContent =
        `Demo rate: 1 tBNB = ${CONFIG.tbnbToSubRate} SUB · จำนวนที่ต้องชำระเท่ากันทั้งสองช่องทาง`;

    selectPaymentMethod('tbnb');

    document.getElementById('payment-step-review').classList.remove('hidden');
    document.getElementById('payment-step-processing').classList.add('hidden');
    document.getElementById('payment-step-success').classList.add('hidden');
    document.getElementById('pay-error').classList.add('hidden');

    document.getElementById('paymentModal').classList.remove('hidden');
}

function selectPaymentMethod(method) {
    if (!appState.pendingPaymentTarget) return;
    appState.pendingPaymentMethod = method;

    const tbnbBtn = document.getElementById('pay-method-tbnb');
    const subBtn  = document.getElementById('pay-method-sub');

    tbnbBtn.className = 'p-3 rounded-2xl border-2 text-left transition-all';
    subBtn.className  = 'p-3 rounded-2xl border-2 text-left transition-all';

    if (method === 'tbnb') tbnbBtn.classList.add('method-active-tbnb');
    else                   subBtn.classList.add('method-active-sub');

    const plan = appState.pendingPaymentTarget.plan;
    const display = method === 'tbnb'
        ? `${plan.price} tBNB`
        : `${(plan.price * CONFIG.tbnbToSubRate).toFixed(2)} SUB`;

    document.getElementById('pay-amount-final').textContent = display;
    document.getElementById('pay-amount-final').className =
        method === 'tbnb' ? 'text-lg font-black text-yellow-400' : 'text-lg font-black text-emerald-400';

    const required  = method === 'tbnb' ? plan.price : plan.price * CONFIG.tbnbToSubRate;
    const available = method === 'tbnb' ? appState.walletBalance : appState.subBalance;
    const errEl = document.getElementById('pay-error');
    const btn   = document.getElementById('pay-confirm-btn');

    if (available < required) {
        errEl.textContent = `ยอด ${method === 'tbnb' ? 'tBNB' : 'SUB'} ไม่เพียงพอ (ต้องการ ${required.toFixed(2)} · มี ${available.toFixed(2)})`;
        errEl.classList.remove('hidden');
        btn.disabled = true;
    } else {
        errEl.classList.add('hidden');
        btn.disabled = false;
    }

    btn.textContent = `ยืนยันชำระเงินด้วย ${method === 'tbnb' ? 'tBNB' : 'SUB'}`;
    btn.className =
        'w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ' +
        (method === 'tbnb'
            ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 shadow-yellow-500/20'
            : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20');
}

function openRenewModalFromSubId(subId) {
    const sub = appState.userSubscriptions.find(s => s.id === subId);
    if (!sub) return;
    const platform = PLATFORMS_DATA.find(p => p.id === sub.platformId) || PLATFORMS_DATA[0];
    const plan = platform.plans.find(p => p.title === sub.planTitle) || platform.plans[0];
    initiateSubscriptionModal(platform.id, plan.id);
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.add('hidden');
}

async function processPaymentTransaction() {
    const target = appState.pendingPaymentTarget;
    if (!target) return;
    const { platform, plan } = target;
    const method = appState.pendingPaymentMethod;

    document.getElementById('payment-step-review').classList.add('hidden');
    document.getElementById('payment-step-processing').classList.remove('hidden');
    document.getElementById('pay-processing-title').textContent =
        method === 'tbnb' ? 'กำลังส่งธุรกรรม tBNB ไปยัง BNB Testnet...' : 'กำลังส่งธุรกรรม SUB ไปยัง BNB Testnet...';
    document.getElementById('pay-processing-subtitle').textContent =
        appState.walletMode === 'metamask'
            ? 'กรุณายืนยันธุรกรรมใน MetaMask ของคุณ'
            : 'กำลังจำลองธุรกรรม (Demo mode)...';

    let txHash = '';
    let ok = false;
    let errorMsg = '';

    try {
        if (appState.walletMode === 'metamask') {
            txHash = await sendRealTransaction(method, plan.price);
            ok = true;
        } else {
            await new Promise(r => setTimeout(r, 1800));
            txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
            ok = true;
        }
    } catch (err) {
        console.error('Payment failed:', err);
        errorMsg = err.reason || err.shortMessage || err.message || 'Transaction failed';
        ok = false;
    }

    if (!ok) {
        document.getElementById('payment-step-processing').classList.add('hidden');
        document.getElementById('payment-step-review').classList.remove('hidden');
        const errEl = document.getElementById('pay-error');
        errEl.textContent = 'ชำระเงินไม่สำเร็จ: ' + errorMsg;
        errEl.classList.remove('hidden');
        showNotification('ชำระเงินไม่สำเร็จ: ' + errorMsg, 'error');
        return;
    }

    if (appState.walletMode !== 'metamask') {
        if (method === 'tbnb') appState.walletBalance = Math.max(0, appState.walletBalance - plan.price);
        else                   appState.subBalance    = Math.max(0, appState.subBalance - plan.price * CONFIG.tbnbToSubRate);
    }

    const today  = new Date().toISOString().split('T')[0];
    const expiry = isoDaysFromNow(plan.durationDays);

    const existingIdx = appState.userSubscriptions.findIndex(s => s.platformId === platform.id);
    if (existingIdx >= 0) {
        Object.assign(appState.userSubscriptions[existingIdx], {
            status: 'active', expiryDate: expiry, price: plan.price,
            planTitle: plan.title, method: method === 'tbnb' ? 'tBNB' : 'SUB',
        });
    } else {
        appState.userSubscriptions.unshift({
            id: 'sub_' + Date.now(),
            platformId: platform.id,
            platformName: platform.name,
            planTitle: plan.title,
            price: plan.price,
            method: method === 'tbnb' ? 'tBNB' : 'SUB',
            startDate: today,
            expiryDate: expiry,
            status: 'active',
            autoRenew: true,
        });
    }

    appState.paymentTransactions.unshift({
        id: 'tx_' + Date.now(),
        date: formatDateTime(new Date()),
        platformName: platform.name,
        planTitle: plan.title,
        amount: plan.price,
        method: method === 'tbnb' ? 'tBNB' : 'SUB',
        status: 'completed',
        txHash,
        mode: appState.walletMode,
    });

    saveStateToStorage();

    document.getElementById('payment-step-processing').classList.add('hidden');
    document.getElementById('payment-step-success').classList.remove('hidden');
    document.getElementById('pay-success-method').textContent = method === 'tbnb' ? 'tBNB (Native)' : 'SubCoin (SUB)';
    const txLink = document.getElementById('pay-success-txhash');
    txLink.textContent = `${txHash.substring(0, 12)}…${txHash.substring(txHash.length - 8)}`;
    txLink.href = bscTxUrl(txHash);
    document.getElementById('pay-success-expiry').textContent = expiry;

    await refreshWalletBalances(false);
    renderUserDashboard();
    renderSubscriptionManagement();
    renderPaymentHistory();

    showNotification(`สมัคร ${platform.name} สำเร็จ (${method.toUpperCase()})`, 'success');
}

/* =========================================================================
   REAL TRANSACTION — the actual SUB deduction lives here
   -------------------------------------------------------------------------
   tBNB path : signer.sendTransaction({ to: treasury, value })   [1 tx]
   SUB path  : contract.transfer(treasury, amount)               [1 tx]

   Amount conversion:
     human value (e.g. 15) × 10^18 → integer for the contract
     ethers.parseUnits('15', 18) === 15000000000000000000n
   ========================================================================= */
async function sendRealTransaction(method, priceAmount) {
    if (!appState.signer) throw new Error('Wallet signer unavailable — reconnect MetaMask');

    const treasury = treasuryAddress();
    if (!treasury || treasury === '0x0000000000000000000000000000000000000000') {
        throw new Error('Treasury address is not configured');
    }

    if (method === 'tbnb') {
        // --- Native tBNB transfer ---
        const value = ethers.parseEther(priceAmount.toString());
        const tx = await appState.signer.sendTransaction({ to: treasury, value });
        const receipt = await tx.wait();
        return receipt.hash || tx.hash;
    } else {
        // --- SUB ERC-20 transfer (this is the real deduction) ---
        const amount = ethers.parseUnits(
            (priceAmount * CONFIG.tbnbToSubRate).toString(),
            CONFIG.subToken.decimals
        );

        const contract = appState.subContractWritable
            || new ethers.Contract(CONFIG.subToken.address, ERC20_ABI, appState.signer);

        // Preflight: make sure user has enough SUB before popping MetaMask
        const bal = await contract.balanceOf(appState.walletAddress);
        if (bal < amount) {
            const human = ethers.formatUnits(bal, CONFIG.subToken.decimals);
            throw new Error(`SUB balance too low (need ${priceAmount}, have ${human})`);
        }

        // Pop MetaMask — user confirms — tx broadcasts — SUB is deducted on-chain
        const tx = await contract.transfer(treasury, amount);
        const receipt = await tx.wait();
        return receipt.hash || tx.hash;
    }
}

/* =========================================================================
   PAYMENT HISTORY
   ========================================================================= */
function renderPaymentHistory() {
    const tbody = document.getElementById('history-table-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const searchTerm = (document.getElementById('history-search')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('history-status-filter')?.value || 'all';

    const filtered = appState.paymentTransactions.filter(tx => {
        const matchesSearch = tx.platformName.toLowerCase().includes(searchTerm) || tx.txHash.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-slate-500">ไม่พบประวัติการชำระเงินตามเงื่อนไขที่ค้นหา</td></tr>`;
        return;
    }

    filtered.forEach(tx => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-slate-800/40 transition border-b border-slate-800/40';
        const mb = tx.method === 'SUB'
            ? `<span class="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded ml-1">SUB</span>`
            : `<span class="bg-yellow-500/20 text-yellow-400 text-[9px] font-bold px-1.5 py-0.5 rounded ml-1">tBNB</span>`;
        row.innerHTML = `
            <td class="p-4 text-slate-300 font-mono text-xs">${tx.date}</td>
            <td class="p-4 font-bold text-white">${tx.platformName}</td>
            <td class="p-4 text-slate-400">${tx.planTitle}</td>
            <td class="p-4 font-bold text-yellow-400">${tx.amount} ${mb}</td>
            <td class="p-4"><span class="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-semibold">สำเร็จ</span></td>
            <td class="p-4 font-mono text-cyan-400"><a href="${bscTxUrl(tx.txHash)}" target="_blank" rel="noopener" class="hover:underline">${tx.txHash.substring(0, 12)}…</a></td>
            <td class="p-4 text-center">
                <button onclick="showTxDetailsAlert('${tx.txHash}')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]">ดูรายละเอียด</button>
            </td>`;
        tbody.appendChild(row);
    });
}

function showTxDetailsAlert(txHash) {
    const tx = appState.paymentTransactions.find(t => t.txHash === txHash);
    if (tx) showNotification(`Tx: ${shortAddr(tx.txHash, 10, 8)} · ${tx.amount} ${tx.method}`, 'info');
}

/* =========================================================================
   CANCEL MODAL
   ========================================================================= */
function openCancelModalFromSubId(subId) {
    const sub = appState.userSubscriptions.find(s => s.id === subId);
    if (!sub) return;
    appState.pendingCancelTarget = sub;
    document.getElementById('cancel-target-platform').textContent = `${sub.platformName} - ${sub.planTitle}`;
    document.getElementById('cancel-target-expiry').textContent = sub.expiryDate;
    document.getElementById('cancelModal').classList.remove('hidden');
}

function closeCancelModal() {
    document.getElementById('cancelModal').classList.add('hidden');
}

function confirmCancelSubscriptionAction() {
    if (!appState.pendingCancelTarget) return;
    const sub = appState.userSubscriptions.find(s => s.id === appState.pendingCancelTarget.id);
    if (sub) {
        sub.status = 'canceled';
        sub.autoRenew = false;
        saveStateToStorage();
        renderSubscriptionManagement();
        renderUserDashboard();
        closeCancelModal();
        showNotification(`ยกเลิกการต่ออายุ ${sub.platformName} เรียบร้อยแล้ว`, 'info');
    }
}

/* =========================================================================
   RENEW ALL
   ========================================================================= */
function renewAllSubscriptions() {
    const activeSubs = appState.userSubscriptions.filter(s => s.status === 'active');
    if (activeSubs.length === 0) {
        showNotification('ไม่มีรายการสมัครสมาชิกที่กำลังใช้งานอยู่', 'info');
        return;
    }

    const totalCost = activeSubs.reduce((sum, s) => sum + s.price, 0);
    if (appState.walletBalance < totalCost) {
        showNotification(`ยอดเงินไม่พอสำหรับการต่ออายุทั้งหมด (${totalCost} tBNB)`, 'error');
        return;
    }

    if (appState.walletMode !== 'metamask') {
        appState.walletBalance -= totalCost;
    }

    activeSubs.forEach(s => { s.expiryDate = isoDaysFromNow(30); });
    saveStateToStorage();
    renderHeaderWalletInfo();
    renderUserDashboard();
    showNotification('ต่ออายุสับสคริปชันทั้งหมดสำเร็จเรียบร้อย!', 'success');
}

/* =========================================================================
   SETTINGS
   ========================================================================= */
function saveUserSettings() {
    showNotification('บันทึกการตั้งค่าส่วนตัวและกระเป๋าเงินเรียบร้อยแล้ว!', 'success');
}

/* =========================================================================
   NOTIFICATIONS
   ========================================================================= */
function showNotification(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-24 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto p-4 rounded-2xl shadow-2xl border text-xs font-semibold transition-all duration-300 transform translate-x-full flex items-center justify-between space-x-3';

    if (type === 'success') {
        toast.className += ' bg-slate-900 border-emerald-500/50 text-emerald-400';
        toast.innerHTML = `<i class="fa-solid fa-circle-check text-lg"></i><span>${message}</span>`;
    } else if (type === 'error') {
        toast.className += ' bg-slate-900 border-rose-500/50 text-rose-400';
        toast.innerHTML = `<i class="fa-solid fa-circle-xmark text-lg"></i><span>${message}</span>`;
    } else if (type === 'warning') {
        toast.className += ' bg-slate-900 border-amber-500/50 text-amber-400';
        toast.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-lg"></i><span>${message}</span>`;
    } else {
        toast.className += ' bg-slate-900 border-cyan-500/50 text-cyan-400';
        toast.innerHTML = `<i class="fa-solid fa-circle-info text-lg"></i><span>${message}</span>`;
    }

    container.appendChild(toast);
    setTimeout(() => toast.classList.remove('translate-x-full'), 50);
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

/* =========================================================================
   DEV TOOLS
   ========================================================================= */
function devToggleWallet() {
    appState.walletConnected = !appState.walletConnected;
    if (!appState.walletConnected) {
        appState.walletMode = null;
        appState.walletAddress = '';
        appState.walletBalance = 0;
        appState.subBalance = 0;
    } else {
        appState.walletMode = 'demo';
        appState.walletAddress = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        appState.walletBalance = 100;
        appState.subBalance = 500;
    }
    saveStateToStorage();
    renderHeaderWalletInfo();
    renderUserDashboard();
    showNotification(`สถานะกระเป๋าเงิน: ${appState.walletConnected ? 'เชื่อมต่อแล้ว' : 'ตัดการเชื่อมต่อ'}`, 'info');
}

function devAddBalance() {
    appState.walletBalance += 50.0;
    renderHeaderWalletInfo();
    renderUserDashboard();
    showNotification('เพิ่ม 50.0 tBNB เข้ากระเป๋าทดสอบเรียบร้อย!', 'success');
}

function devAddSub() {
    appState.subBalance += 100.0;
    renderHeaderWalletInfo();
    renderUserDashboard();
    showNotification('เพิ่ม 100.0 SUB เข้ากระเป๋าทดสอบเรียบร้อย!', 'success');
}

function resetDemoData() {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
}
