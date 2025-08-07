    // --- LOCALSTORAGE FUNCTIONS ---
    const STORAGE_KEY = 'cardGameState';

    function saveState() {
        try {
            const stateToSave = {
                coins: player.coins,
                tokens: player.tokens,
                eventTokens: player.eventTokens,
                collection: player.collection,
                claimedEvents: eventData.filter(e => e.claimed).map(e => e.id)
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
            console.log('Trạng thái đã được lưu vào localStorage.');
        } catch (error) {
            console.error('Không thể lưu trạng thái vào localStorage:', error);
        }
    }

    function loadState() {
        try {
            const savedState = localStorage.getItem(STORAGE_KEY);
            if (savedState) {
                const loadedState = JSON.parse(savedState);
                player.coins = loadedState.coins || 0;
                player.tokens = loadedState.tokens || 0;
                player.eventTokens = loadedState.eventTokens || 0;
                player.collection = loadedState.collection || {};

                if(loadedState.claimedEvents) {
                    eventData.forEach(event => {
                        if(loadedState.claimedEvents.includes(event.id)) {
                            event.claimed = true;
                        }
                    });
                }
                console.log('Trạng thái đã được tải từ localStorage.');
            }
        } catch (error) {
            console.error('Không thể tải trạng thái từ localStorage:', error);
        }
    }


    // --- DATA (REFACTORED WITH DYNAMIC GENERATION LOGIC) ---
    const player = {
        coins: 12500,
        tokens: 11850,
        eventTokens: 11240,
        collection: {
         
            'HANNI-rare-D-G': 1,
 
        },
    };

    const icons = {
        diamond: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.0001 1.5L22.5001 12L12.0001 22.5L1.50006 12L12.0001 1.5Z"/></svg>`,
        triangle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.0001 1.5L23.2501 21.75H0.750061L12.0001 1.5Z"/></svg>`,
        square: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3V21H21V3Z"/></svg>`
    };

    const currencyIcons = {
        coins: 'https://placehold.co/24x24/facc15/a16207?text=$',
        tokens: 'https://placehold.co/24x24/a78bfa/5b21b6?text=T',
        eventTokens: 'https://placehold.co/24x24/f472b6/9d2664?text=★'
    };

    // --- *** TÁI CẤU TRÚC LOGIC TẠO THẺ *** ---

    // 1. Định nghĩa các "Nguyên liệu"


    // 2. "Nhà máy" sản xuất thẻ: Tự động tạo cardDatabase
    let cardDatabase = [];
   
    // Shop items giờ đây cũng sẽ linh hoạt hơn

    const eventData = [
        { id: 'E002', name: 'Đăng Nhập Nhận Quà', time: 'Hôm nay', banner: 'https://placehold.co/600x250/22c55e/ffffff?text=Quà+Đăng+Nhập', rewards: [{type: 'tokens', amount: 50}, {type: 'eventTokens', amount: 20}], type: 'login', claimed: false },
        { id: 'E003', name: 'Quy Đổi Thẻ Bài', time: 'Vĩnh viễn', banner: 'https://placehold.co/600x250/a855f7/ffffff?text=Quy+Đổi+Thẻ', rewards: [], type: 'exchange' }
    ];

    // --- Các phần còn lại của mã không thay đổi ---

    // --- Game State Object ---
    let gameState = {};

    // --- DOM ELEMENTS ---
    const mainContent = document.getElementById('main-content');
    const navItems = document.querySelectorAll('.nav-item');
    const cardModal = document.getElementById('card-modal');
    const ratesModal = document.getElementById('rates-modal');
    const purchaseResultModal = document.getElementById('purchase-result-modal');

    // --- CARD HTML GENERATOR ---
   // --- CARD HTML GENERATOR ---
const createCardHTML = (card, options = {}) => {
    const isOwned = card.id in player.collection;
    
    // Thêm class độ hiếm vào thẻ chính để CSS có thể nhắm mục tiêu
    const rarityClass = `rarity-${card.rarity}`;

    const hasHoloClass = (card.rarity === 'rare' || card.rarity === 'limited') ? 'has-holo' : '';
    const unownedClass = !isOwned && options.checkOwnership ? 'unowned' : '';
    const unownedOverlay = !isOwned && options.checkOwnership ? `<div class="unowned-overlay"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg></div>` : '';
    const shapeColorClass = `color-${card.color}`;
    const rainbowClass = options?.mode === 'showcard' ? 'rainbow-loop' : '';
    const themeLabel = options.simple ? '' : `<div class="theme-label">${card.theme}</div>`;

    const currentDefense = options.currentDefense !== undefined ? options.currentDefense : card.defense;
    const defenseOverlay = options.showDefense ? `<div class="defense-overlay">HP: ${currentDefense}</div>` : '';
    const lockedClass = options.isLocked ? 'locked' : '';
    
    // **ĐÃ XÓA LOGIC TẠO HIỆU ỨNG HẠT BỤI**

    const statsContainer = options.simple ? '' : `
        <div class="stats-container">
            <div class="stats-bar">
                <div class="stat attack">${card.attack}</div>
                <div class="stat type type-${card.rarity}">${card.label}</div>
                <div class="stat defense">${card.defense}</div>
            </div>
            <div class="name-section"><h2 class="name">${card.name}</h2></div>
        </div>`;

    return `
    <div class="game-card ${rarityClass} ${hasHoloClass} ${unownedClass} ${rainbowClass} ${lockedClass}" data-card-id="${card.id}" ${options.draggable ? 'draggable="true"' : ''}>
        ${unownedOverlay}
        <img src="${card.imageUrl}" alt="${card.name}" class="card-image" onerror="this.onerror=null;this.src='https://placehold.co/300x500/cccccc/ffffff?text=Error';">
        <div class="card-overlay"></div>
        <div class="holographic-effect"></div>
        <div class="rarity-icon ${shapeColorClass}">${icons[card.shape]}</div>
        ${themeLabel}
        ${statsContainer}
        ${defenseOverlay}
    </div>`;
}

    // --- SHOP ITEM HTML GENERATOR ---
    const createShopItemHTML = (item) => {
        let cardPreviewHTML = '';
        if (item.cardId) {
            const cardInfo = findCard(item.cardId);
            if (cardInfo) {
                cardPreviewHTML = `<div class="shop-item-preview ${item.bg}"><div class="game-card">${createCardHTML(cardInfo, {simple: true})}</div></div>`;
            }
        } else {
            cardPreviewHTML = `<div class="shop-item-preview ${item.bg}"><img src="${currencyIcons.coins}" class="w-16 h-16 opacity-30"></div>`;
        }

        return `
            <div class="shop-item" data-item-id="${item.id}">
                ${cardPreviewHTML}
                <div class="shop-item-info">
                    <button class="rates-button" data-item-id="${item.id}">i</button>
                    <div>
                        <h3 class="font-bold text-white text-md">${item.name}</h3>
                        <p class="text-sm text-gray-400">${item.content}</p>
                    </div>
                    <button class="buy-button bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center gap-2 mt-3 text-sm" data-item-id="${item.id}">
                        <span>${item.price.toLocaleString('vi')}</span>
                        <img src="${currencyIcons[item.currency]}" class="w-5 h-5 rounded-full">
                    </button>
                </div>
            </div>`;
    };

    // --- RENDER FUNCTIONS ---
    const renderMainScreen = () => {
        const mainButton = document.querySelector('.bottom-nav #nav-main');
        if (mainButton && !mainButton.classList.contains('active')) {
            document.querySelector('.nav-item.active')?.classList.remove('active');
            mainButton.classList.add('active');
        }
        return `<div class="flex flex-col items-center justify-center h-full text-center animate__animated animate__fadeIn"><div class="bg-white/10 p-8 rounded-2xl shadow-lg"><h1 class="text-2xl font-bold text-white">Chào mừng bạn!</h1><p class="text-gray-300 mt-2 mb-8">Sẵn sàng cho một trận đấu mới?</p><button id="start-game-btn" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-200">Bắt đầu chơi</button></div></div>`;
    }

    const renderDecksScreen = () => {
        let html = `<div class="animate__animated animate__fadeInUp">
            <div class="custom-tabs library-tabs">
                <div class="custom-tab active" data-rarity="all">Tất cả</div>
                <div class="custom-tab" data-rarity="limited">Limited</div>
                <div class="custom-tab" data-rarity="rare">Rare</div>
                <div class="custom-tab" data-rarity="common">Common</div>
            </div>
            <div id="card-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">`;
        html += cardDatabase.map(card => createCardHTML(card, { checkOwnership: true })).join('');
        html += `</div></div>`;
        return html;
    };

    const renderEventsScreen = () => {
        let html = `<div class="animate__animated animate__fadeInUp space-y-6">
            <h1 class="text-3xl font-black text-white text-center" style="text-shadow: 0 0 10px rgba(236, 72, 153, 0.5);">Sự Kiện Nổi Bật</h1>`;
        html += eventData.map(event => {
            const buttonDisabled = event.type === 'login' && event.claimed;
            const buttonText = buttonDisabled ? 'Đã nhận' : 'Tham gia';
            const buttonClasses = buttonDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700';
            return `
            <div class="event-card">
                <img src="${event.banner}" alt="${event.name}" class="event-banner">
                <div class="event-info">
                    <h3 class="font-bold text-white text-xl">${event.name}</h3>
                    <p class="text-sm text-pink-300 font-semibold">${event.time}</p>
                    ${event.rewards.length > 0 ? `<div class="event-rewards">${event.rewards.map(r => `<div class="reward-item"><img src="${currencyIcons[r.type]}" class="w-5 h-5 rounded-full"><span>${r.amount.toLocaleString('vi')}</span></div>`).join('')}</div>` : ''}
                    <button class="event-button w-full text-white font-bold py-2 px-4 rounded-lg mt-4 ${buttonClasses}" data-event-id="${event.id}" ${buttonDisabled ? 'disabled' : ''}>${buttonText}</button>
                </div>
            </div>`;
        }).join('');
        html += `</div>`;
        return html;
    };

    const renderShopScreen = (subpage = 'main') => {
        const items = subpage === 'main' ? shopItems : eventShopItems;
        let html = `<div class="animate__animated animate__fadeInUp">
            <div class="custom-tabs shop-tabs">
                <div class="custom-tab ${subpage === 'main' ? 'active' : ''}" data-subpage="main">Cửa Hàng</div>
                <div class="custom-tab ${subpage === 'event' ? 'active' : ''}" data-subpage="event">Shop Sự Kiện</div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">${items.map(createShopItemHTML).join('')}</div>
        </div>`;
        return html;
    };

    const renderCardExchangeScreen = () => {
        const duplicates = Object.keys(player.collection).filter(id => player.collection[id] >= 2);

        const canExchange = duplicates.map(id => {
            const sourceCard = findCard(id);
            if (!sourceCard) return null;
            const options = cardDatabase.filter(c => c.name === sourceCard.name && c.id !== id && !(c.id in player.collection));
            return { sourceCard, options };
        }).filter(item => item && item.options.length > 0);

        if (canExchange.length === 0) {
            return `<div class="text-white text-center mt-8 animate__animated animate__fadeIn">
                <h2 class="text-2xl font-bold mb-2">Quy Đổi Thẻ</h2>
                <p class="text-gray-400">Bạn không có thẻ trùng (từ 2 thẻ trở lên) để quy đổi, hoặc đã sở hữu hết các thẻ cùng loại.</p>
            </div>`;
        }

        const { sourceCard, options } = canExchange[0];

        return `
        <div class="animate__animated animate__fadeInUp space-y-6">
            <h2 class="text-white text-3xl font-extrabold text-center">Quy Đổi Thẻ</h2>
            <div class="text-center text-gray-300">Dùng 2 thẻ <span class="font-bold text-white">${sourceCard.name} (${sourceCard.label})</span> để đổi lấy một thẻ mới.</div>
            <div class="flex justify-center gap-10 items-center">
                <div class="w-24 h-36 relative"> ${createCardHTML(sourceCard, {simple: true})} <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">x2</span> </div>
                <div class="text-white text-2xl font-bold">→</div>
                <div class="w-24 h-36 bg-white/10 border-2 border-dashed border-white/30 rounded-xl flex items-center justify-center relative"><span class="text-white text-4xl font-bold">?</span></div>
            </div>
            <div class="text-white text-center mt-4">
                <p class="text-lg font-semibold mb-3">Thẻ có thể nhận:</p>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center">
                    ${options.map(card => `<div class="transform scale-90">${createCardHTML(card, { checkOwnership: false })}</div>`).join('')}
                </div>
            </div>
            <div class="text-center mt-6">
                <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full shadow-lg disabled:opacity-50" onclick="confirmCardExchange('${sourceCard.id}', '${options[0].id}')">Đổi thẻ</button>
            </div>
        </div>`;
    };
    // --- LOGIC ---

   async function loadGameData() {
    try {
        // Sử dụng Promise.all để tải đồng thời 2 file, nhanh hơn
        const [cardsResponse, shopResponse] = await Promise.all([
            fetch('cards.json'), // Đảm bảo đường dẫn chính xác
            fetch('shop.json')   // Đảm bảo đường dẫn chính xác
        ]);

        if (!cardsResponse.ok) throw new Error(`Không thể tải cards.json: ${cardsResponse.status}`);
        if (!shopResponse.ok) throw new Error(`Không thể tải shop.json: ${shopResponse.status}`);

        cardDatabase = await cardsResponse.json();
        const shopData = await shopResponse.json();

        // Xử lý logic 'GROUP' cho shop items
        const processRates = (items) => {
            return items.map(item => {
                if (typeof item.rates === 'string' && item.rates.startsWith('GROUP:')) {
                    const groupName = item.rates.split(':')[1];
                    const groupCards = cardDatabase.filter(c => c.name.toUpperCase() === groupName);
                    if (groupCards.length > 0) {
                        item.rates = groupCards.map(c => ({
                            cardId: c.id,
                            rate: (100 / groupCards.length).toFixed(2)
                        }));
                    } else {
                        item.rates = []; // Không tìm thấy thẻ nào trong nhóm
                    }
                }
                return item;
            });
        };

        shopItems = processRates(shopData.mainShop);
        eventShopItems = processRates(shopData.eventShop);

        console.log(`Tải thành công: ${cardDatabase.length} thẻ, ${shopItems.length} vật phẩm chính, ${eventShopItems.length} vật phẩm sự kiện.`);

    } catch (error) {
        console.error("Không thể tải dữ liệu game:", error);
        alert("LỖI: Không thể tải dữ liệu game. Vui lòng kiểm tra console log.");
    }
}

    function renderDeckBuildingScreen() {
        const ownedCardIds = Object.keys(player.collection);
        
        const cardObjects = ownedCardIds
            .map(id => findCard(id))
            .filter(card => card !== undefined);

        let html = `
        <div class="animate__animated animate__fadeIn flex flex-col h-full">
            <div class="text-center p-4 flex-shrink-0">
                <h1 class="text-3xl font-bold text-white">Xây Dựng Bộ Bài</h1>
                <p class="text-gray-400">Chọn 12 thẻ bài để tham chiến</p>
                <p id="deck-counter" class="text-2xl font-bold text-yellow-400 mt-2">0/12</p>
            </div>
            <div id="deck-builder-grid" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 p-3 overflow-y-auto flex-grow">
                ${cardObjects.map(card => {
                    const count = player.collection[card.id];
                    return `<div class="deck-card-wrapper relative" data-card-id="${card.id}">
                                ${createCardHTML(card, { checkOwnership: false, simple: true })}
                                <span class="absolute top-1 right-1 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full">x${count}</span>
                            </div>`;
                }).join('')}
            </div>
            <div class="p-4 flex-shrink-0">
                <button id="confirm-deck-btn" class="w-full bg-green-600 text-white font-bold py-4 rounded-full shadow-lg transition-all disabled:bg-gray-500 disabled:cursor-not-allowed" disabled>
                    Bắt đầu trận đấu
                </button>
            </div>
        </div>`;
        
        mainContent.innerHTML = html;
        addDeckBuilderEventListeners();
    }

    // THAY THẾ HÀM NÀY
const renderGameScreen = () => {
    document.querySelector('.bottom-nav').style.display = 'none';
    const playerTotalCards = gameState.playerDeck.length + gameState.playerHand.length;
    const opponentTotalCards = gameState.opponentDeck.length + gameState.opponentHand.length;

    return `
    <div id="game-rules-toggle" class="rules-toggle-btn">?</div>
    <div id="game-board">
        <div class="opponent-info text-center">
            <h2 class="font-bold text-lg text-red-400">Đối Thủ</h2>
            <div class="player-stats text-md">
                <span>Điểm: <span id="opponent-score" class="font-bold text-2xl">${gameState.opponentScore}</span></span>
                <span>Bài còn lại: <span id="opponent-deck-count" class="font-bold text-2xl">${opponentTotalCards}</span></span>
            </div>
        </div>
        <div id="opponent-battle-zone" class="battle-zone">
            ${[...Array(3)].map(() => `<div class="battle-slot"><div class="card-back">?</div></div>`).join('')}
        </div>
        <div id="player-battle-zone" class="battle-zone">
            <div class="battle-slot" data-slot-index="0" data-points="1"><div class="point-value">1</div></div>
            <div class="battle-slot" data-slot-index="1" data-points="2"><div class="point-value">2</div></div>
            <div class="battle-slot" data-slot-index="2" data-points="1"><div class="point-value">1</div></div>
        </div>
        <div class="player-info text-center">
             <div class="player-stats text-md">
                <span>Điểm: <span id="player-score" class="font-bold text-2xl">${gameState.playerScore}</span></span>
                <span>Bài còn lại: <span id="player-deck-count" class="font-bold text-2xl">${playerTotalCards}</span></span>
            </div>
            <h2 class="font-bold text-lg text-blue-400">Bạn</h2>
        </div>
    </div>
    <div id="player-hand-container" class="fixed bottom-0 left-0 right-0 p-2">
        <div id="player-hand" class="player-hand mx-auto max-w-lg">
            ${gameState.playerHand.map(cardId => {
                const cardInfo = findCard(cardId);
                const isLocked = gameState.lockedCards.includes(cardId);
                // Thẻ đã dùng trong các vòng trước sẽ bị khóa
                const isUsed = gameState.playerUsedCards.includes(cardId);
                return createCardHTML(cardInfo, { isLocked: isLocked || isUsed, simple: true });
            }).join('')}
        </div>
    </div>
    <div class="game-actions">
        <button id="confirm-placement-btn" class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all disabled:bg-gray-500 disabled:cursor-not-allowed">Xác Nhận</button>
    </div>

    <div id="rules-modal" class="modal-overlay rules-modal">
        <div class="modal-content">
            <div class="p-4 border-b border-white/10"><h2 class="text-2xl font-bold text-white text-center">Luật Chơi</h2></div>
            <div class="modal-body p-4 space-y-4">
                <div>
                    <h3 class="font-bold text-lg text-yellow-300 mb-2">Ưu tiên Hệ (Shape)</h3>
                    <div class="space-y-2 text-sm">
                        <div class="rule-item"><span><span class="shape-icon">${icons.triangle}</span> Tam Giác</span> <span>></span> <span><span class="shape-icon">${icons.diamond}</span> Kim Cương & <span class="shape-icon">${icons.square}</span> Vuông</span></div>
                        <div class="rule-item"><span><span class="shape-icon">${icons.diamond}</span> Kim Cương</span> <span>></span> <span><span class="shape-icon">${icons.square}</span> Vuông</span></div>
                        <div class="text-center text-xs text-gray-400 mt-1">Hệ khắc chế gây 1.5x sát thương, bị khắc chế nhận 0.5x sát thương.</div>
                    </div>
                </div>
                 <div>
                    <h3 class="font-bold text-lg text-yellow-300 mb-2">Ưu tiên Tấn công (Màu)</h3>
                    <div class="space-y-2 text-sm">
                        <div class="rule-item"><span><div class="color-icon color-pink"></div> Hồng</span> <span>></span> <span><div class="color-icon color-green"></div> Xanh Lá & <div class="color-icon color-blue"></div> Xanh Dương</span></div>
                        <div class="rule-item"><span><div class="color-icon color-green"></div> Xanh Lá</span> <span>></span> <span><div class="color-icon color-blue"></div> Xanh Dương</span></div>
                         <div class="text-center text-xs text-gray-400 mt-1">Thẻ có màu ưu tiên hơn sẽ tấn công trước.</div>
                    </div>
                </div>
            </div>
             <div class="p-4"><button class="w-full bg-blue-500 text-white font-bold py-2 rounded-lg" onclick="document.getElementById('rules-modal').classList.remove('show')">Đã hiểu</button></div>
        </div>
    </div>
    `;
}

    // --- LOGIC ---
    function renderContent(page, subpage) {
        let content = '';
        document.getElementById('player-hand-container')?.remove();
        document.querySelector('.game-actions')?.remove();
        mainContent.className = 'flex-grow p-5 overflow-y-auto w-full max-w-screen-lg mx-auto';

        switch (page) {
            case 'main': content = renderMainScreen(); break;
            case 'decks': content = renderDecksScreen(); break;
            case 'shop': content = renderShopScreen(subpage); break;
            case 'events': content = renderEventsScreen(); break;
            case 'exchange': content = renderCardExchangeScreen(); break;
            case 'deck-builder': renderDeckBuildingScreen(); return;
            case 'game': 
                mainContent.className = 'flex-grow p-2 overflow-hidden w-full max-w-screen-lg mx-auto';
                mainContent.innerHTML = renderGameScreen(); 
                addEventListeners('game');
                return; 
            default: content = renderMainScreen();
        }
        mainContent.innerHTML = content;
        addEventListeners(page);
    }

    function addEventListeners(page) {
        if (page === 'main') {
            document.getElementById('start-game-btn')?.addEventListener('click', () => renderContent('deck-builder'));
        } else if (page === 'decks') {
            document.querySelectorAll('.library-tabs .custom-tab').forEach(tab => tab.addEventListener('click', (e) => {
                document.querySelector('.library-tabs .custom-tab.active').classList.remove('active');
                e.currentTarget.classList.add('active');
                const rarity = e.currentTarget.dataset.rarity;
                const filteredCards = rarity === 'all' ? cardDatabase : cardDatabase.filter(c => c.rarity === rarity);
                document.getElementById('card-grid').innerHTML = filteredCards.map(card => createCardHTML(card, {checkOwnership: true})).join('');
                addCardClickListeners();
            }));
            addCardClickListeners();
        } else if (page === 'shop') {
            document.querySelectorAll('.shop-tabs .custom-tab').forEach(tab => tab.addEventListener('click', (e) => {
                const newSubpage = e.currentTarget.dataset.subpage;
                renderContent('shop', newSubpage);
            }));
            addShopItemClickListeners();
        } else if (page === 'events') {
            document.querySelectorAll('.event-button').forEach(btn => btn.addEventListener('click', (e) => {
                const eventId = e.currentTarget.dataset.eventId;
                const event = eventData.find(ev => ev.id === eventId);
                if (event.type === 'exchange') {
                    renderContent('exchange');
                } else if (event.type === 'login' && !event.claimed) {
                    event.rewards.forEach(r => player[r.type] += r.amount);
                    event.claimed = true;
                    updateCurrencyDisplay();
                    saveState(); // <-- LƯU TRẠNG THÁI
                    renderContent('events');
                }
            }));
        } else if (page === 'game') {
            addGameEventListeners();
            updateConfirmButtonState();
        }
    }

    function confirmCardExchange(sourceId, targetId) {
        if (player.collection[sourceId] && player.collection[sourceId] >= 2) {
            player.collection[sourceId] -= 2;
            if (player.collection[sourceId] === 0) {
                delete player.collection[sourceId];
            }
            player.collection[targetId] = (player.collection[targetId] || 0) + 1;
            saveState(); // <-- LƯU TRẠNG THÁI
            alert('Đổi thẻ thành công!');
            renderContent('exchange');
        } else {
            alert('Không đủ thẻ để đổi!');
        }
    }

    function addCardClickListeners() {
        document.querySelectorAll('.game-card').forEach(cardEl => cardEl.addEventListener('click', () => {
            const cardId = cardEl.dataset.cardId;
            const cardInfo = findCard(cardId);
            if (cardInfo && cardId in player.collection) showCardModal(cardInfo);
        }));
    }

    function addShopItemClickListeners() {
        document.querySelectorAll('.shop-item .rates-button').forEach(btn => btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const itemId = e.currentTarget.dataset.itemId;
            const itemInfo = [...shopItems, ...eventShopItems].find(i => i.id === itemId);
            if (itemInfo) showRatesModal(itemInfo);
        }));
        document.querySelectorAll('.shop-item .buy-button').forEach(btn => btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const itemId = e.currentTarget.dataset.itemId;
            purchaseItem(itemId);
        }));
    }

    function handleNavClick(event) {
        const clickedItem = event.currentTarget;
        if (clickedItem.classList.contains('active')) return;
        if (gameState.phase && gameState.phase !== 'end') {
            if (!confirm('Bạn có chắc muốn thoát trận đấu? Toàn bộ tiến trình sẽ bị mất.')) {
                return;
            }
            gameState = {};
            document.querySelector('.bottom-nav').style.display = 'flex';
        }
        navItems.forEach(item => { item.classList.remove('active'); });
        clickedItem.classList.add('active');
        const pageName = clickedItem.id.split('-')[1];
        renderContent(pageName);
    }

    function showCardModal(cardInfo) {
        document.getElementById('card-modal-content').innerHTML = `
            <div class="text-center my-2">
                <h2 class="text-xl font-bold text-white">${cardInfo.name}</h2>
                <p class="text-sm text-gray-400">${cardInfo.theme}</p>
            </div>
            ${createCardHTML(cardInfo)}
        `;
        cardModal.classList.add('show');
        add3DEffect(cardModal.querySelector('.game-card'));
    }

   function showRatesModal(item) {
        let ratesHTML = '';
        if (item.rates && Array.isArray(item.rates)) {
            // Container cho danh sách tỷ lệ
            ratesHTML = `<div class="space-y-2">`; 
            
            ratesHTML += item.rates.map(rate => {
                let itemName = '';
                let itemGroup = ''; // Dùng cho tên nhóm/theme của thẻ
                let itemIcon = ''; // Icon đại diện

                if (rate.type === 'card') {
                    const cardInfo = findCard(rate.cardId);
                    if (cardInfo) {
                        itemName = cardInfo.name;
                        itemGroup = cardInfo.theme;
                        // Sử dụng icon hiếm và màu sắc làm biểu tượng
                        itemIcon = `<div class="rarity-icon ${'color-' + cardInfo.color} w-8 h-8 shrink-0 flex items-center justify-center rounded-full">${icons[cardInfo.shape]}</div>`;
                    } else {
                        itemName = 'Thẻ không xác định';
                        itemIcon = `<div class="w-8 h-8 shrink-0 flex items-center justify-center bg-gray-700 rounded-full">?</div>`;
                    }
                } else if (rate.type === 'currency') {
                    // Xử lý cho các loại tiền tệ
                    const currencyName = rate.currencyType.replace('eventTokens', 'Token Sự Kiện').replace('coins', 'Xu').replace('tokens', 'Token');
                    itemName = `${rate.amount.toLocaleString('vi')} ${currencyName}`;
                    itemIcon = `<img src="${currencyIcons[rate.currencyType]}" class="w-8 h-8 rounded-full shrink-0">`;
                }

                // Tạo HTML cho mỗi dòng trong danh sách
                return `
                    <div class="rate-item flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div class="flex items-center gap-4">
                            ${itemIcon}
                            <div>
                                <p class="font-bold text-white text-md">${itemName}</p>
                                ${itemGroup ? `<p class="text-xs text-gray-400">${itemGroup}</p>` : ''}
                            </div>
                        </div>
                        <p class="font-bold text-blue-300 text-xl">${rate.rate}%</p>
                    </div>
                `;
            }).join('');
            
            ratesHTML += `</div>`;
        } else {
            // Trường hợp vật phẩm mua trực tiếp, không có tỷ lệ
            ratesHTML = `<p class="text-center text-gray-400">Bạn sẽ nhận được ngay vật phẩm này sau khi mua.</p>`;
        }

        // Tạo nội dung hoàn chỉnh cho modal
        document.getElementById('rates-modal-content').innerHTML = `
            <div class="p-4 border-b border-white/10">
                <h2 class="text-xl font-bold text-white text-center">${item.name}</h2>
            </div>
            <div class="modal-body space-y-4">
                <p class="text-gray-300 text-center">${item.content}</p>
                <h3 class="font-bold text-white text-lg">Vật phẩm có thể nhận:</h3>
                <div class="max-h-64 overflow-y-auto pr-2">${ratesHTML}</div>
            </div>`;
        ratesModal.classList.add('show');
    }
    // Thay thế hàm purchaseItem cũ trong cardgame.js
