// fire_effect.js - Efecto de rayos optimizado

document.addEventListener('DOMContentLoaded', () => {
    const mainTitleWrapper = document.getElementById('main_title_wrapper');
    
    // Configuración del efecto
    const config = {
        maxLightnings: 6, // Reducido para mejor rendimiento
        lightningCreationRate: 800, // Más lento para efecto dramático
        burstInterval: 4000, // Intervalos de ráfagas
        burstCount: 2, // Rayos por ráfaga
        minLife: 8,
        maxLife: 15,
        segments: {
            min: 2,
            max: 4
        },
        strokeWidth: {
            min: 0.3,
            max: 1.5
        },
        colors: {
            primary: '#8a0000',
            secondary: '#ff4444',
            bright: '#ff0000'
        }
    };

    if (!mainTitleWrapper) {
        console.warn("ADVERTENCIA: Elemento con ID 'main_title_wrapper' no encontrado.");
        return;
    }

    const mainTitle = document.getElementById('main_title');
    let lightningContainer = null;
    let lightnings = [];
    let animationId = null;
    let creationInterval = null;
    let burstInterval = null;
    let isActive = false;

    // Verificar si el usuario prefiere movimiento reducido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        console.log("Movimiento reducido detectado. Efecto de rayos desactivado.");
        return;
    }

    // Crear contenedor de rayos
    function createLightningContainer() {
        lightningContainer = document.createElement('div');
        lightningContainer.className = 'lightning-container';
        lightningContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: visible;
            z-index: 0;
        `;
        return lightningContainer;
    }

    // Obtener dimensiones del título
    function getTitleDimensions() {
        if (!mainTitle) return null;
        
        const rect = mainTitle.getBoundingClientRect();
        const containerRect = mainTitleWrapper.getBoundingClientRect();
        
        return {
            width: rect.width,
            height: rect.height,
            left: rect.left - containerRect.left,
            top: rect.top - containerRect.top
        };
    }

    // Generar puntos de rayo zigzag
    function generateLightningPath(dimensions) {
        const startX = Math.random() * dimensions.width;
        const startY = Math.random() * dimensions.height;
        const endX = Math.random() * dimensions.width;
        const endY = Math.random() * dimensions.height;
        
        let pathData = `M ${startX} ${startY}`;
        const segments = config.segments.min + Math.floor(Math.random() * (config.segments.max - config.segments.min));
        
        for (let i = 1; i < segments; i++) {
            const progress = i / segments;
            const baseX = startX + (endX - startX) * progress;
            const baseY = startY + (endY - startY) * progress;
            
            // Añadir variación zigzag
            const offsetX = (Math.random() - 0.5) * 25;
            const offsetY = (Math.random() - 0.5) * 15;
            
            pathData += ` L ${baseX + offsetX} ${baseY + offsetY}`;
        }
        pathData += ` L ${endX} ${endY}`;
        
        return pathData;
    }

    // Crear un rayo individual
    function createLightning() {
        if (!lightningContainer || !lightningContainer.parentNode) {
            console.warn("Lightning container no disponible");
            return null;
        }

        if (lightnings.length >= config.maxLightnings) {
            return null;
        }

        const dimensions = getTitleDimensions();
        if (!dimensions) return null;

        const lightning = document.createElement('div');
        lightning.className = 'lightning-bolt';
        
        // Crear SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // Configurar path
        const pathData = generateLightningPath(dimensions);
        path.setAttribute('d', pathData);
        path.setAttribute('stroke', config.colors.primary);
        path.setAttribute('stroke-width', 
            config.strokeWidth.min + Math.random() * (config.strokeWidth.max - config.strokeWidth.min));
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        
        // Efecto de brillo optimizado
        path.style.filter = `
            drop-shadow(0 0 2px ${config.colors.secondary}) 
            drop-shadow(0 0 4px ${config.colors.primary})
        `;
        
        // Configurar SVG
        svg.style.cssText = `
            position: absolute;
            top: ${dimensions.top}px;
            left: ${dimensions.left}px;
            width: ${dimensions.width}px;
            height: ${dimensions.height}px;
            pointer-events: none;
            overflow: visible;
        `;
        
        svg.appendChild(path);
        lightning.appendChild(svg);

        // Propiedades del rayo
        const lightningObj = {
            element: lightning,
            path: path,
            life: config.minLife + Math.random() * (config.maxLife - config.minLife),
            maxLife: config.maxLife,
            intensity: 0.3 + Math.random() * 0.5,
            flickerChance: 0.7 + Math.random() * 0.2
        };

        lightnings.push(lightningObj);

        // Añadir al DOM
        lightning.style.opacity = '0';
        lightningContainer.appendChild(lightning);

        // Animación de aparición
        requestAnimationFrame(() => {
            lightning.style.opacity = lightningObj.intensity;
        });

        return lightningObj;
    }

    // Animar todos los rayos
    function animateLightnings() {
        if (!isActive || !lightningContainer || !lightningContainer.parentNode) {
            return;
        }

        for (let i = lightnings.length - 1; i >= 0; i--) {
            const lightning = lightnings[i];

            lightning.life--;
            if (lightning.life <= 0) {
                lightning.element.remove();
                lightnings.splice(i, 1);
                continue;
            }

            const lifeRatio = lightning.life / lightning.maxLife;
            
            // Efecto de parpadeo más controlado
            const shouldFlicker = Math.random() > lightning.flickerChance;
            const flickerMultiplier = shouldFlicker ? 0.1 : 1;
            const opacity = Math.pow(lifeRatio, 0.4) * lightning.intensity * flickerMultiplier;
            
            lightning.element.style.opacity = opacity;

            // Cambios ocasionales de color y grosor
            if (Math.random() > 0.85) {
                const colorVariation = Math.random();
                const color = colorVariation > 0.7 ? config.colors.bright : 
                            colorVariation > 0.3 ? config.colors.secondary : 
                            config.colors.primary;
                lightning.path.setAttribute('stroke', color);
            }

            if (Math.random() > 0.9) {
                const width = config.strokeWidth.min + Math.random() * (config.strokeWidth.max - config.strokeWidth.min);
                lightning.path.setAttribute('stroke-width', width);
            }
        }

        animationId = requestAnimationFrame(animateLightnings);
    }

    // Crear ráfaga de rayos
    function createBurst() {
        for (let i = 0; i < config.burstCount; i++) {
            setTimeout(() => {
                createLightning();
            }, i * 150);
        }
    }

    // Inicializar efecto
    function initializeEffect() {
        try {
            const currentWrapper = document.getElementById('main_title_wrapper');
            if (!currentWrapper) {
                console.warn("main_title_wrapper no encontrado después del delay");
                return;
            }

            // Configurar wrapper para posicionamiento relativo
            currentWrapper.style.position = 'relative';
            
            // Crear y añadir contenedor
            const container = createLightningContainer();
            currentWrapper.appendChild(container);
            
            isActive = true;

            // Ráfaga inicial
            setTimeout(() => {
                createBurst();
            }, 200);

            // Intervalos regulares
            creationInterval = setInterval(() => {
                if (lightnings.length < config.maxLightnings) {
                    createLightning();
                }
            }, config.lightningCreationRate);

            // Ráfagas ocasionales
            burstInterval = setInterval(() => {
                if (Math.random() > 0.6) {
                    createBurst();
                }
            }, config.burstInterval);

            // Iniciar animación
            animateLightnings();

            console.log("Efecto de rayos inicializado correctamente");

        } catch (error) {
            console.error("Error al inicializar efecto de rayos:", error);
        }
    }

    // Limpiar efecto
    function cleanup() {
        isActive = false;
        
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        
        if (creationInterval) {
            clearInterval(creationInterval);
            creationInterval = null;
        }
        
        if (burstInterval) {
            clearInterval(burstInterval);
            burstInterval = null;
        }
        
        lightnings.forEach(lightning => {
            if (lightning.element.parentNode) {
                lightning.element.remove();
            }
        });
        lightnings = [];
        
        if (lightningContainer && lightningContainer.parentNode) {
            lightningContainer.remove();
            lightningContainer = null;
        }
    }

    // Manejo de visibilidad de página para optimizar rendimiento
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cleanup();
        } else if (!isActive) {
            setTimeout(initializeEffect, 500);
        }
    });

    // Inicializar después de un delay
    setTimeout(initializeEffect, 500);

    // Limpiar al descargar la página
    window.addEventListener('beforeunload', cleanup);
});