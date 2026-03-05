/* ============================================
   WOMEN'S DAY - MAIN SCRIPT
   ============================================ */

// =============================================
// LỜI CHÚC - THÊM/SỬA Ở ĐÂY
// =============================================
// Mỗi lời chúc gồm: name (tên người gửi), message (nội dung lời chúc)
// Để thêm lời chúc mới, copy một block {...} và sửa lại nội dung

const wishes = [
    {
        name: "Minh Quân",
        message: "Chúc các bạn nữ lớp mình luôn xinh đẹp, tự tin và tỏa sáng. Happy Women's Day! 🌸"
    },
    {
        name: "Đức Anh",
        message: "Nhân ngày 8/3, chúc các bạn nữ luôn vui vẻ, hạnh phúc và thành công trên mọi nẻo đường! 💐"
    },
    {
        name: "Hoàng Nam",
        message: "Gửi đến các bạn nữ lớp mình lời chúc tốt đẹp nhất. Các bạn xứng đáng được yêu thương mỗi ngày, không chỉ riêng ngày hôm nay! 🌹"
    },
    {
        name: "Tuấn Kiệt",
        message: "Chúc các bạn nữ có một ngày 8/3 thật đặc biệt, luôn giữ nụ cười trên môi và sống thật ý nghĩa! 🌷"
    },
    {
        name: "Văn Hùng",
        message: "Happy Women's Day! Chúc các bạn nữ lớp mình mãi mãi trẻ trung, xinh đẹp và thật nhiều niềm vui! 🌺"
    },
    {
        name: "Quốc Bảo",
        message: "Ngày 8/3 chúc các chị em lớp mình luôn khỏe mạnh, học giỏi và đạt được mọi ước mơ! 💝"
    },
    {
        name: "Thanh Tùng",
        message: "Cảm ơn các bạn nữ đã luôn là những người bạn tuyệt vời nhất. Chúc mừng ngày 8/3! 🎀"
    },
    {
        name: "Phúc Thịnh",
        message: "Chúc các bạn nữ ngày 8/3 tràn đầy hoa và nụ cười, luôn tự tin để tỏa sáng theo cách riêng của mình! ✨"
    }
];

// =============================================
// RANDOM WISH DISPLAY
// =============================================
let currentWishIndex = -1;
let autoPlayInterval = null;
let isAutoPlaying = true;
let shuffledIndices = [];
let shufflePosition = 0;

// Fisher-Yates shuffle
function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function initShuffle() {
    shuffledIndices = shuffleArray(Array.from({ length: wishes.length }, (_, i) => i));
    shufflePosition = 0;
}

function getNextIndex() {
    if (shufflePosition >= shuffledIndices.length) {
        initShuffle();
    }
    return shuffledIndices[shufflePosition++];
}

function displayWish(index) {
    const card = document.getElementById('wishCard');
    const msgEl = document.getElementById('wishMessage');
    const authorEl = document.getElementById('wishAuthor');
    const counterEl = document.getElementById('wishCounter');
    const totalEl = document.getElementById('wishTotal');

    // Fade out
    card.classList.remove('fade-in');
    card.classList.add('fade-out');

    setTimeout(() => {
        const wish = wishes[index];
        msgEl.textContent = wish.message;
        authorEl.textContent = wish.name;
        counterEl.textContent = index + 1;
        totalEl.textContent = wishes.length;
        currentWishIndex = index;

        // Fade in
        card.classList.remove('fade-out');
        card.classList.add('fade-in');
    }, 400);
}

function showNextWish() {
    const nextIndex = getNextIndex();
    displayWish(nextIndex);
}

function showPrevWish() {
    let prevIndex = currentWishIndex - 1;
    if (prevIndex < 0) prevIndex = wishes.length - 1;
    displayWish(prevIndex);
}

function toggleAutoPlay() {
    const btn = document.getElementById('autoPlayBtn');
    if (isAutoPlaying) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
        isAutoPlaying = false;
        btn.textContent = '▶';
        btn.classList.remove('active');
    } else {
        startAutoPlay();
        btn.textContent = '⏸';
        btn.classList.add('active');
    }
}

function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(showNextWish, 5000);
    isAutoPlaying = true;
    const btn = document.getElementById('autoPlayBtn');
    if (btn) {
        btn.textContent = '⏸';
        btn.classList.add('active');
    }
}

// =============================================
// ALL WISHES GRID
// =============================================
function renderWishesGrid() {
    const grid = document.getElementById('wishesGrid');
    grid.innerHTML = '';

    wishes.forEach((wish, index) => {
        const card = document.createElement('div');
        card.className = 'grid-wish-card';

        card.innerHTML = `
            <p class="grid-wish-message">"${wish.message}"</p>
            <div class="grid-wish-author">
                <div class="grid-wish-avatar">💐</div>
                <span class="grid-wish-name">${wish.name}</span>
            </div>
        `;

        grid.appendChild(card);
    });
}

// =============================================
// FULLPAGE SCROLL CONTROLLER
// =============================================
let currentSection = 0;
let isScrolling = false;
let touchStartY = 0;
let sections = [];