function purchaseItem(itemId) {
    const item = [...shopItems, ...eventShopItems].find(i => i.id === itemId);
    if (!item) return;

    if (player[item.currency] < item.price) {
        alert('Không đủ tiền!');
        return;
    }

    player[item.currency] -= item.price;
    let receivedItems = [];
    
    // Lấy số lượng vật phẩm cần mở từ dữ liệu, mặc định là 1 nếu không có
    const rewardsToOpen = item.rewardsCount || 1;

    // Vòng lặp để "mở" nhiều lần
    for (let i = 0; i < rewardsToOpen; i++) {
        if (Array.isArray(item.rates)) {
            const randomNumber = Math.random() * 100;
            let cumulativeRate = 0;

            for (const rateInfo of item.rates) {
                cumulativeRate += parseFloat(rateInfo.rate);
                if (randomNumber <= cumulativeRate) {
                    // Logic xử lý nhận vật phẩm (giữ nguyên như cũ)
                    if (rateInfo.type === 'card') {
                        const card = findCard(rateInfo.cardId);
                        if (card) {
                            player.collection[card.id] = (player.collection[card.id] || 0) + 1;
                            receivedItems.push({ type: 'card', item: card });
                        }
                    } else if (rateInfo.type === 'currency') {
                        player[rateInfo.currencyType] += rateInfo.amount;
                        receivedItems.push({ type: 'currency', item: { ...rateInfo } });
                    }
                    // Sau khi tìm thấy một vật phẩm, thoát vòng lặp tỷ lệ và bắt đầu lần mở tiếp theo
                    break; 
                }
            }
        }
    }
    
    // Logic cho vật phẩm có cardId cố định (nếu có)
    if (item.cardId && rewardsToOpen === 1) {
         const card = findCard(item.cardId);
         if (card) {
            player.collection[card.id] = (player.collection[card.id] || 0) + 1;
            receivedItems.push({ type: 'card', item: card });
         }
    }

    updateCurrencyDisplay();
    saveState();
    // Hàm showPurchaseResultModal đã có thể xử lý một mảng nhiều vật phẩm,
    // nên không cần thay đổi ở đây.
    showPurchaseResultModal(item.name, receivedItems);
}

   // Thay thế hàm showPurchaseResultModal cũ trong cardgame.js
