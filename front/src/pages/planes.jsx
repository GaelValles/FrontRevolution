import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import Sidebar from '../pages/components/sidebar';
import { useTheme } from '../context/ThemeContext';

const servicios = [
    {
        id: 'interiores',
        titulo: 'Limpieza profunda de interiores',
        descripcion:
            'Limpieza y tratamiento detallado de todas las superficies interiores para devolver aspecto y higiene al habitáculo.',
        incluye: [
            'Brillo y acondicionamiento de plásticos',
            'Lavado y limpieza a fondo de asientos',
            'Limpieza detallada de suelo, cielo y tapetes',
            'Aspirado completo con atención a rincones y ranuras',
            'Limpieza de paneles, tiradores y controles',
            'Desinfección ligera de superficies de contacto',
        ],
    },
    {
        id: 'exterior',
        titulo: 'Lavado exterior y detallado',
        descripcion:
            'Lavado completo de carrocería, rines y trabajo de secado para acabado sin marcas.',
        incluye: [
            'Prelavado para remover suciedad pesada',
            'Lavado a mano con champú de pH neutro',
            'Limpieza y abrillantado de rines',
            'Secado y cuidado de juntas y gomas',
            'Limpieza de cristales y espejos',
        ],
    },
    {
        id: 'pulido',
        titulo: 'Pulido y encerado protector',
        descripcion:
            'Corrección ligera de pintura y protección con cera para brillo duradero.',
        incluye: [
            'Pulido de pintura para mejorar brillo',
            'Eliminación de microrayas y marcas ligeras',
            'Aplicación de cera protectora',
            'Abrillantado final',
        ],
    },
    {
        id: 'motor',
        titulo: 'Lavado de motor',
        descripcion:
            'Limpieza segura del compartimento del motor para mantenimiento estético y detección de fugas.',
        incluye: [
            'Desengrasado controlado',
            'Aclarado y secado por zonas',
            'Protección de componentes electrónicos visibles',
        ],
    },
    {
        id: 'sanitizacion',
        titulo: 'Sanitización y ozono (opcional)',
        descripcion:
            'Tratamientos especiales para eliminar olores y gérmenes en el interior del vehículo.',
        incluye: [
            'Aplicación de sanitizante de amplio espectro',
            'Tratamiento con ozono para eliminación de olores',
            'Refuerzo en zonas de contacto',
        ],
    },
];

// Precios ficticios por servicio y tipo de vehículo (ajustables)
const preciosPorServicio = {
    interiores: {
        'Carro chico': 400,
        'Carro grande': 550,
        'Camioneta chica': 650,
        'Camioneta grande': 800,
        'Motocicleta chica': 200,
        'Motocicleta grande': 300,
    },
    exterior: {
        'Carro chico': 250,
        'Carro grande': 350,
        'Camioneta chica': 400,
        'Camioneta grande': 500,
        'Motocicleta chica': 120,
        'Motocicleta grande': 180,
    },
    pulido: {
        'Carro chico': 800,
        'Carro grande': 1100,
        'Camioneta chica': 1300,
        'Camioneta grande': 1600,
        'Motocicleta chica': 400,
        'Motocicleta grande': 600,
    },
    motor: {
        'Carro chico': 200,
        'Carro grande': 300,
        'Camioneta chica': 350,
        'Camioneta grande': 450,
        'Motocicleta chica': 100,
        'Motocicleta grande': 150,
    },
    sanitizacion: {
        'Carro chico': 150,
        'Carro grande': 220,
        'Camioneta chica': 260,
        'Camioneta grande': 320,
        'Motocicleta chica': 80,
        'Motocicleta grande': 120,
    },
};

const vehicleTypes = [
    'Carro chico',
    'Carro grande',
    'Camioneta chica',
    'Camioneta grande',
    'Motocicleta chica',
    'Motocicleta grande',
];

function formatPrice(value) {
    if (typeof value !== 'number') return '-';
    return `$${value.toLocaleString('es-MX')}`;
}

