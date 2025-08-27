/**
 * Aguarda o carregamento completo do DOM para inicializar o script.
 */
document.addEventListener('DOMContentLoaded', function() {
    // --- DADOS DA CAMPANHA (VOCÊ ATUALIZA AQUI) ---
    const metaFinanceira = 5000;
    const doadores = [
        { nome: 'Wilian Machado', valor: 50 },
        { nome: 'Adrian Souza', valor: 100 },
        { nome: 'Gabriel Silva', valor: 20 },


    ];

    // --- 1. SELEÇÃO DOS ELEMENTOS ---
    const qrCodeImage = document.getElementById('qrCodeImage');
    const copyPixBtn = document.getElementById('copyPixBtn');
    const openQrLink = document.getElementById('openQrLink');
    const qrInstructionText = document.getElementById('qrInstructionText');
    const qrInstructionSubtext = document.getElementById('qrInstructionSubtext');
    const valueOptions = document.querySelectorAll('.value-option');
    const ctaButton = document.getElementById('ctaButton');
    const qrCodeActionsWrapper = document.querySelector('.qr-code-actions-wrapper');
    const progressBarFill = document.getElementById('progressBarFill');
    const valorArrecadadoEl = document.getElementById('valorArrecadado');
    const metaTotalEl = document.getElementById('metaTotal');
    const porcentagemMetaEl = document.getElementById('porcentagemMeta');
    const rubiksCube = document.getElementById('rubiks-cube');

    // --- 2. FUNÇÕES DE LÓGICA E ATUALIZAÇÃO ---

    /**
     * Preenche o cubo mágico com os nomes dos doadores.
     */
    function popularCuboMagico() {
        if (!rubiksCube) return;

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
    ctaButton.addEventListener('click', () => { if (qrCodeActionsWrapper) { qrCodeActionsWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' }); } });

    // --- 4. ESTADO INICIAL ---
    function initializePage() {
        const activeButton = document.querySelector('.value-option.active');
        if (activeButton) {
            activeButton.click();
        }
        atualizarBarraDeProgresso();
        popularCuboMagico();
    }

    initializePage();
    initParticles();
    console.log('🎓 Site completo com cubo mágico carregado!');
});


/**
 * Cria e gerencia as partículas de fundo.
 */
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

/**
 * Exibe uma notificação temporária na tela.
 */
function showNotification(message) {
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}