function initFullpage() {
    const container = document.getElementById('fullpageContainer');
    // Get all direct children that are sections (header, section, footer)
    sections = Array.from(container.querySelectorAll(':scope > header, :scope > section, :scope > footer'));

    // Position all sections stacked
    sections.forEach((section, index) => {
        section.style.transform = `translateY(${index * 100}vh)`;
    });

    // Show first section's reveal
    triggerReveal(0);

    // Mouse wheel
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Touch events for mobile
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Keyboard arrows
    document.addEventListener('keydown', handleKeydown);
}

function handleWheel(e) {
    e.preventDefault();
    if (isScrolling) return;

    // Check if we're inside a scrollable section (all-wishes grid)
    const currentEl = sections[currentSection];
    if (currentEl && currentEl.scrollHeight > currentEl.clientHeight) {
        const atTop = currentEl.scrollTop <= 0;
        const atBottom = currentEl.scrollTop + currentEl.clientHeight >= currentEl.scrollHeight - 5;

        // Allow internal scroll if not at boundary
        if (e.deltaY > 0 && !atBottom) {
            currentEl.scrollTop += 60;
            return;
        }
        if (e.deltaY < 0 && !atTop) {
            currentEl.scrollTop -= 60;
            return;
        }
    }

    if (e.deltaY > 0) {
        goToSection(currentSection + 1);
    } else if (e.deltaY < 0) {
        goToSection(currentSection - 1);
    }
}

function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
    if (isScrolling) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    // Check internal scroll for all-wishes section
    const currentEl = sections[currentSection];
    if (currentEl && currentEl.scrollHeight > currentEl.clientHeight) {
        // More lenient check for top/bottom
        const atTop = currentEl.scrollTop <= 5;
        const atBottom = currentEl.scrollTop + currentEl.clientHeight >= currentEl.scrollHeight - 5;

        // If not at boundaries, allow native scroll
        if (diff > 0 && !atBottom) return;
        if (diff < 0 && !atTop) return;
    }

    if (Math.abs(diff) > 50) { // minimum swipe distance
        if (diff > 0 && currentSection < sections.length - 1) {
            e.preventDefault();
            goToSection(currentSection + 1);
        } else if (diff < 0 && currentSection > 0) {
            e.preventDefault();
            goToSection(currentSection - 1);
        }
    }
}

function handleKeydown(e) {
    if (isScrolling) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        const currentEl = sections[currentSection];
        if (currentEl && currentEl.scrollHeight > currentEl.clientHeight) {
            const atBottom = currentEl.scrollTop + currentEl.clientHeight >= currentEl.scrollHeight - 5;
            if (!atBottom) return; // let natural scroll happen
        }
        e.preventDefault();
        goToSection(currentSection + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        const currentEl = sections[currentSection];
        if (currentEl && currentEl.scrollHeight > currentEl.clientHeight) {
            const atTop = currentEl.scrollTop <= 5;
            if (!atTop) return; // let natural scroll happen
        }
        e.preventDefault();
        goToSection(currentSection - 1);
    }
}

function goToSection(index) {
    if (index < 0 || index >= sections.length || isScrolling) return;

    isScrolling = true;
    currentSection = index;

    // Move all sections
    sections.forEach((section, i) => {
        section.style.transform = `translateY(${(i - currentSection) * 100}vh)`;
    });

    // CRITICAL: Reset scroll position to top when entering a section
    setTimeout(() => {
        if (sections[index]) {
            sections[index].scrollTop = 0;
        }
    }, 100);

    // Trigger reveal animation for current section
    triggerReveal(index);

    // Cooldown
    setTimeout(() => {
        isScrolling = false;
    }, 900);
}

function triggerReveal(index) {
    const section = sections[index];
    if (!section) return;

    // Add visible class to the section if it has 'reveal'
    if (section.classList.contains('reveal')) {
        setTimeout(() => {
            section.classList.add('visible');
        }, 200);
    }

    // Stagger grid cards if this is the all-wishes section
    const gridCards = section.querySelectorAll('.grid-wish-card');
    if (gridCards.length > 0) {
        gridCards.forEach((card, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const delay = 300 + (row * 80) + (col * 100);
            setTimeout(() => {
                card.classList.add('card-visible');
            }, delay);
        });
    }
}

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize shuffle
    initShuffle();

    // Show first wish
    const firstIndex = getNextIndex();
    displayWish(firstIndex);

    // Render all wishes grid
    renderWishesGrid();

    // Start auto play
    startAutoPlay();

    // Initialize fullpage scroll
    initFullpage();

    // Event listeners
    document.getElementById('nextWishBtn').addEventListener('click', () => {
        showNextWish();
        // Reset auto play timer
        if (isAutoPlaying) {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }
    });

    document.getElementById('prevWishBtn').addEventListener('click', () => {
        showPrevWish();
        if (isAutoPlaying) {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }
    });

    document.getElementById('autoPlayBtn').addEventListener('click', toggleAutoPlay);
});
