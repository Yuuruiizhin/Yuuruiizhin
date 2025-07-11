class TitleDecryptor {
    constructor(elementId, finalText, options = {}) {
        this.element = document.getElementById(elementId);
        this.finalText = finalText;
        this.currentText = '';
        this.currentIndex = 0;
        
        // Configuración por defecto
        this.options = {
            decryptSpeed: 50,        // Velocidad de cambio de símbolos (ms)
            decryptIterations: 15,   // Cuántas veces cambia cada símbolo antes de revelar
            revealDelay: 100,        // Tiempo entre revelar cada letra (ms)
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?~`',
            ...options
        };
        
        this.init();
    }
    
    init() {
        // Verificar que el elemento existe
        if (!this.element) {
            console.error(`Elemento con id no encontrado`);
            return;
        }
        
        // Asegurar que siempre haya contenido en el elemento
        // Inicializar inmediatamente con símbolos para evitar contenido vacío
        this.currentText = this.generateRandomSymbols(this.finalText.length);
        this.updateDisplay();
        
        // Comenzar la animación inmediatamente
        this.startDecryption();
    }
    
    generateRandomSymbols(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += this.getRandomSymbol();
        }
        return result;
    }
    
    getRandomSymbol() {
        return this.options.symbols[Math.floor(Math.random() * this.options.symbols.length)];
    }
    
    updateDisplay() {
        this.element.textContent = this.currentText;
    }
    
    startDecryption() {
        this.decryptCurrentPosition();
    }
    
    decryptCurrentPosition() {
        if (this.currentIndex >= this.finalText.length) {
            // Terminado - remover clase de desencriptado si existe
            this.element.classList.remove('decrypting');
            return;
        }
        
        // Añadir clase de desencriptado si existe
        this.element.classList.add('decrypting');
        
        let iterations = 0;
        const decryptInterval = setInterval(() => {
            // Cambiar el símbolo actual por uno aleatorio
            const textArray = this.currentText.split('');
            textArray[this.currentIndex] = this.getRandomSymbol();
            this.currentText = textArray.join('');
            this.updateDisplay();
            
            iterations++;
            
            if (iterations >= this.options.decryptIterations) {
                clearInterval(decryptInterval);
                
                // Revelar la letra correcta
                const textArray = this.currentText.split('');
                textArray[this.currentIndex] = this.finalText[this.currentIndex];
                this.currentText = textArray.join('');
                this.updateDisplay();
                
                this.currentIndex++;
                
                // Continuar con la siguiente letra después de un delay
                setTimeout(() => {
                    this.decryptCurrentPosition();
                }, this.options.revealDelay);
            }
        }, this.options.decryptSpeed);
    }
    
    // Método para reiniciar el efecto
    restart() {
        this.currentText = '';
        this.currentIndex = 0;
        this.init();
    }
}

// Función para inicializar ambos efectos
function initDecryptors() {
    // Título del navegador (más lento)
    new TitleDecryptor('title_id', '@Yuuruii', {
        decryptSpeed: 40,
        decryptIterations: 20,
        revealDelay: 150
    });
    
    // H1 principal (más rápido)
    new TitleDecryptor('main_title', '@Yuuruii', {
        decryptSpeed: 25,       // Más rápido
        decryptIterations: 12,   // Menos iteraciones
        revealDelay: 80         // Menos delay entre letras
    });
}

// Ejecutar inmediatamente
document.addEventListener('DOMContentLoaded', initDecryptors);

// Backup por si el DOM ya está cargado
if (document.readyState !== 'loading') {
    initDecryptors();
}

// Función global para reiniciar ambos efectos (opcional)
function restartAllDecryptions() {
    initDecryptors();
}