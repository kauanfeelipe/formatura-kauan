/**
 * Aguarda o carregamento completo do DOM para inicializar o script.
 */
document.addEventListener('DOMContentLoaded', function() {
    // --- DADOS DA CAMPANHA (VOCÊ ATUALIZA AQUI) ---
    const metaFinanceira = 5000;
    const doadores = [
        { nome: 'Adrian Souza', valor: 5 },
        { nome: 'Wilian Machado', valor: 5 },
        { nome: 'Fernanda Bonato', valor: 10 },
        { nome: 'Cícero Nunes', valor: 50 },
    ];
    const googleSheetCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTko3TfuHCK_RV1R5Lb46In2hDyg6v09zUlg1Jv6a7-shWj4Ggno95vGMgo7CPyxfKdF8Fc6nPJ7yqG/pub?gid=0&single=true&output=csv';

    // --- 1. SELEÇÃO DOS ELEMENTOS ---
    const qrCodeImage = document.getElementById('qrCodeImage');
    const copyPixBtn = document.getElementById('copyPixBtn');
    const openQrLink = document.getElementById('openQrLink');
    const qrInstructionText = document.getElementById('qrInstructionText');
    const qrInstructionSubtext = document.getElementById('qrInstructionSubtext');
    const valueOptions = document.querySelectorAll('.value-option');
    const qrCodeActionsWrapper = document.querySelector('.qr-code-actions-wrapper');
    const progressBarFill = document.getElementById('progressBarFill');
    const valorArrecadadoEl = document.getElementById('valorArrecadado');
    const metaTotalEl = document.getElementById('metaTotal');
    const porcentagemMetaEl = document.getElementById('porcentagemMeta');
    const rubiksCube = document.getElementById('rubiks-cube');
    const topDonorEl = document.getElementById('top-donor');
    const topDonorNameEl = document.getElementById('top-donor-name');
    const topDonorAmountEl = document.getElementById('top-donor-amount');
    const guestbookList = document.getElementById('guestbook-list');
    const guestbookCarousel = document.querySelector('.guestbook-carousel');
    const modal = document.getElementById('guestbook-modal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const guestbookForm = document.getElementById('guestbook-form');
    const submitGuestbookBtn = document.getElementById('submit-guestbook');

    let recadosExibidos = [];

    // --- 2. FUNÇÕES DE LÓGICA E ATUALIZAÇÃO ---
    function renderizarRecados() {
        if (!guestbookList) return;
        guestbookList.innerHTML = '';
        const listaParaDuplicar = recadosExibidos.length === 0 ? [{ nome: 'Anônimo', mensagem: 'Seja o primeiro a deixar um recado! ✨' }] : recadosExibidos;

        const renderMensagem = (recado) => {
            const card = document.createElement('div');
            card.className = 'info-card message-card';

            const p = document.createElement('p');
            p.className = 'personal-message';
            p.textContent = `"${recado.mensagem || '...'}"`;

            const author = document.createElement('div');
            author.className = 'message-author';

            const avatar = document.createElement('div');
            avatar.className = 'author-avatar';
            avatar.textContent = '💬';

            const info = document.createElement('div');
            info.className = 'author-info';

            const name = document.createElement('div');
            name.className = 'author-name';
            name.textContent = recado.nome || 'Anônimo';

            info.appendChild(name);
            author.appendChild(avatar);
            author.appendChild(info);
            card.appendChild(p);
            card.appendChild(author);
            return card;
        };

        // Renderiza duas vezes para efeito de loop contínuo
        [listaParaDuplicar, listaParaDuplicar].forEach(lista => {
            lista.forEach(recado => {
                guestbookList.appendChild(renderMensagem(recado));
            });
        });

        guestbookList.style.animation = 'scroll 60s linear infinite';
    }

    async function carregarRecados() {
        if (!googleSheetCsvUrl.startsWith('http')) return;
        try {
            const cacheBustingUrl = `${googleSheetCsvUrl}&timestamp=${new Date().getTime()}`;
            const response = await fetch(cacheBustingUrl);
            if (!response.ok) throw new Error(`Erro na rede: ${response.status}`);
            const data = await response.text();
            const rows = data.trim().split('\n').slice(1).filter(row => row.trim() !== "");
            recadosExibidos = rows.map(row => {
                const parts = row.split(',');
                const nome = parts[1];
                const mensagem = parts.slice(2).join(',');
                return { nome, mensagem };
            }).reverse();
            renderizarRecados();
        } catch (error) {
            console.error('Erro ao carregar recados:', error);
        }
    }
    
    function popularCuboMagico() {
        if (!rubiksCube) return;
        rubiksCube.innerHTML = '';
        const faces = ['front', 'back', 'left', 'right', 'top', 'bottom'];
        const colors = ['var(--purple-light)', 'var(--purple-dark)', 'var(--gold)', '#FFFFFF', '#61dafb', '#ff3d00'];
        let donorIndex = 0;
        faces.forEach(faceName => {
            const faceDiv = document.createElement('div');
            faceDiv.className = `face ${faceName}`;
            for (let i = 0; i < 9; i++) {
                const cubeDiv = document.createElement('div');
                cubeDiv.className = 'cube';
                const doador = doadores.length > 0 ? doadores[donorIndex % doadores.length] : null;
                if (doador) {
                    const nameSpan = document.createElement('span');
                    nameSpan.className = 'cube-name';
                    nameSpan.textContent = doador.nome.length > 10 ? `${doador.nome.substring(0, 8)}.` : doador.nome;
                    cubeDiv.appendChild(nameSpan);
                    donorIndex++;
                }
                cubeDiv.style.background = colors[Math.floor(Math.random() * colors.length)];
                faceDiv.appendChild(cubeDiv);
            }
            rubiksCube.appendChild(faceDiv);
        });
    }

    function atualizarBarraDeProgresso() {
        const totalArrecadado = doadores.reduce((soma, doador) => soma + doador.valor, 0);
        const porcentagem = (totalArrecadado / metaFinanceira) * 100;
        const porcentagemLimitada = Math.min(porcentagem, 100);
        const totalFormatado = totalArrecadado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const metaFormatada = metaFinanceira.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        if(progressBarFill) {
            progressBarFill.style.width = `${porcentagemLimitada}%`;
            progressBarFill.setAttribute('role', 'progressbar');
            progressBarFill.setAttribute('aria-valuemin', '0');
            progressBarFill.setAttribute('aria-valuemax', '100');
            progressBarFill.setAttribute('aria-valuenow', porcentagemLimitada.toFixed(0));
        }
        if(valorArrecadadoEl) valorArrecadadoEl.textContent = totalFormatado;
        if(metaTotalEl) metaTotalEl.textContent = metaFormatada;
        if(porcentagemMetaEl) porcentagemMetaEl.textContent = `${porcentagemLimitada.toFixed(0)}%`;
    }

    function renderTopDonor() {
        if (!topDonorEl || !Array.isArray(doadores) || doadores.length === 0) return;
        const maior = doadores.reduce((acc, d) => (d.valor > (acc?.valor || 0) ? d : acc), null);
        if (!maior) return;
        const nome = maior.nome || '—';
        const valor = (maior.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        if (topDonorNameEl) topDonorNameEl.textContent = nome;
        if (topDonorAmountEl) topDonorAmountEl.textContent = valor;
    }

    function updatePixInfo(pixCode, amount) {
        if (!pixCode) { console.error("Código PIX não informado!"); return; }
        if (!qrCodeImage) { console.error("Elemento do QR Code não encontrado!"); return; }
        qrCodeImage.style.display = 'block';
        const qrApiUrl = `https://quickchart.io/qr?text=${encodeURIComponent(pixCode)}`;
        const qrApiUrlLarge = `https://quickchart.io/qr?size=400&text=${encodeURIComponent(pixCode)}`;
        qrCodeImage.src = qrApiUrl; openQrLink.href = qrApiUrlLarge; copyPixBtn.setAttribute('data-pix-key', pixCode);
        const iconHtml = `<span class="qr-icon">📱</span>`;
        if (amount) { const formattedAmount = parseFloat(amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); qrInstructionText.innerHTML = `${iconHtml} PIX para doação de ${formattedAmount}`; qrInstructionSubtext.innerHTML = '';
        } else { qrInstructionText.innerHTML = `${iconHtml} Escaneie o QR Code`; qrInstructionSubtext.innerHTML = `(Valor Livre)`; }
    }

    /**
     * Adiciona a funcionalidade de arrastar ao carrossel de recados.
     */
    function setupDraggableCarousel() {
        if (!guestbookCarousel || !guestbookList) return;

        let isDragging = false, startX, scrollLeft;

        const startDragging = (e) => {
            isDragging = true;
            guestbookList.classList.add('is-dragging');
            startX = (e.pageX || e.touches[0].pageX) - guestbookCarousel.offsetLeft;
            scrollLeft = guestbookCarousel.scrollLeft;
        };

        const stopDragging = () => {
            isDragging = false;
            guestbookList.classList.remove('is-dragging');
        };

        const drag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = (e.pageX || e.touches[0].pageX) - guestbookCarousel.offsetLeft;
            const walk = (x - startX) * 2; // Multiplicador para acelerar a rolagem
            guestbookCarousel.scrollLeft = scrollLeft - walk;
        };

        // Eventos de Mouse
        guestbookCarousel.addEventListener('mousedown', startDragging);
        guestbookCarousel.addEventListener('mouseleave', stopDragging);
        guestbookCarousel.addEventListener('mouseup', stopDragging);
        guestbookCarousel.addEventListener('mousemove', drag);

        // Eventos de Toque
        guestbookCarousel.addEventListener('touchstart', startDragging);
        guestbookCarousel.addEventListener('touchend', stopDragging);
        guestbookCarousel.addEventListener('touchmove', drag);
    }

    // --- 3. CONFIGURAÇÃO DOS EVENTOS ---
    valueOptions.forEach(button => {
        // Clique com mouse
        button.addEventListener('click', () => {
            valueOptions.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updatePixInfo(button.dataset.pixCode, button.dataset.amount);
        });
        // Acessibilidade por teclado
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
    copyPixBtn.addEventListener('click', () => { const pixKey = copyPixBtn.getAttribute('data-pix-key'); if (!pixKey || pixKey.includes('COLE_AQUI')) { showNotification('❌ Por favor, selecione um valor primeiro.'); return; } navigator.clipboard.writeText(pixKey).then(() => showNotification('✅ Chave PIX copiada com sucesso!')).catch(() => showNotification('❌ Erro ao copiar a chave.')); });
    
    if (openModalBtn) openModalBtn.addEventListener('click', () => modal.style.display = 'block');
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (event) => { if (event.target == modal) { modal.style.display = 'none'; } });

    if (guestbookForm) {
        guestbookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const nome = formData.get('nome');
            const mensagem = formData.get('mensagem');
            const data = { nome, mensagem };
            submitGuestbookBtn.textContent = 'Enviando...';
            submitGuestbookBtn.disabled = true;

            fetch(this.action, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            })
            .then(response => response.json())
            .then(res => {
                if (res.result === 'success') {
                    showNotification('✅ Recado publicado com sucesso!');
                    modal.style.display = 'none';
                    this.reset();
                    recadosExibidos.unshift({ nome, mensagem });
                    renderizarRecados();
                } else { throw new Error(res.message); }
            })
            .catch(error => {
                console.error('Erro ao enviar recado:', error);
                showNotification('❌ Erro ao publicar. Tente novamente.');
            })
            .finally(() => {
                submitGuestbookBtn.textContent = 'Publicar';
                submitGuestbookBtn.disabled = false;
            });
        });
    }

    // --- 4. ESTADO INICIAL ---
    function initializePage() {
        const activeButton = document.querySelector('.value-option.active');
        if (activeButton) { activeButton.click(); }
        atualizarBarraDeProgresso();
        popularCuboMagico();
        renderTopDonor();
        carregarRecados();
        setupDraggableCarousel(); // Chama a nova função de arrastar
    }

    initializePage();
    initParticles();
    console.log('🎓 Site completo com carrossel interativo carregado!');
});


function initParticles() {
    const particlesContainer = document.getElementById('particles-container');
    if (!particlesContainer) return;
    const particleCount = window.innerWidth < 768 ? 20 : 40;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        const size = Math.random() * 2 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${Math.random() * 5 + 5}s`;
        particlesContainer.appendChild(particle);
    }
}

function showNotification(message) {
    let live = document.getElementById('aria-live-region');
    if (!live) {
        live = document.createElement('div');
        live.id = 'aria-live-region';
        live.setAttribute('aria-live', 'polite');
        live.setAttribute('aria-atomic', 'true');
        live.style.position = 'fixed';
        live.style.left = '-9999px';
        document.body.appendChild(live);
    }
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) { oldNotification.remove(); }
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    live.textContent = message;
    setTimeout(() => { notification.classList.add('show'); }, 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => { notification.remove(); }, 500);
    }, 3000);
}