function showPurchaseResultModal(itemName, receivedItems) {
    let itemsHTML = receivedItems.map(received => {
        if (received.type === 'card') {
            return `<div class="transform scale-90">${createCardHTML(received.item)}</div>`;
        } else if (received.type === 'currency') {
            return `
                <div class="flex flex-col items-center justify-center bg-gray-800 rounded-lg p-4 gap-2">
                    <img src="${currencyIcons[received.item.currencyType]}" class="w-16 h-16 rounded-full">
                    <span class="font-bold text-xl text-white">+ ${received.item.amount.toLocaleString('vi')}</span>
                    <span class="text-yellow-400">${received.item.currencyType.replace('Tokens', ' Tokens')}</span>
                </div>
            `;
        }
        return '';
    }).join('');

    document.getElementById('purchase-result-content').innerHTML = `
        <div class="p-4 border-b border-white/10"><h2 class="text-xl font-bold text-white text-center">Mở ${itemName} thành công!</h2></div>
        <div class="modal-body"><p class="text-center text-gray-300 mb-4">Bạn nhận được:</p><div class="purchase-result-grid">${itemsHTML}</div></div>
        <div class="p-4"><button class="w-full bg-blue-500 text-white font-bold py-2 rounded-lg" onclick="document.getElementById('purchase-result-modal').classList.remove('show')">Đóng</button></div>`;
    purchaseResultModal.classList.add('show');
}