function Planes() {
    const { isDarkMode } = useTheme();
    const [sidebarWidth, setSidebarWidth] = useState(null);

    // Detect sidebar width (no cambios al sidebar, solo lectura). Keep page responsive to sidebar.
    useEffect(() => {
        if (typeof window === 'undefined') return;

        let nav = document.querySelector('nav');

        const updateWidth = () => {
            nav = nav || document.querySelector('nav');
            if (!nav) {
                setSidebarWidth(null);
                document.documentElement.style.removeProperty('--sidebar-width');
                return;
            }
            const w = nav.offsetWidth || parseInt(getComputedStyle(nav).width, 10) || 0;
            // For small screens we don't want left padding
            const effective = window.innerWidth < 768 ? 0 : w;
            setSidebarWidth(effective);
            document.documentElement.style.setProperty('--sidebar-width', `${effective}px`);
        };

        updateWidth();

        let ro;
        if (typeof ResizeObserver !== 'undefined' && nav) {
            ro = new ResizeObserver(updateWidth);
            ro.observe(nav);
        } else {
            window.addEventListener('resize', updateWidth);
        }

        // Also observe mutations just in case sidebar toggles via class changes
        const mo = new MutationObserver(updateWidth);
        if (nav) mo.observe(nav, { attributes: true, subtree: false, attributeFilter: ['style', 'class'] });

        return () => {
            if (ro && nav) ro.disconnect();
            if (mo) mo.disconnect();
            window.removeEventListener('resize', updateWidth);
            document.documentElement.style.removeProperty('--sidebar-width');
        };
    }, []);

    const pageBg = isDarkMode ? 'bg-[#0A0A0A] text-white' : 'bg-gray-50 text-gray-900';
    const cardBase = isDarkMode ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200';
    const buttonGradient = isDarkMode
        ? 'from-indigo-600 to-emerald-400'
        : 'from-indigo-600 to-blue-500';
    const buttonTextColor = isDarkMode ? 'text-black' : 'text-white';
    const buttonClasses = `bg-gradient-to-r ${buttonGradient} ${buttonTextColor}`;

    // left padding to compensate sidebar width, fallback to CSS var
    const leftPaddingStyle = {
        paddingLeft: sidebarWidth === null ? 'var(--sidebar-width, 80px)' : `${sidebarWidth}px`,
        transition: 'padding-left .2s ease',
    };

    return (
        <div className={`${pageBg} min-h-screen`}>
            <Sidebar />
            <div className="w-full" style={leftPaddingStyle}>
                <div className="p-8 md:p-12 max-w-7xl mx-auto">
                    <header className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Conoce nuestros servicios
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Descubre todos los servicios que ofrecemos para el cuidado y
                            mantenimiento de tu vehículo y elige el que mejor se adapte a tus
                            necesidades.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                        {servicios.map((s) => (
                            <article
                                key={s.id}
                                // Make each card equal height and distribute internal sections evenly
                                className={`flex flex-col justify-between min-h-[520px] rounded-2xl p-6 border ${cardBase} shadow-sm`}
                            >
                                {/* Header */}
                                <div className="mb-4">
                                    <h2 className="text-2xl font-bold mb-1">{s.titulo}</h2>
                                    <p
                                        className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}
                                    >
                                        {s.descripcion}
                                    </p>
                                </div>

                                {/* Includes - allow this block to grow so price/actions stick to bottom */}
                                <div className="mt-4 flex-1 overflow-hidden">
                                    <h3 className="text-sm font-semibold text-gray-300 mb-3">
                                        Incluye:
                                    </h3>
                                    <ul className="space-y-2 max-h-36 overflow-auto pr-2">
                                        {s.incluye.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <span className="mt-1">
                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                </span>
                                                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Precios - keep uniform cards inside a consistent container */}
                                <div className="mt-6 w-full">
                                    <h3 className="text-sm font-semibold text-gray-300 mb-4">
                                        Precios por tipo de vehículo:
                                    </h3>

                                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {vehicleTypes.map((vt) => (
                                            <div
                                                key={vt}
                                                className={`flex flex-col items-center justify-center text-center gap-3 p-6 rounded-lg ${isDarkMode ? 'bg-white/3 border-white/6' : 'bg-gray-50 border-gray-100'} border min-w-0 h-36`}
                                            >
                                                <div className={`text-lg font-semibold truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                                    {vt}
                                                </div>

                                                <div className="w-full flex justify-center">
                                                    <span
                                                        className={`${buttonClasses} inline-flex items-center justify-center px-5 py-2 rounded-full font-semibold text-lg shadow-sm whitespace-nowrap`}
                                                        style={{ minWidth: 140 }}
                                                    >
                                                        {formatPrice(preciosPorServicio[s.id]?.[vt])}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Acción: pegada al fondo para consistencia visual */}
                                <div className="mt-6 pt-4">
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => (window.location.href = '/agregarCita')}
                                            className={`${buttonClasses} inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg hover:opacity-95 transition`}
                                        >
                                            Agendar servicio
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Planes;