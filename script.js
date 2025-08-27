/**
 * Aguarda o carregamento completo do DOM para inicializar o script.
 */
document.addEventListener('DOMContentLoaded', function() {
    // --- 1. SELEÇÃO DOS ELEMENTOS ---
    // Seleciona todos os elementos que vamos manipular uma única vez para melhor performance.
    const qrCodeImage = document.getElementById('qrCodeImage');
    const copyPixBtn = document.getElementById('copyPixBtn');
    const openQrLink = document.getElementById('openQrLink');
    const qrInstructionText = document.getElementById('qrInstructionText');
    const qrInstructionSubtext = document.getElementById('qrInstructionSubtext');
    const valueOptions = document.querySelectorAll('.value-option');
    const ctaButton = document.getElementById('ctaButton');
    const qrCodeActionsWrapper = document.querySelector('.qr-code-actions-wrapper');

    // --- 2. FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO ---
    /**
     * Atualiza o QR Code, os botões e os textos de instrução.
     * @param {string} pixCode - O código "PIX Copia e Cola" completo.
     * @param {string|null} amount - O valor da doação (ex: "5.00") ou null para valor livre.
     */
    function updatePixInfo(pixCode, amount) {
        if (!pixCode || !qrCodeImage) {
            console.error("Código PIX ou elemento do QR Code não encontrado! Verifique se os códigos foram colados no HTML.");
            // Esconde o QR Code se não houver código para evitar imagem quebrada
            qrCodeImage.style.display = 'none';
            return;
        }
        
        // Garante que o QR Code esteja visível caso estivesse escondido
        qrCodeImage.style.display = 'block';

        const qrApiUrl = `https://quickchart.io/qr?text=${encodeURIComponent(pixCode)}`;
        const qrApiUrlLarge = `https://quickchart.io/qr?size=400&text=${encodeURIComponent(pixCode)}`;

        qrCodeImage.src = qrApiUrl;
        openQrLink.href = qrApiUrlLarge;
        copyPixBtn.setAttribute('data-pix-key', pixCode);

        // --- LÓGICA DE TEXTO ATUALIZADA ---
        const iconHtml = `<span class="qr-icon">📱</span>`;
        if (amount) {
            // Se tiver um valor, mostra o texto completo na linha principal e limpa a de baixo
            const formattedAmount = parseFloat(amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            qrInstructionText.innerHTML = `${iconHtml} PIX para doação de ${formattedAmount}`;
            qrInstructionSubtext.innerHTML = ''; // Limpa o sub-texto
        } else {
            // Se for valor livre, divide o texto em duas partes
            qrInstructionText.innerHTML = `${iconHtml} Escaneie o QR Code`;
            qrInstructionSubtext.innerHTML = `(Valor Livre)`; // Adiciona o sub-texto
        }
    }

    // --- 3. CONFIGURAÇÃO DOS EVENTOS ---
    
    valueOptions.forEach(button => {
        button.addEventListener('click', () => {
            valueOptions.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const pixCode = button.dataset.pixCode;
            const amount = button.dataset.amount;

            updatePixInfo(pixCode, amount);
        });
    });

    copyPixBtn.addEventListener('click', () => {
        const pixKey = copyPixBtn.getAttribute('data-pix-key');
        if (!pixKey || pixKey.includes('COLE_AQUI')) {
             showNotification('❌ Por favor, selecione um valor primeiro.');
             return;
        }
        navigator.clipboard.writeText(pixKey)
            .then(() => showNotification('✅ Chave PIX copiada com sucesso!'))
            .catch(err => {
                console.error('Erro ao copiar a chave PIX:', err);
                showNotification('❌ Erro ao copiar a chave.');
            });
    });
    
    ctaButton.addEventListener('click', () => {
        if (qrCodeActionsWrapper) {
            qrCodeActionsWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // --- 4. ESTADO INICIAL ---
    function initializePage() {
        const activeButton = document.querySelector('.value-option.active');
        if (activeButton) {
            activeButton.click(); // Simula um clique para carregar o estado inicial
        }
    }

    initializePage();
    initParticles();
    console.log('🎓 Site da formatura interativo carregado com sucesso!');
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