function add3DEffect(cardElement) {
    const holoLayer = cardElement.querySelector('.holographic-effect');

    // Hàm cập nhật hiệu ứng, dùng chung cho cả chuột và cảm ứng
    const updateTransform = (x, y) => {
        const rect = cardElement.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -12; // Lật ngược giá trị để có cảm giác tự nhiên
        const rotateY = (x - centerX) / centerX * 12;

        cardElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        if (holoLayer) {
            holoLayer.style.backgroundPosition = `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`;
        }
    };

    // --- Xử lý cho Chuột ---
    cardElement.addEventListener('mouseenter', () => {
        cardElement.style.transition = 'transform 0.1s'; // Hiệu ứng chuyển động vào nhanh
        if (holoLayer) holoLayer.style.opacity = 1;
    });

    cardElement.addEventListener('mousemove', (e) => {
        const rect = cardElement.getBoundingClientRect();
        updateTransform(e.clientX - rect.left, e.clientY - rect.top);
    });

    cardElement.addEventListener('mouseleave', () => {
        cardElement.style.transition = 'transform 0.5s ease'; // Hiệu ứng trả về mượt mà, chậm hơn
        cardElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        if (holoLayer) holoLayer.style.opacity = 0;
    });

    // --- Xử lý cho Cảm ứng (MỚI) ---
    cardElement.addEventListener('touchstart', (e) => {
        // Ngăn hành vi mặc định của trình duyệt (như cuộn trang) khi chạm vào thẻ
        e.preventDefault();
        cardElement.style.transition = 'transform 0.1s';
        if (holoLayer) holoLayer.style.opacity = 1;
        
        // Áp dụng hiệu ứng ngay tại điểm chạm đầu tiên
        const rect = cardElement.getBoundingClientRect();
        if (e.touches[0]) {
             updateTransform(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
        }
    }, { passive: false }); // passive: false là cần thiết để preventDefault() hoạt động

    cardElement.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Tiếp tục ngăn cuộn trang khi di chuyển ngón tay
        const rect = cardElement.getBoundingClientRect();
         if (e.touches[0]) {
            updateTransform(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
         }
    });

    cardElement.addEventListener('touchend', () => {
        cardElement.style.transition = 'transform 0.5s ease';
        cardElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        if (holoLayer) holoLayer.style.opacity = 0;
    });
}
            
    function updateCurrencyDisplay() {
        document.getElementById('player-coins').innerHTML = `<img src="${currencyIcons.coins}" class="currency-icon"><span>${player.coins.toLocaleString('vi')}</span>`;
        document.getElementById('player-tokens').innerHTML = `<img src="${currencyIcons.tokens}" class="currency-icon"><span>${player.tokens.toLocaleString('vi')}</span>`;
        document.getElementById('player-event-tokens').innerHTML = `<img src="${currencyIcons.eventTokens}" class="currency-icon"><span>${player.eventTokens.toLocaleString('vi')}</span>`;
    }

    // --- GAMEPLAY LOGIC ---

    function findCard(cardId) {
        return cardDatabase.find(c => c.id === cardId);
    }

    function shuffle(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    function addDeckBuilderEventListeners() {
        const cards = document.querySelectorAll('.deck-card-wrapper');
        const counter = document.getElementById('deck-counter');
        const confirmBtn = document.getElementById('confirm-deck-btn');
        let selectedDeck = []; // This will store card IDs for the deck

        cards.forEach(cardWrapper => {
            cardWrapper.addEventListener('click', () => {
                const cardId = cardWrapper.dataset.cardId;
                const cardElement = cardWrapper.querySelector('.game-card');
                const maxCount = player.collection[cardId];
                const currentCountInDeck = selectedDeck.filter(id => id === cardId).length;

                if (currentCountInDeck < maxCount && selectedDeck.length < 12) {
                    selectedDeck.push(cardId);
                } else {
                    // If card is already in the deck up to its max count, remove all instances of it
                    if (currentCountInDeck > 0) {
                        selectedDeck = selectedDeck.filter(id => id !== cardId);
                    } else if (selectedDeck.length >= 12) {
                        alert('Bộ bài đã đủ 12 thẻ!');
                    } else {
                        alert(`Bạn chỉ có ${maxCount} thẻ này!`);
                    }
                }
                
                // Update UI
                const newCountInDeck = selectedDeck.filter(id => id === cardId).length;
                const countDisplay = cardWrapper.querySelector('span');

                if (newCountInDeck > 0) {
                    cardElement.style.outline = '4px solid #34D399';
                    countDisplay.textContent = `${newCountInDeck}/${maxCount}`;
                    countDisplay.classList.add('bg-green-500');
                } else {
                    cardElement.style.outline = 'none';
                    countDisplay.textContent = `x${maxCount}`;
                    countDisplay.classList.remove('bg-green-500');
                }

                counter.textContent = `${selectedDeck.length}/12`;
                if (selectedDeck.length === 12) {
                    confirmBtn.disabled = false;
                    counter.classList.remove('text-yellow-400');
                    counter.classList.add('text-green-400');
                } else {
                    confirmBtn.disabled = true;
                    counter.classList.add('text-yellow-400');
                    counter.classList.remove('text-green-400');
                }
            });
        });

        confirmBtn.addEventListener('click', () => {
            if (selectedDeck.length === 12) {
                startGame(selectedDeck);
            }
        });
    }

    // THAY THẾ HÀM NÀY
function startGame(chosenDeck) {
    const opponentDeckIds = shuffle(cardDatabase).slice(0, 12).map(c => c.id);

    gameState = {
        playerDeck: shuffle(chosenDeck),
        opponentDeck: shuffle(opponentDeckIds),
        playerHand: [],
        opponentHand: [],
        playerSlots: [null, null, null],
        opponentSlots: [null, null, null],
        playerUsedCards: [], // Thẻ người chơi đã dùng, không thể chọn lại
        opponentUsedCards: [], // Thẻ đối thủ đã dùng
        battleData: {},
        playerScore: 0,
        opponentScore: 0,
        phase: 'placement',
        selectedCardId: null, // Để theo dõi thẻ đang được chọn (cho cảm ứng)
    };

    // Rút 5 thẻ ban đầu
    for(let i=0; i<5; i++) {
        if(gameState.playerDeck.length > 0) gameState.playerHand.push(gameState.playerDeck.pop());
        if(gameState.opponentDeck.length > 0) gameState.opponentHand.push(gameState.opponentDeck.pop());
    }

    renderContent('game');
}

   // THAY THẾ HÀM NÀY
function addGameEventListeners() {
    const gameContainer = document.getElementById('game-board').parentElement;

    // Listener cho nút luật chơi
    document.getElementById('game-rules-toggle')?.addEventListener('click', () => {
        document.getElementById('rules-modal').classList.add('show');
    });

    // Listener chính cho các hành động trong game
    gameContainer.addEventListener('click', (e) => {
        const cardElement = e.target.closest('.game-card');
        const slotElement = e.target.closest('.battle-slot');

        if (cardElement) { // Người dùng nhấn vào một thẻ bài
            handleCardClick(cardElement);
        } else if (slotElement) { // Người dùng nhấn vào một ô trống
            handleSlotClick(slotElement);
        }
    });

    document.getElementById('confirm-placement-btn')?.addEventListener('click', () => {
        if (gameState.phase === 'placement') startRound();
    });
}

function handleCardClick(cardElement) {
    const cardId = cardElement.dataset.cardId;
    if (!cardId || cardElement.classList.contains('locked')) return;

    const isCardInHand = cardElement.parentElement.id === 'player-hand';
    const isCardInSlot = cardElement.parentElement.classList.contains('battle-slot');

    if (isCardInHand) {
        // Nếu thẻ đang được chọn, bỏ chọn nó
        if (gameState.selectedCardId === cardId) {
            gameState.selectedCardId = null;
        } else { // Nếu chưa được chọn, chọn nó
            gameState.selectedCardId = cardId;
        }
    } else if (isCardInSlot) {
        // Trả thẻ từ slot về tay
        const slotIndex = parseInt(cardElement.parentElement.dataset.slotIndex);
        gameState.playerSlots[slotIndex] = null;
        gameState.playerHand.push(cardId);
        // Nếu thẻ vừa trả về đang được chọn, bỏ chọn nó
        if(gameState.selectedCardId === cardId) {
            gameState.selectedCardId = null;
        }
    }
    redrawGameBoard();
}

function handleSlotClick(slotElement) {
    if (!gameState.selectedCardId) return; // Phải chọn thẻ trước

    const targetIndex = parseInt(slotElement.dataset.slotIndex);
    const cardInTargetSlot = gameState.playerSlots[targetIndex];

    // Nếu ô đã có thẻ, không làm gì cả
    if(cardInTargetSlot) return;

    // Di chuyển thẻ được chọn từ tay vào ô
    const handIndex = gameState.playerHand.indexOf(gameState.selectedCardId);
    if (handIndex > -1) {
        gameState.playerHand.splice(handIndex, 1);
        gameState.playerSlots[targetIndex] = gameState.selectedCardId;
        gameState.selectedCardId = null; // Bỏ chọn sau khi đặt
        redrawGameBoard();
    }
}
// THAY THẾ HÀM NÀY
function redrawGameBoard() {
    const handContainer = document.getElementById('player-hand');
    const slotContainers = document.querySelectorAll('#player-battle-zone .battle-slot');

    // Cập nhật thẻ trên tay
    handContainer.innerHTML = gameState.playerHand.map(cardId => {
        const cardInfo = findCard(cardId);
        const isUsed = gameState.playerUsedCards.includes(cardId);
        const cardHTML = createCardHTML(cardInfo, { isLocked: isUsed, simple: true });
        const wrapper = document.createElement('div');
        wrapper.innerHTML = cardHTML;
        const cardElement = wrapper.firstChild;
        if (cardId === gameState.selectedCardId) {
            cardElement.classList.add('selected-card');
        }
        return cardElement.outerHTML;
    }).join('');

    // Cập nhật các ô chiến đấu
    slotContainers.forEach((slot, i) => {
        const cardId = gameState.playerSlots[i];
        slot.innerHTML = `<div class="point-value">${slot.dataset.points}</div>`; // Giữ lại điểm
        if (cardId) {
            const cardInfo = findCard(cardId);
            slot.insertAdjacentHTML('afterbegin', createCardHTML(cardInfo, { simple: true }));
        }
        // Highlight ô có thể đặt thẻ
        if (gameState.selectedCardId && !cardId) {
            slot.classList.add('highlight-slot');
        } else {
            slot.classList.remove('highlight-slot');
        }
    });
    
    // Không cần gọi lại addGameEventListeners vì đã dùng event delegation
    updateConfirmButtonState();
}

    function updateConfirmButtonState() {
        const btn = document.getElementById('confirm-placement-btn');
        if(!btn) return;
        const filledSlots = gameState.playerSlots.filter(c => c !== null).length;
        btn.disabled = filledSlots !== 3;
    }

    function aiPlaceCards() {
        gameState.opponentSlots = [null, null, null];
        let cardsToPlace = 3;
        while(cardsToPlace > 0 && gameState.opponentHand.length > 0) {
            const cardToPlace = gameState.opponentHand.pop();
            const emptySlotIndex = gameState.opponentSlots.findIndex(s => s === null);
            if (emptySlotIndex !== -1) {
                gameState.opponentSlots[emptySlotIndex] = cardToPlace;
                cardsToPlace--;
            }
        }
    }

    async function startRound() {
        gameState.phase = 'battle';
        document.getElementById('confirm-placement-btn').style.display = 'none';
        aiPlaceCards();

        const playerSlots = document.querySelectorAll('#player-battle-zone .battle-slot');
        const opponentSlots = document.querySelectorAll('#opponent-battle-zone .battle-slot');
        
        [...gameState.playerSlots, ...gameState.opponentSlots].forEach(cardId => {
            if(cardId) {
                const card = findCard(cardId);
                if(card) gameState.battleData[cardId] = card.defense;
            }
        });

        opponentSlots.forEach((slot, i) => {
            const cardId = gameState.opponentSlots[i];
            slot.innerHTML = '';
            if(cardId) {
                const cardInfo = findCard(cardId);
                if(cardInfo) slot.innerHTML = createCardHTML(cardInfo, {showDefense: true, currentDefense: gameState.battleData[cardId], simple: true});
            }
        });

        playerSlots.forEach((slot, i) => {
            const cardId = gameState.playerSlots[i];
            if(cardId) {
                const cardInfo = findCard(cardId);
                if(cardInfo) {
                    slot.innerHTML = createCardHTML(cardInfo, {showDefense: true, currentDefense: gameState.battleData[cardId], simple: true});
                    slot.innerHTML += `<div class="point-value">${slot.dataset.points}</div>`;
                }
            }
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        for (let i = 0; i < 3; i++) {
            const playerCardId = gameState.playerSlots[i];
            const opponentCardId = gameState.opponentSlots[i];
            if (playerCardId && opponentCardId) {
                const slotPoints = parseInt(playerSlots[i].dataset.points);
                await performBattle(i, playerCardId, opponentCardId, slotPoints);
            }
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        endRound();
    }

    function getDamageMultiplier(attackerShape, defenderShape) {
        if (attackerShape === defenderShape) return 1.0;
        if ((attackerShape === 'triangle' && (defenderShape === 'diamond' || defenderShape === 'square')) || (attackerShape === 'diamond' && defenderShape === 'square')) return 1.5;
        if ((attackerShape === 'diamond' && defenderShape === 'triangle') || (attackerShape === 'square' && (defenderShape === 'triangle' || defenderShape === 'diamond'))) return 0.5;
        return 1.0;
    }

    function getColorPriority(color1, color2) {
        if (color1 === color2) return 0;
        if ((color1 === 'pink' && color2 !== 'pink') || (color1 === 'green' && color2 === 'blue')) return 1;
        return -1;
    }

    async function performBattle(slotIndex, playerCardId, opponentCardId, slotPoints) {
        const playerCard = findCard(playerCardId);
        const opponentCard = findCard(opponentCardId);
        if(!playerCard || !opponentCard) return; // safety check

        const playerSlotEl = document.querySelector(`#player-battle-zone .battle-slot[data-slot-index="${slotIndex}"]`);
        const opponentSlotEl = document.querySelector(`#opponent-battle-zone .battle-slot:nth-child(${slotIndex + 1})`);
        const playerCardEl = playerSlotEl.querySelector('.game-card');
        const opponentCardEl = opponentSlotEl.querySelector('.game-card');

        const colorPriority = getColorPriority(playerCard.color, opponentCard.color);
        const playerDamage = Math.round(playerCard.attack * getDamageMultiplier(playerCard.shape, opponentCard.shape));
        const opponentDamage = Math.round(opponentCard.attack * getDamageMultiplier(opponentCard.shape, playerCard.shape));

        const performAttack = async (attackerEl, defenderEl, defenderCardId, damage) => {
            attackerEl.style.animation = 'attack-animation-improved 0.6s ease-in-out';
            await new Promise(r => setTimeout(r, 300));
            
            gameState.battleData[defenderCardId] -= damage;
            const damageText = `<div class="damage-text">-${damage}</div>`;
            defenderEl.insertAdjacentHTML('beforeend', damageText);
            defenderEl.style.animation = 'shake-animation 0.3s';

            const defenderCardInfo = findCard(defenderCardId);
            defenderEl.innerHTML = createCardHTML(defenderCardInfo, {showDefense: true, currentDefense: Math.max(0, gameState.battleData[defenderCardId]), simple: true});
            defenderEl.querySelector('.card-overlay').insertAdjacentHTML('afterend', damageText);
            if(defenderEl.parentElement.dataset.points) { defenderEl.parentElement.innerHTML += `<div class="point-value">${defenderEl.parentElement.dataset.points}</div>`;}

            await new Promise(r => setTimeout(r, 400));
            attackerEl.style.animation = '';
            defenderEl.style.animation = '';
        };

        const firstAttacker = (colorPriority > 0) ? 'player' : (colorPriority < 0) ? 'opponent' : 'simultaneous';

        if (firstAttacker === 'player') {
            await performAttack(playerCardEl, opponentCardEl, opponentCardId, playerDamage);
            if (gameState.battleData[opponentCardId] > 0) await performAttack(opponentCardEl, playerCardEl, playerCardId, opponentDamage);
        } else if (firstAttacker === 'opponent') {
            await performAttack(opponentCardEl, playerCardEl, playerCardId, opponentDamage);
            if (gameState.battleData[playerCardId] > 0) await performAttack(playerCardEl, opponentCardEl, opponentCardId, playerDamage);
        } else {
            await Promise.all([
                performAttack(playerCardEl, opponentCardEl, opponentCardId, playerDamage),
                performAttack(opponentCardEl, playerCardEl, playerCardId, opponentDamage)
            ]);
        }

        const playerHealth = gameState.battleData[playerCardId];
        const opponentHealth = gameState.battleData[opponentCardId];
        
        if (playerHealth > 0 && opponentHealth <= 0) {
            gameState.playerScore += slotPoints;
            gameState.lockedCards.push(playerCardId);
            opponentCardEl.classList.add('defeated-card');
        } else if (opponentHealth > 0 && playerHealth <= 0) {
            gameState.opponentScore += slotPoints;
            playerCardEl.classList.add('defeated-card');
        } else {
            if (playerHealth <= 0) playerCardEl.classList.add('defeated-card');
            if (opponentHealth <= 0) opponentCardEl.classList.add('defeated-card');
        }
        
        document.getElementById('player-score').textContent = gameState.playerScore;
        document.getElementById('opponent-score').textContent = gameState.opponentScore;
    }

   // THAY THẾ HÀM NÀY
function endRound() {
    let playerDrawCount = 0;

    // Di chuyển các thẻ đã dùng và tính toán số thẻ cần rút
    for(let i=0; i<3; i++) {
        const pCardId = gameState.playerSlots[i];
        const oCardId = gameState.opponentSlots[i];

        if (pCardId) {
            // Thẻ người chơi dù thắng hay thua cũng bị loại khỏi vòng đấu
            // Nếu thẻ không bị hết máu, nó sẽ vào chồng bài đã dùng
            if (gameState.battleData[pCardId] > 0) {
                gameState.playerUsedCards.push(pCardId);
            }
            // Nếu hết máu, thẻ sẽ bị loại vĩnh viễn (không cần làm gì thêm)
        }
        
        if(oCardId) {
             // Nếu thẻ đối thủ không bị hết máu, nó vào chồng bài đã dùng của đối thủ
            if (gameState.battleData[oCardId] > 0) {
                gameState.opponentUsedCards.push(oCardId);
            } else {
                // QUAN TRỌNG: Nếu thẻ đối thủ bị loại, người chơi được rút 1 thẻ mới
                playerDrawCount++;
            }
        }
    }

    // Dọn dẹp các slot
    gameState.playerSlots = [null, null, null];
    gameState.opponentSlots = [null, null, null];
    
    // Người chơi rút bài mới
    for (let i = 0; i < playerDrawCount; i++) {
        if (gameState.playerDeck.length > 0) {
            gameState.playerHand.push(gameState.playerDeck.pop());
        }
    }

    // Kiểm tra điều kiện kết thúc game
    const playerTotalCards = gameState.playerDeck.length + gameState.playerHand.length;
    const opponentTotalCards = gameState.opponentDeck.length + gameState.opponentHand.length;

    if (playerTotalCards === 0 || opponentTotalCards === 0) {
        endGame();
        return;
    }
    
    // Đối thủ rút bài lại cho đủ 5 thẻ
    while(gameState.opponentHand.length < 5 && gameState.opponentDeck.length > 0) {
        gameState.opponentHand.push(gameState.opponentDeck.pop());
    }
    
    gameState.phase = 'placement';
    renderContent('game');
    document.getElementById('confirm-placement-btn').style.display = 'flex';
}
   // THAY THẾ HÀM NÀY
function endGame() {
    gameState.phase = 'end';
    document.querySelector('.bottom-nav').style.display = 'flex';
    document.getElementById('player-hand-container')?.remove();
    document.querySelector('.game-actions')?.remove();
    
    const modal = document.getElementById('game-over-modal');
    const title = document.getElementById('game-over-title');
    const message = document.getElementById('game-over-message');

    const playerTotalCards = gameState.playerDeck.length + gameState.playerHand.length;
    const opponentTotalCards = gameState.opponentDeck.length + gameState.opponentHand.length;
    
    if (opponentTotalCards === 0) {
        title.textContent = 'Chiến Thắng!';
        message.textContent = `Chúc mừng! Bạn đã đánh bại đối thủ! Tỷ số cuối cùng: ${gameState.playerScore} - ${gameState.opponentScore}.`;
    } else if (playerTotalCards === 0) {
        title.textContent = 'Thất Bại';
        message.textContent = `Rất tiếc, bạn đã hết bài! Tỷ số cuối cùng: ${gameState.playerScore} - ${gameState.opponentScore}.`;
    } else { // Trường hợp khác (hòa điểm khi hết bài)
         if(gameState.playerScore > gameState.opponentScore) {
            title.textContent = 'Chiến Thắng!';
            message.textContent = `Hết bài! Bạn thắng nhờ hơn điểm! Tỷ số: ${gameState.playerScore} - ${gameState.opponentScore}.`;
        } else if (gameState.opponentScore > gameState.playerScore) {
            title.textContent = 'Thất Bại';
            message.textContent = `Hết bài! Bạn thua do thấp điểm hơn! Tỷ số: ${gameState.playerScore} - ${gameState.opponentScore}.`;
        } else {
            title.textContent = 'Hòa!';
            message.textContent = `Trận đấu kết thúc với tỉ số hòa ${gameState.playerScore} - ${gameState.opponentScore}.`;
        }
    }
    modal.classList.add('show');
}

    // --- INITIAL LOAD & EVENT LISTENERS ---
    navItems.forEach(item => item.addEventListener('click', handleNavClick));
    document.querySelectorAll('.modal-overlay').forEach(modal => modal.addEventListener('click', (e) => { 
        if (e.target === modal) modal.classList.remove('show'); 
    }));
    window.onload = async () => { 
        loadState(); // <-- TẢI TRẠNG THÁI KHI BẮT ĐẦU
          await loadGameData(); 
        
        updateCurrencyDisplay();
        renderContent('main');
    };
