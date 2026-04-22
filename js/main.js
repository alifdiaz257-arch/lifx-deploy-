// Animasi scroll halus untuk navigasi
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Tombol Get Started
document.getElementById('getStartedBtn')?.addEventListener('click', () => {
    document.getElementById('howto')?.scrollIntoView({ behavior: 'smooth' });
});

// Tombol Cara Pakai
document.getElementById('howToUseBtn')?.addEventListener('click', () => {
    document.getElementById('howto')?.scrollIntoView({ behavior: 'smooth' });
});

// Tombol Deploy Sekarang (membuka Vercel)
document.getElementById('deployBtn')?.addEventListener('click', () => {
    window.open('https://vercel.com/new', '_blank');
});

// Fungsi Trigger Deploy Hook
const deployStatus = document.getElementById('deployStatus');
const deployHookInput = document.getElementById('deployHookUrl');
const triggerBtn = document.getElementById('triggerDeployBtn');

triggerBtn?.addEventListener('click', async () => {
    const hookUrl = deployHookInput?.value.trim();
    
    if (!hookUrl) {
        showStatus('❌ Masukkan URL Deploy Hook terlebih dahulu!', 'error');
        return;
    }
    
    // Validasi URL
    if (!hookUrl.startsWith('https://api.vercel.com/v1/integrations/deploy/')) {
        showStatus('❌ URL tidak valid! Pastikan URL adalah Deploy Hook dari Vercel.', 'error');
        return;
    }
    
    showStatus('⏳ Sedang memicu deploy...', 'loading');
    triggerBtn.disabled = true;
    
    try {
        const response = await fetch(hookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            showStatus('✅ Deploy berhasil dipicu! Vercel sedang memproses project Anda.', 'success');
            deployHookInput.value = '';
        } else {
            showStatus(`❌ Gagal memicu deploy. Status: ${response.status}`, 'error');
        }
    } catch (error) {
        showStatus('❌ Error jaringan. Pastikan koneksi internet Anda stabil.', 'error');
        console.error('Deploy error:', error);
    } finally {
        triggerBtn.disabled = false;
        setTimeout(() => {
            if (deployStatus) deployStatus.style.display = 'none';
        }, 5000);
    }
});

function showStatus(message, type) {
    if (deployStatus) {
        deployStatus.textContent = message;
        deployStatus.className = `deploy-status ${type}`;
        deployStatus.style.display = 'block';
    }
}

// Efek parallax sederhana untuk hero
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - scrolled * 0.003;
    }
});

// Animasi muncul saat scroll (fade in)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// Efek hover pada tombol
const buttons = document.querySelectorAll('.btn, .btn-deploy, .btn-trigger');
buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px)';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
    });
});

// Simpan Deploy Hook ke localStorage jika diinginkan
const savedHook = localStorage.getItem('vercel_deploy_hook');
if (savedHook && deployHookInput) {
    deployHookInput.value = savedHook;
}

triggerBtn?.addEventListener('click', () => {
    const hookUrl = deployHookInput?.value.trim();
    if (hookUrl && hookUrl.startsWith('https://api.vercel.com/')) {
        localStorage.setItem('vercel_deploy_hook', hookUrl);
    }
});

console.log('🚀 Vercel Deployer siap digunakan!');
