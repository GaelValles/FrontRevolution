import React from 'react';
import { Car, Truck, Bike, Check } from 'lucide-react';
import Sidebar from '../pages/components/sidebar';

function Planes() {
  const servicios = {
    simple: {
      nombre: "SILVER",
      color: "gray",
      precio: "499",
      periodo: "Por Servicio",
      caracteristicas: [
        "Lavado exterior completo",
        "Limpieza de rines",
        "Secado a detalle",
        "Aspirado básico interior",
        "Limpieza de vidrios"
      ],
      precios: {
        'carro chico': 120,
        'carro grande': 150,
        'camioneta chica': 170,
        'camioneta grande': 200,
        'motocicleta chica': 80,
        'motocicleta grande': 100
      }
    },
    pulido: {
      nombre: "GOLD",
      color: "amber",
      precio: "1499",
      periodo: "Por Servicio",
      caracteristicas: [
        "Lavado simple completo",
        "Pulido de carrocería",
        "Encerado protector",
        "Abrillantado de rines",
        "Tratamiento de plásticos"
      ],
      precios: {
        'carro chico': 350,
        'carro grande': 400,
        'camioneta chica': 450,
        'camioneta grande': 500,
        'motocicleta chica': 250,
        'motocicleta grande': 300
      }
    },
    especializado: {
      nombre: "PLATINUM",
      color: "zinc",
      precio: "4999",
      periodo: "Por Servicio",
      caracteristicas: [
        "Lavado simple completo",
        "Limpieza profunda de interiores",
        "Lavado de motor",
        "Desmanchado de tapicería",
        "Sanitización completa"
      ],
      precios: {
        'carro chico': 450,
        'carro grande': 550,
        'camioneta chica': 600,
        'camioneta grande': 700,
        'motocicleta chica': 300,
        'motocicleta grande': 350
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Sidebar />
      <div className="p-8 md:p-12 md:ml-20">
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Nuestros Planes
          </h1>
          <p className="text-gray-400 text-lg">
            Selecciona el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {Object.entries(servicios).map(([key, servicio]) => (
            <div key={key} 
                 className="group relative bg-[#111111] rounded-2xl p-8 
                          border border-gray-800 transition-all duration-500">
              
              {/* Card Header */}
              <div className="text-center mb-8">
                <p className="text-sm uppercase tracking-widest mb-4 font-medium text-white">
                  {servicio.nombre}
                </p>
                <div className="flex items-baseline justify-center gap-x-2">
                  <span className="text-2xl text-gray-400">$</span>
                  <span className="text-5xl font-bold text-white">
                    {servicio.precio}
                  </span>
                  <span className="text-gray-500">{servicio.periodo}</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {servicio.caracteristicas.map((caracteristica, index) => (
                  <li key={index} 
                      className="flex items-center gap-3 text-gray-400 hover:text-gray-300">
                    <Check className="w-5 h-5 text-gray-500" />
                    <span>{caracteristica}</span>
                  </li>
                ))}
              </ul>

              {/* Vehicle Prices */}
              <div className="space-y-3 mb-8">
                {Object.entries(servicio.precios).map(([tipo, precio]) => (
                  <div key={tipo} 
                       className="flex items-center justify-between p-3
                                bg-black/40 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-2">
                      {tipo.includes('moto') ? (
                        <Bike className="w-4 h-4 text-gray-400" />
                      ) : tipo.includes('camioneta') ? (
                        <Truck className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Car className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-gray-400 text-sm">{tipo}</span>
                    </div>
                    <span className="text-gray-400">${precio}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button className="w-full py-4 px-6 rounded-xl bg-white/10 
                               hover:bg-white/20 transition-all duration-300
                               text-white font-medium text-sm uppercase tracking-wider">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Planes;