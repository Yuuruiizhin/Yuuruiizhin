(function() {
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';
            
    function getRandomSymbol() {
        return symbols[Math.floor(Math.random() * symbols.length)];
    }
    
    function generateRandomSymbols(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += getRandomSymbol();
        }
        return result;
    }
    
    // Cambiar el título inmediatamente
    const titleElement = document.getElementById('title_id');
    if (titleElement) {
        titleElement.textContent = generateRandomSymbols(8);
    }
})();