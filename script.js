/**
 * Aguarda o carregamento completo do DOM para inicializar o script.
 */
document.addEventListener('DOMContentLoaded', function() {
    // --- DADOS DA CAMPANHA (VOCÊ ATUALIZA AQUI) ---

    const metaFinanceira = 5000; // Sua meta final em Reais.

    // Lista de doadores. Adicione novos doadores aqui!
    const doadores = [
        { nome: 'Adrian Souza', valor: 5 },
        { nome: 'Wilian Machado', valor: 5 },
        { nome: 'Fernanda Bonato', valor: 10 },
    ];
    
    // ⚠️ ATENÇÃO: COLE AQUI O URL DA SUA PLANILHA PUBLICADA COMO CSV
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
    const guestbookList = document.getElementById('guestbook-list');
    const modal = document.getElementById('guestbook-modal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const guestbookForm = document.getElementById('guestbook-form');
    const submitGuestbookBtn = document.getElementById('submit-guestbook');

    // Variável para guardar os recados em memória
    let recadosExibidos = [];

    // --- 2. FUNÇÕES DE LÓGICA E ATUALIZAÇÃO ---

    /**
     * Pega a lista de recados e a renderiza no carrossel.
     */
    function renderizarRecados() {
        if (!guestbookList) return;

        if (recadosExibidos.length === 0) {
            guestbookList.innerHTML = `<div class="info-card message-card" style="flex: 0 0 100%;"><p class="personal-message">"Seja o primeiro a deixar um recado! ✨"</p></div>`;
            return;
        }

        const recadosHtml = recadosExibidos.map(recado => {
            const nomeLimpo = recado.nome ? recado.nome.replace(/"/g, '') : 'Anônimo';
            const mensagemLimpa = recado.mensagem ? recado.mensagem.replace(/"/g, '') : '...';
            return `
                <div class="info-card message-card">
                    <p class="personal-message">"${mensagemLimpa}"</p>
                    <div class="message-author">
                        <div class="author-avatar">💬</div>
                        <div class="author-info">
                            <div class="author-name">${nomeLimpo}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        const minRecadosParaRolar = 4;
        if (recadosExibidos.length < minRecadosParaRolar) {
            guestbookList.innerHTML = recadosHtml;
            guestbookList.style.animation = 'none';
            if (guestbookList.parentElement) guestbookList.parentElement.style.justifyContent = 'center';
        } else {
            guestbookList.innerHTML = recadosHtml + recadosHtml;
            guestbookList.style.animation = 'scroll 60s linear infinite';
            if (guestbookList.parentElement) guestbookList.parentElement.style.justifyContent = 'flex-start';
        }
    }

    /**
     * Carrega os recados da planilha do Google.
     */
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
    
    /**
     * Preenche o cubo mágico com os nomes dos doadores.
     */
    function popularCuboMagico() {
        if (!rubiksCube) return;
        rubiksCube.innerHTML = '';

        const faces = ['front', 'back', 'left', 'right', 'top', 'bottom'];
        const colors = ['#FFFFFF', '#ffeb3b', '#ff3d00', '#4caf50', '#2196f3', '#ff9800'];

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

    /**
     * Calcula o total arrecadado, a porcentagem e atualiza a barra de progresso.
     */
    function atualizarBarraDeProgresso() {
        const totalArrecadado = doadores.reduce((soma, doador) => soma + doador.valor, 0);
        const porcentagem = (totalArrecadado / metaFinanceira) * 100;
        const porcentagemLimitada = Math.min(porcentagem, 100);
        const totalFormatado = totalArrecadado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const metaFormatada = metaFinanceira.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        if(progressBarFill) progressBarFill.style.width = `${porcentagemLimitada}%`;
        if(valorArrecadadoEl) valorArrecadadoEl.textContent = totalFormatado;
        if(metaTotalEl) metaTotalEl.textContent = metaFormatada;
        if(porcentagemMetaEl) porcentagemMetaEl.textContent = `${porcentagemLimitada.toFixed(0)}%`;
    }

    /**
     * Atualiza o QR Code, os botões e os textos de instrução.
     */
    function updatePixInfo(pixCode, amount) {
        if (!pixCode || !qrCodeImage) { console.error("Código PIX ou elemento do QR Code não encontrado!"); qrCodeImage.style.display = 'none'; return; }
        qrCodeImage.style.display = 'block';
        const qrApiUrl = `https://quickchart.io/qr?text=${encodeURIComponent(pixCode)}`;
        const qrApiUrlLarge = `https://quickchart.io/qr?size=400&text=${encodeURIComponent(pixCode)}`;
        qrCodeImage.src = qrApiUrl; openQrLink.href = qrApiUrlLarge; copyPixBtn.setAttribute('data-pix-key', pixCode);
        const iconHtml = `<span class="qr-icon">📱</span>`;
        if (amount) { const formattedAmount = parseFloat(amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); qrInstructionText.innerHTML = `${iconHtml} PIX para doação de ${formattedAmount}`; qrInstructionSubtext.innerHTML = '';
        } else { qrInstructionText.innerHTML = `${iconHtml} Escaneie o QR Code`; qrInstructionSubtext.innerHTML = `(Valor Livre)`; }
    }


    // --- 3. CONFIGURAÇÃO DOS EVENTOS ---
    valueOptions.forEach(button => { button.addEventListener('click', () => { valueOptions.forEach(btn => btn.classList.remove('active')); button.classList.add('active'); updatePixInfo(button.dataset.pixCode, button.dataset.amount); }); });
    copyPixBtn.addEventListener('click', () => { const pixKey = copyPixBtn.getAttribute('data-pix-key'); if (!pixKey || pixKey.includes('COLE_AQUI')) { showNotification('❌ Por favor, selecione um valor primeiro.'); return; } navigator.clipboard.writeText(pixKey).then(() => showNotification('✅ Chave PIX copiada com sucesso!')).catch(() => showNotification('❌ Erro ao copiar a chave.')); });
    
    if (openModalBtn) openModalBtn.addEventListener('click', () => modal.style.display = 'block');
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

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
        carregarRecados();
    }

    initializePage();
    initParticles();
    console.log('🎓 Site completo com todas as funcionalidades carregado!');
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
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) { oldNotification.remove(); }
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => { notification.classList.add('show'); }, 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => { notification.remove(); }, 500);
    }, 3000);
}