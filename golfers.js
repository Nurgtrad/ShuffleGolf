/**
 * DECK GOLF - Base de datos y lógicas de Golfistas
 */

const GOLFERS = [
    {
        id: 'g_marray',
        name: 'Marray',
        difficulty: 'Fácil',
        stats: { straight: 5, power: 2, control: 4 },
        desc: 'Golpes precisos y controlados, pero carece de fuerza bruta.',
        
        // 5/5 Straight: Desvío 0%
        getDeviation: () => { return { type: 'none', value: 0 }; },
        
        // 2/5 Power: -5% a -10% de distancia
        getPowerMultiplier: () => { return 1 - (0.05 + Math.random() * 0.05); },
        
        // 4/5 Control: 10% más lento (0.9x velocidad de barras)
        getControlMultiplier: () => { return 0.90; }
    },
    {
        id: 'g_mckinze',
        name: 'McKinze',
        difficulty: 'Normal',
        stats: { straight: 4, power: 4, control: 3 },
        desc: 'Equilibrado. Sufre de un ligero Fade constante.',
        
        // 4/5 Straight (Fade): 5% a 10% de desvío 
        // (Nota: el 'type' lo usaremos luego en core.js para saber si desvía a la derecha o izquierda)
        getDeviation: () => { return { type: 'fade', value: 0.05 + Math.random() * 0.05 }; },
        
        // 4/5 Power: No modifica (100% de la fuerza)
        getPowerMultiplier: () => { return 1.0; },
        
        // 3/5 Control: 7% más rápido (1.07x velocidad de barras)
        getControlMultiplier: () => { return 1.07; }
    },
    {
        id: 'g_rehm',
        name: 'Rehm',
        difficulty: 'Difícil',
        stats: { straight: 3, power: 5, control: 2 },
        desc: 'Fuerza extrema. Difícil de controlar y propenso al Slice.',
        
        // 3/5 Straight (Slice): 10% a 15% de desvío
        getDeviation: () => { return { type: 'slice', value: 0.10 + Math.random() * 0.05 }; },
        
        // 5/5 Power: +5% a +10% de distancia
        getPowerMultiplier: () => { return 1 + (0.05 + Math.random() * 0.05); },
        
        // 2/5 Control: 15% más rápido (1.15x velocidad de barras)
        getControlMultiplier: () => { return 1.15; }
    }
];