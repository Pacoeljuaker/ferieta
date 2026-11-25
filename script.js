// ======================================================
// CONFIGURACIÓN SUPABASE (OPCIONAL - PEGA TUS CREDENCIALES AQUÍ)
// ======================================================
const SUPABASE_CONFIG = {
  url: "",      // Ej: "https://abcdefghijklm.supabase.co"
  anonKey: "",  // Ej: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  tablePuestos: "puestos_feria",
  tableUsuarios: "usuarios_feria",
  localPuestosKey: "feria_grecia_puestos_v2",
  localUsersKey: "feria_grecia_users_v2",
  localSessionKey: "feria_grecia_session_v2"
};

const FIN_CALLE  = [-33.468226, -70.561343];
const INICIO_CALLE     = [-33.471722, -70.562747];
const FIN_NUEVA_CALLE = [-33.471701, -70.562894];
const INICIO_NUEVA_CALLE    = [-33.468232, -70.561512];

const IMAGENES_CATEGORIA = {
  "Verdulería": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80",
  "Frutería": "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=700&q=80",
  "Frutería & Verdulería": "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=700&q=80",
  "Verdulería & Legumbres": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=80",
  "Frutería & Comida": "https://images.unsplash.com/photo-1567306226416-28f0eb2c62c3?auto=format&fit=crop&w=700&q=80",
  "Abarrotes": "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=700&q=80",
  "Abarrotes & Legumbres": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80",
  "Abarrotes & Limpieza": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=700&q=80",
  "Abarrotes & Mascota": "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=700&q=80",
  "Abarrotes & Tradicional": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80",
  "Pescadería": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=80",
  "Plantas & Jardín": "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=700&q=80",
  "Snacks & Dulces": "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=700&q=80",
  "Snacks & Bebidas": "https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&w=700&q=80",
  "Bazar & Utensilios": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=700&q=80",
  "Fitoterapia & Salud": "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=700&q=80",
  "Comida Preparada & Jugos": "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=700&q=80",
  "Pendiente": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80"
};

function obtenerImagenCategoria(categoria) {
  return IMAGENES_CATEGORIA[categoria] || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80";
}

const CATEGORIA_ESTILOS = {
  "Verdulería": { icono: "fa-leaf", color: "#10b981" },
  "Frutería": { icono: "fa-apple-whole", color: "#ef4444" },
  "Frutería & Verdulería": { icono: "fa-leaf", color: "#10b981" },
  "Abarrotes": { icono: "fa-store", color: "#3b82f6" },
  "Abarrotes & Legumbres": { icono: "fa-seedling", color: "#84cc16" },
  "Abarrotes & Limpieza": { icono: "fa-store", color: "#3b82f6" },
  "Abarrotes & Mascota": { icono: "fa-store", color: "#3b82f6" },
  "Abarrotes & Tradicional": { icono: "fa-store", color: "#3b82f6" },
  "Pescadería": { icono: "fa-fish", color: "#0284c7" },
  "Plantas & Jardín": { icono: "fa-seedling", color: "#84cc16" },
  "Snacks & Dulces": { icono: "fa-cookie-bite", color: "#f97316" },
  "Snacks & Bebidas": { icono: "fa-cookie-bite", color: "#f97316" },
  "Bazar & Utensilios": { icono: "fa-utensils", color: "#a855f7" },
  "Fitoterapia & Salud": { icono: "fa-pills", color: "#14b8a6" },
  "Comida Preparada & Jugos": { icono: "fa-cup-straw", color: "#ec4899" }
};

function generarCoordenadasCalle(inicio, fin, puestos) {
  const total = puestos.length;
  return puestos.map((puesto, index) => {
    const t = total > 1 ? index / (total - 1) : 0;
    const lat = inicio[0] + t * (fin[0] - inicio[0]);
    const lng = inicio[1] + t * (fin[1] - inicio[1]);
    return {
      ...puesto,
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6))
    };
  });
}

// ======================================================
// BASE DE DATOS INICIAL DE PUESTOS (CON DESCRIPCIÓN)
// ======================================================
const PUESTOS_BASE1 = [
  {
    id: 1,
    numero: "Puesto 01",
    nombre: "David",
    categoria: "Snacks & Dulces",
    descripcion: "Venta al detalle y por mayor de dulces, confites, calugones, tabletones y palomitas.",
    icono: "fa-cookie-bite",
    color: "#f97316",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Más Calugon", precio: 5500, unidad: "80 unidades" },
      { nombre: "Tableton", precio: 3000, unidad: "750 gramos" },
      { nombre: "Palomitas", precio: 3000, unidad: "20 unidades" }
    ]
  },
  {
    id: 2,
    numero: "Puesto 02",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 3,
    numero: "Puesto 03",
    nombre: "Magda",
    categoria: "Abarrotes & Mascota",
    descripcion: "Huevos frescos normales y de campo por bandeja, además de alimento a granel para mascotas.",
    icono: "fa-store",
    color: "#3b82f6",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Huevos", precio: 4500, unidad: "30 unidades" },
      { nombre: "Huevos de campo", precio: 9000, unidad: "30 unidades" },
      { nombre: "Alimento para mascotas", precio: 1100, unidad: "kg" }
    ]
  },
  {
    id: 4,
    numero: "Puesto 04",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 5,
    numero: "Puesto 05",
    nombre: "Pescadería Luis Loyola",
    categoria: "Pescadería",
    descripcion: "Pescados frescos del día: merluza, reineta y salmón fileteado o entero.",
    icono: "fa-fish",
    color: "#0284c7",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Merluza", precio: 4000, unidad: "kg" },
      { nombre: "Reineta", precio: 10000, unidad: "kg" },
      { nombre: "Salmon", precio: 18000, unidad: "kg" }
    ]
  },
  {
    id: 6,
    numero: "Puesto 06",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 7,
    numero: "Puesto 07",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 8,
    numero: "Puesto 08",
    nombre: "Los Andes",
    categoria: "Verdulería",
    descripcion: "Verduras frescas seleccionadas de temporada como lechugas, alcachofas y zapallo trozado.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Lechuga", precio: 1000, unidad: "1 unidad" },
      { nombre: "Alcachofas", precio: 2000, unidad: "5 unidades" },
      { nombre: "Zapallo", precio: 1000, unidad: "1/2 kg" }
    ]
  },
  {
    id: 9,
    numero: "Puesto 09",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 10,
    numero: "Puesto 10",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 11,
    numero: "Puesto 11",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 12,
    numero: "Puesto 12",
    nombre: "Héctor Luis",
    categoria: "Frutería",
    descripcion: "Fruta fresca de estación por kilo: frutillas dulces, mandarinas y plátanos.",
    icono: "fa-apple-whole",
    color: "#ef4444",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Frutilla", precio: 1000, unidad: "kg" },
      { nombre: "Mandarina", precio: 2000, unidad: "kg" },
      { nombre: "Plátano", precio: 2000, unidad: "kg" }
    ]
  },
  {
    id: 13,
    numero: "Puesto 13",
    nombre: "Fernando Morales",
    categoria: "Plantas & Jardín",
    descripcion: "Variedad de plantas de interior, exterior y maceteros pequeños para el hogar.",
    icono: "fa-seedling",
    color: "#84cc16",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Planta interior y de jardín", precio: 2000, unidad: "1 unidad" },
      { nombre: "Plantas chicas", precio: 800, unidad: "1 unidad" }
    ]
  },
  {
    id: 14,
    numero: "Puesto 14",
    nombre: "Los Montecinos",
    categoria: "Abarrotes & Limpieza",
    descripcion: "Artículos de aseo, papel higiénico, servilletas y productos básicos para el hogar.",
    icono: "fa-store",
    color: "#3b82f6",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Swan", precio: 2200, unidad: "1 unidad" },
      { nombre: "Like", precio: 2500, unidad: "1 unidad" },
      { nombre: "Servilletas bezella", precio: 2000, unidad: "1 unidad" }
    ]
  },
  {
    id: 15,
    numero: "Puesto 15",
    nombre: "Huevos Kika",
    categoria: "Abarrotes",
    descripcion: "Venta especializada de bandejas de huevos blancos en calibres tercera, extra y súper extra.",
    icono: "fa-store",
    color: "#3b82f6",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Huevo tercera blanca", precio: 3800, unidad: "30 unidades" },
      { nombre: "Huevo extra blanco", precio: 5800, unidad: "30 unidades" },
      { nombre: "Huevo super extra blanco", precio: 6900, unidad: "30 unidades" }
    ]
  },
  {
    id: 16,
    numero: "Puesto 16",
    nombre: "Isidora Olivera",
    categoria: "Verdulería",
    descripcion: "Paltas Hass maduras y para guardar, tomates frescos y chirimoyas de calidad.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Palta hass", precio: 3000, unidad: "kg" },
      { nombre: "Tomate", precio: 1500, unidad: "kg" },
      { nombre: "Chirimoya", precio: 3000, unidad: "kg" }
    ]
  },
  {
    id: 17,
    numero: "Puesto 17",
    nombre: "Javier Benitez",
    categoria: "Verdulería",
    descripcion: "Hortalizas frescas por kilo como espárragos, zapallo y brócoli.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Espárragos", precio: 2000, unidad: "kg" },
      { nombre: "Zapallo", precio: 2500, unidad: "kg" },
      { nombre: "Brócoli", precio: 1500, unidad: "kg" }
    ]
  },
  {
    id: 18,
    numero: "Puesto 18",
    nombre: "Los Montecinos",
    categoria: "Abarrotes & Limpieza",
    descripcion: "Detergentes líquidos, lavalozas y suavizantes económicos para el lavado diario.",
    icono: "fa-store",
    color: "#3b82f6",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Wyn lavalozas", precio: 1500, unidad: "750ml" },
      { nombre: "Detergente omo (rinde 3L)", precio: 1000, unidad: "3l" },
      { nombre: "Suavizante soft", precio: 2000, unidad: "1l" }
    ]
  },
  {
    id: 19,
    numero: "Puesto 19",
    nombre: "Del mundo a su mesa",
    categoria: "Verdulería",
    descripcion: "Condimentos frescos, jengibre, cebolla morada y ají chileno para cocinar.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Jengibre", precio: 6000, unidad: "kg" },
      { nombre: "Cebolla morada", precio: 1600, unidad: "kg" },
      { nombre: "Ají chileno", precio: 15000, unidad: "kg" }
    ]
  },
  {
    id: 20,
    numero: "Puesto 20",
    nombre: "Mai",
    categoria: "Bazar & Utensilios",
    descripcion: "Utensilios de cocina prácticos: cuchillos, tijeras multiuso y tostadores tradicionales.",
    icono: "fa-utensils",
    color: "#a855f7",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Cuchillo", precio: 2000, unidad: "1 unidad" },
      { nombre: "Tijeras", precio: 2500, unidad: "1 unidad" },
      { nombre: "Tostadores", precio: 2000, unidad: "1 unidad" }
    ]
  },
  {
    id: 21,
    numero: "Puesto 21",
    nombre: "Diconga flores",
    categoria: "Plantas & Jardín",
    descripcion: "Ramos de flores frescas, almácigos y tierra de hoja preparada para jardín.",
    icono: "fa-seedling",
    color: "#84cc16",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Ramos de flores", precio: 3000, unidad: "1 unidad" },
      { nombre: "Almacius", precio: 1500, unidad: "1 unidad" },
      { nombre: "Tierra", precio: 1000, unidad: "kg" }
    ]
  },
  {
    id: 22,
    numero: "Puesto 22",
    nombre: "Juana Gonzáles",
    categoria: "Abarrotes",
    descripcion: "Productos tradicionales chilenos: mote de trigo, cochayuyo y aceitunas por cuarto.",
    icono: "fa-store",
    color: "#3b82f6",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Mote", precio: 1800, unidad: "kg" },
      { nombre: "Cochayullo", precio: 2500, unidad: "1 unidad" },
      { nombre: "Aceitunas (cuarto)", precio: 1800, unidad: "250gr" }
    ]
  },
  {
    id: 23,
    numero: "Puesto 23",
    nombre: "Juan Guillermo",
    categoria: "Verdulería",
    descripcion: "Verduras frescas de temporada: alcachofas por paquete, zapallo y espárragos.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Alcachofas", precio: 2000, unidad: "4 unidades" },
      { nombre: "Zapallo (medio kilo)", precio: 1200, unidad: "1/2 kg" },
      { nombre: "Espárragos", precio: 2000, unidad: "kg" }
    ]
  },
  {
    id: 24,
    numero: "Puesto 24",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 25,
    numero: "Puesto 25",
    nombre: "Abarrotes Gaspar",
    categoria: "Abarrotes",
    descripcion: "Abarrotes esenciales para la despensa: azúcar, arroz y paquetes de fideos.",
    icono: "fa-store",
    color: "#3b82f6",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Azúcar", precio: 1000, unidad: "kg" },
      { nombre: "Arroz", precio: 990, unidad: "kg" },
      { nombre: "Fideos", precio: 990, unidad: "2 unidades" }
    ]
  },
  {
    id: 26,
    numero: "Puesto 26",
    nombre: "Adelaida Araya",
    categoria: "Verdulería",
    descripcion: "Cebollas por malla, cilantro fresco y betarragas seleccionadas.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Cebolla", precio: 2000, unidad: "5 unidades" },
      { nombre: "Cilantro", precio: 1000, unidad: "1 unidad" },
      { nombre: "Betarraga", precio: 1500, unidad: "kg" }
    ]
  },
  {
    id: 27,
    numero: "Puesto 27",
    nombre: "Marlene",
    categoria: "Verdulería",
    descripcion: "Pepinos de ensalada, espárragos frescos y limones jugosos a buen precio.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Pepino", precio: 1000, unidad: "2 unidades" },
      { nombre: "Espárragos", precio: 1600, unidad: "kg" },
      { nombre: "Limón", precio: 500, unidad: "kg" }
    ]
  },
  {
    id: 28,
    numero: "Puesto 28",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 29,
    numero: "Puesto 29",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 30,
    numero: "Puesto 30",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 31,
    numero: "Puesto 31",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 32,
    numero: "Puesto 32",
    nombre: "Fruta con sanitos",
    categoria: "Frutería",
    descripcion: "Frutas frescas y paltas seleccionadas para consumo diario.",
    icono: "fa-apple-whole",
    color: "#ef4444",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Plátano", precio: 1700, unidad: "kg" },
      { nombre: "Frutilla", precio: 1000, unidad: "kg" },
      { nombre: "Palta", precio: 3000, unidad: "kg" }
    ]
  },
  {
    id: 33,
    numero: "Puesto 33",
    nombre: "papas y cereales",
    categoria: "Verdulería",
    descripcion: "Especialidad en papas lavadas, sucias y semillón por kilo.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Semillón", precio: 800, unidad: "kg" },
      { nombre: "Papa sucia", precio: 1000, unidad: "kg" },
      { nombre: "Papa lavada", precio: 1400, unidad: "kg" }
    ]
  },
  {
    id: 34,
    numero: "Puesto 34",
    nombre: "Fanny Guajardo",
    categoria: "Verdulería",
    descripcion: "Bandejas de ensaladas listas para servir, chapsui de verduras y espárragos.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Espárragos", precio: 1000, unidad: "kg" },
      { nombre: "Ensalada", precio: 1000, unidad: "2 unidades" },
      { nombre: "Chapsui", precio: 1000, unidad: "1 unidad" }
    ]
  },
  {
    id: 35,
    numero: "Puesto 35",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 36,
    numero: "Puesto 36",
    nombre: "Botica Bethesdalem",
    categoria: "Fitoterapia & Salud",
    descripcion: "Hierbas medicinales naturales, pomadas artesanales y shampoo herbal.",
    icono: "fa-pills",
    color: "#14b8a6",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Hierba", precio: 1000, unidad: "kg" },
      { nombre: "Pomadas", precio: 1000, unidad: "1 unidad" },
      { nombre: "Shampoo", precio: 6000, unidad: "1l" }
    ]
  },
  {
    id: 37,
    numero: "Puesto 37",
    nombre: "Viajo Nilo",
    categoria: "Verdulería",
    descripcion: "Papas de distintas variedades (La Serena y sureña) y semillón.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Papá la serena", precio: 1500, unidad: "kg" },
      { nombre: "Semillón", precio: 1000, unidad: "kg" },
      { nombre: "Papá sureña", precio: 4000, unidad: "3 unidades" }
    ]
  },
  {
    id: 38,
    numero: "Puesto 38",
    nombre: "Leonor",
    categoria: "Verdulería",
    descripcion: "Porotos granados/blancos, espárragos y bandejas surtidas de verduras para cazuela o carbonada.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Espárragos", precio: 2000, unidad: "kg" },
      { nombre: "Poroto blanco", precio: 3000, unidad: "kg" },
      { nombre: "Bandejas de verdura", precio: 1000, unidad: "1 unidad" }
    ]
  },
  {
    id: 39,
    numero: "Puesto 39",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 40,
    numero: "Puesto 40",
    nombre: "Su casero",
    categoria: "Pescadería",
    descripcion: "Productos del mar frescos: merluza austral, albacora y reineta por kilo.",
    icono: "fa-fish",
    color: "#0284c7",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Merluza austral", precio: 8000, unidad: "kg" },
      { nombre: "Albacora", precio: 12000, unidad: "kg" },
      { nombre: "Reineta", precio: 8000, unidad: "kg" }
    ]
  },
  {
    id: 41,
    numero: "Puesto 41",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 42,
    numero: "Puesto 42",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 43,
    numero: "Puesto 43",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 44,
    numero: "Puesto 44",
    nombre: "Barbara Ortega",
    categoria: "Verdulería",
    descripcion: "Hojas verdes gourmet y hongos frescos: rúcula, champiñones y berros.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Rúcula", precio: 1000, unidad: "150gr" },
      { nombre: "Champiñón", precio: 2500, unidad: "250gr" },
      { nombre: "Berro", precio: 1000, unidad: "100gr" }
    ]
  },
  {
    id: 45,
    numero: "Puesto 45",
    nombre: "Fresia",
    categoria: "Frutería",
    descripcion: "Frutas dulces de temporada: naranjas de jugo, sandía y manzanas.",
    icono: "fa-apple-whole",
    color: "#ef4444",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Naranja", precio: 6000, unidad: "kg" },
      { nombre: "Sandía", precio: 2000, unidad: "kg" },
      { nombre: "Manzana", precio: 800, unidad: "kg" }
    ]
  },
  {
    id: 46,
    numero: "Puesto 46",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 47,
    numero: "Puesto 47",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 48,
    numero: "Puesto 48",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 49,
    numero: "Puesto 49",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 50,
    numero: "Puesto 50",
    nombre: "Alexandra Vergara",
    categoria: "Verdulería",
    descripcion: "Verduras frescas por unidad y medio kilo: espárragos, cebollas y lechuga costina.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Espárragos", precio: 1000, unidad: "1/2kg" },
      { nombre: "Cebolla", precio: 400, unidad: "1 unidad" },
      { nombre: "Costina", precio: 1500, unidad: "1 unidad" }
    ]
  }
];

const PUESTOS_BASE2 = [
  {
    id: 51,
    numero: "Puesto 51",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 52,
    numero: "Puesto 52",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 53,
    numero: "Puesto 53",
    nombre: "Astrid",
    categoria: "Verdulería",
    descripcion: "Limones, zapallos y tomates frescos a precios accesibles.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Limón", precio: 1000, unidad: "1/2kg" },
      { nombre: "Zapallo", precio: 2000, unidad: "3 unidades" },
      { nombre: "Tomate", precio: 1300, unidad: "kg" }
    ]
  },
  {
    id: 54,
    numero: "Puesto 54",
    nombre: "Juan Andrés",
    categoria: "Frutería & Verdulería",
    descripcion: "Surtido de frutas y verduras frescas: tomates, paltas y peras de estación.",
    icono: "fa-apple-whole",
    color: "#ef4444",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Tomate", precio: 1300, unidad: "kg" },
      { nombre: "Palta", precio: 2500, unidad: "kg" },
      { nombre: "Pera", precio: 1300, unidad: "kg" }
    ]
  },
  {
    id: 55,
    numero: "Puesto 55",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 56,
    numero: "Puesto 56",
    nombre: "Antonio",
    categoria: "Abarrotes & Legumbres",
    descripcion: "Legumbres seleccionadas por kilo (porotos, lentejas) y papas frescas.",
    icono: "fa-seedling",
    color: "#84cc16",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Poroto", precio: 3000, unidad: "kg" },
      { nombre: "Lentejas", precio: 3500, unidad: "kg" },
      { nombre: "Papas", precio: 1200, unidad: "kg" }
    ]
  },
  {
    id: 57,
    numero: "Puesto 57",
    nombre: "Isabel cabrera",
    categoria: "Verdulería",
    descripcion: "Ensaladas preparadas, pasta de ají pebre casero y atados de apio fresco.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Ensalada", precio: 1000, unidad: "1 unidad" },
      { nombre: "Ají pebre", precio: 1000, unidad: "1 unidad" },
      { nombre: "Hojas de apio", precio: 600, unidad: "1 unidad" }
    ]
  },
  {
    id: 58,
    numero: "Puesto 58",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 59,
    numero: "Puesto 59",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 60,
    numero: "Puesto 60",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 61,
    numero: "Puesto 61",
    nombre: "Eduardo Escobar",
    categoria: "Plantas & Jardín",
    descripcion: "Flores de temporada, ruda y plantines de tomate listos para trasplantar.",
    icono: "fa-seedling",
    color: "#84cc16",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Flores temporada", precio: 1000, unidad: "1 unidad" },
      { nombre: "Ruta", precio: 1000, unidad: "1 unidad" },
      { nombre: "Planta de tomate", precio: 1000, unidad: "1 unidad" }
    ]
  },
  {
    id: 62,
    numero: "Puesto 62",
    nombre: "Casero las papas",
    categoria: "Verdulería & Legumbres",
    descripcion: "Papas por kilo, legumbres fraccionadas y miel pura de abeja.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Papá", precio: 1600, unidad: "kg" },
      { nombre: "Legumbres", precio: 1800, unidad: "1/2kg" },
      { nombre: "Miel", precio: 6900, unidad: "kg" }
    ]
  },
  {
    id: 63,
    numero: "Puesto 63",
    nombre: "sergio",
    categoria: "Snacks & Bebidas",
    descripcion: "Snacks dulces, bebidas frías y energéticas para refrescarse durante la compra.",
    icono: "fa-cookie-bite",
    color: "#f97316",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Palomitos", precio: 1400, unidad: "1 unidad" },
      { nombre: "Bebidas", precio: 1500, unidad: "1 unidad" },
      { nombre: "Energéticas", precio: 1500, unidad: "1 unidad" }
    ]
  },
  {
    id: 64,
    numero: "Puesto 64",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 65,
    numero: "Puesto 65",
    nombre: "caterin Saavedra",
    categoria: "Frutería",
    descripcion: "Frutas frescas por kilo: manzanas, naranjas y mandarinas.",
    icono: "fa-apple-whole",
    color: "#ef4444",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Manzana", precio: 1000, unidad: "kg" },
      { nombre: "Naranja", precio: 800, unidad: "kg" },
      { nombre: "Mandarina", precio: 2000, unidad: "kg" }
    ]
  },
  {
    id: 66,
    numero: "Puesto 66",
    nombre: "Felipe atiman",
    categoria: "Frutería",
    descripcion: "Frutas tropicales y de temporada: paltas, mangos y chirimoyas.",
    icono: "fa-apple-whole",
    color: "#ef4444",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Palta", precio: 3500, unidad: "kg" },
      { nombre: "Mango", precio: 1600, unidad: "1 unidad" },
      { nombre: "Chirimoya", precio: 3500, unidad: "kg" }
    ]
  },
  {
    id: 67,
    numero: "Puesto 67",
    nombre: "Carolina Zuñiga",
    categoria: "Verdulería",
    descripcion: "Zanahorias, limones y bandejas de verduras picadas listas para cocinar.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Zanahoria", precio: 1600, unidad: "kg" },
      { nombre: "Limon", precio: 600, unidad: "kg" },
      { nombre: "bandejas de verdura", precio: 1000, unidad: "1 unidad" }
    ]
  },
  {
    id: 68,
    numero: "Puesto 68",
    nombre: "distribuidora de huevitos don José",
    categoria: "Abarrotes",
    descripcion: "Distribuidora de huevos frescos en formatos jumbo, extra blanco y súper.",
    icono: "fa-store",
    color: "#3b82f6",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Huevo jumbo", precio: 6000, unidad: "1 unidad" },
      { nombre: "Extra blanco", precio: 5900, unidad: "1 unidad" },
      { nombre: "Super", precio: 6900, unidad: "1 unidad" }
    ]
  },
  {
    id: 69,
    numero: "Puesto 69",
    nombre: "Frutas Josefa Ignacia",
    categoria: "Frutería",
    descripcion: "Chirimoyas, tomates y frutillas frescas seleccionadas del día.",
    icono: "fa-apple-whole",
    color: "#ef4444",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Chirimoya", precio: 3500, unidad: "kg" },
      { nombre: "Tomate", precio: 700, unidad: "kg" },
      { nombre: "Frutilla", precio: 1200, unidad: "kg" }
    ]
  },
  {
    id: 70,
    numero: "Puesto 70",
    nombre: "Lina flores",
    categoria: "Verdulería & Legumbres",
    descripcion: "Camotes, papas y legumbres surtidas por kilo.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Camote", precio: 2500, unidad: "kg" },
      { nombre: "Papas", precio: 1700, unidad: "kg" },
      { nombre: "Legumbres", precio: 3500, unidad: "kg" }
    ]
  },
  {
    id: 71,
    numero: "Puesto 71",
    nombre: "Fernando",
    categoria: "Verdulería",
    descripcion: "Ofertas en pimentones, mallas de limón y pepinos de ensalada.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Pimentón", precio: 2000, unidad: "3 unidades" },
      { nombre: "Limón", precio: 1000, unidad: "1.5kg" },
      { nombre: "Pepino", precio: 1000, unidad: "3 unidades" }
    ]
  },
  {
    id: 72,
    numero: "Puesto 72",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 73,
    numero: "Puesto 73",
    nombre: "David González",
    categoria: "Verdulería",
    descripcion: "Papas clasificadas por tamaño (grande, extra y chica) a precios convenientes.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Papa grande", precio: 1200, unidad: "kg" },
      { nombre: "Papa extra", precio: 1500, unidad: "kg" },
      { nombre: "Papa chica", precio: 1000, unidad: "kg" }
    ]
  },
  {
    id: 74,
    numero: "Puesto 74",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 75,
    numero: "Puesto 75",
    nombre: "Jorta Guerra",
    categoria: "Abarrotes & Limpieza",
    descripcion: "Insumos de limpieza doméstica: traperos, paños absorbentes y packs de esponjas.",
    icono: "fa-store",
    color: "#3b82f6",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Trapero", precio: 1000, unidad: "1 unidad" },
      { nombre: "Paño", precio: 4000, unidad: "1 unidad" },
      { nombre: "Esponja", precio: 1000, unidad: "5 unidades" }
    ]
  },
  {
    id: 76,
    numero: "Puesto 76",
    nombre: "Donde Las Chiquillas",
    categoria: "Frutería & Verdulería",
    descripcion: "Frutillas, paltas y plátanos seleccionados con atención cercana.",
    icono: "fa-apple-whole",
    color: "#ef4444",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Frutilla", precio: 1200, unidad: "kg" },
      { nombre: "Palta", precio: 3800, unidad: "kg" },
      { nombre: "Plátanos", precio: 1700, unidad: "kg" }
    ]
  },
  {
    id: 77,
    numero: "Puesto 77",
    nombre: "Sara",
    categoria: "Abarrotes",
    descripcion: "Huevos blancos y de color junto con queso fresco y mantecoso por kilo.",
    icono: "fa-store",
    color: "#3b82f6",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Huevo blanco", precio: 4200, unidad: "1 unidad" },
      { nombre: "Huevo de color", precio: 6200, unidad: "1 unidad" },
      { nombre: "Queso", precio: 10000, unidad: "kg" }
    ]
  },
  {
    id: 78,
    numero: "Puesto 78",
    nombre: "Juan Carper",
    categoria: "Abarrotes & Tradicional",
    descripcion: "Frutos secos y productos típicos: aceitunas, harina tostada y maní.",
    icono: "fa-store",
    color: "#3b82f6",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Aceitunas", precio: 2500, unidad: "cuarto" },
      { nombre: "Harina tostada", precio: 2000, unidad: "kg" },
      { nombre: "Maní", precio: 1500, unidad: "cuarto" }
    ]
  },
  {
    id: 79,
    numero: "Puesto 79",
    nombre: "Omar Páez",
    categoria: "Frutería & Verdulería",
    descripcion: "Paltas, tomates y plátanos frescos por kilo.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Palta", precio: 2500, unidad: "kg" },
      { nombre: "Tomate", precio: 1500, unidad: "kg" },
      { nombre: "Plátano", precio: 1800, unidad: "kg" }
    ]
  },
  {
    id: 80,
    numero: "Puesto 80",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 81,
    numero: "Puesto 81",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 82,
    numero: "Puesto 82",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 83,
    numero: "Puesto 83",
    nombre: "Huevos Loop",
    categoria: "Abarrotes",
    descripcion: "Bandejas de huevos frescos en calibres jumbo, súper y extra.",
    icono: "fa-store",
    color: "#3b82f6",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Huevo jumbo", precio: 8000, unidad: "20 unidades" },
      { nombre: "Huevo super", precio: 7000, unidad: "30 unidades" },
      { nombre: "Huevo extra", precio: 6500, unidad: "30 unidades" }
    ]
  },
  {
    id: 84,
    numero: "Puesto 84",
    nombre: "Jugos Karen",
    categoria: "Comida Preparada & Jugos",
    descripcion: "Jugos naturales preparados al momento con fruta fresca (frutilla, piña y arándano).",
    icono: "fa-cup-straw",
    color: "#ec4899",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Frutilla en agua", precio: 2500, unidad: "1 unidad" },
      { nombre: "Piña en agua", precio: 2500, unidad: "1 unidad" },
      { nombre: "Arándano en agua", precio: 2500, unidad: "1 unidad" }
    ]
  },
  {
    id: 85,
    numero: "Puesto 85",
    nombre: "Alexis",
    categoria: "Verdulería",
    descripcion: "Espárragos, betarragas y lechugas frescas por unidad.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Espárragos", precio: 1500, unidad: "1 unidad" },
      { nombre: "Betarraga", precio: 1500, unidad: "1 unidad" },
      { nombre: "Lechuga", precio: 1000, unidad: "1 unidad" }
    ]
  },
  {
    id: 86,
    numero: "Puesto 86",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 87,
    numero: "Puesto 87",
    nombre: "Frutos Del País Rey",
    categoria: "Abarrotes & Legumbres",
    descripcion: "Mote, aceitunas y legumbres seleccionadas fraccionadas por medio kilo o cuarto.",
    icono: "fa-store",
    color: "#3b82f6",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Mote", precio: 900, unidad: "1/2 kg" },
      { nombre: "Aceitunas", precio: 1500, unidad: "cuarto" },
      { nombre: "Legumbres", precio: 1800, unidad: "1/2 kg" }
    ]
  },
  {
    id: 88,
    numero: "Puesto 88",
    nombre: "Pascale Andrea",
    categoria: "Frutería",
    descripcion: "Paltas, chirimoyas y frutillas frescas por kilo.",
    icono: "fa-apple-whole",
    color: "#ef4444",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Palta", precio: 3500, unidad: "kg" },
      { nombre: "Chirimoya", precio: 3500, unidad: "kg" },
      { nombre: "Frutilla", precio: 1200, unidad: "kg" }
    ]
  },
  {
    id: 89,
    numero: "Puesto 89",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 90,
    numero: "Puesto 90",
    nombre: "Heraldo",
    categoria: "Frutería & Verdulería",
    descripcion: "Paltas, tomates y plátanos frescos por kilo.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Palta", precio: 2500, unidad: "kg" },
      { nombre: "Tomate", precio: 1200, unidad: "kg" },
      { nombre: "Plátano", precio: 1700, unidad: "kg" }
    ]
  },
  {
    id: 91,
    numero: "Puesto 91",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 92,
    numero: "Puesto 92",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 93,
    numero: "Puesto 93",
    nombre: "Carlos Aradán",
    categoria: "Frutería & Verdulería",
    descripcion: "Limones por bolsa, tomates cherry y tomates tradicionales.",
    icono: "fa-apple-whole",
    color: "#ef4444",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Limón", precio: 1000, unidad: "2 kg" },
      { nombre: "Cherry", precio: 2500, unidad: "kg" },
      { nombre: "Tomate", precio: 2000, unidad: "kg" }
    ]
  },
  {
    id: 94,
    numero: "Puesto 94",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 95,
    numero: "Puesto 95",
    nombre: "Sin Nombre",
    categoria: "Frutería & Verdulería",
    descripcion: "Venta de tomates y limones frescos por kilo.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Tomate", precio: 1300, unidad: "kg" },
      { nombre: "Limón", precio: 700, unidad: "kg" }
    ]
  },
  {
    id: 96,
    numero: "Puesto 96",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 97,
    numero: "Puesto 97",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 98,
    numero: "Puesto 98",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 99,
    numero: "Puesto 99",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 100,
    numero: "Puesto 100",
    nombre: "Rafael Barrales",
    categoria: "Frutería & Verdulería",
    descripcion: "Tomates, pimentones y limones frescos por kilo o unidad.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Tomate", precio: 1400, unidad: "kg" },
      { nombre: "Pimentón", precio: 1500, unidad: "1 unidad" },
      { nombre: "Limón", precio: 400, unidad: "kg" }
    ]
  },
  {
    id: 101,
    numero: "Puesto 101",
    nombre: "Nicol",
    categoria: "Frutería & Comida",
    descripcion: "Frutas frescas de temporada: frutillas, plátanos y sandías.",
    icono: "fa-apple-whole",
    color: "#ef4444",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Frutilla", precio: 1000, unidad: "kg" },
      { nombre: "Plátano", precio: 1600, unidad: "kg" },
      { nombre: "Sandía", precio: 1000, unidad: "1 unidad" }
    ]
  },
  {
    id: 102,
    numero: "Puesto 102",
    nombre: "Sin Nombre",
    categoria: "Verdulería",
    descripcion: "Papas por mallas y kilos: papas Serena, papas nuevas y papas tradicionales.",
    icono: "fa-leaf",
    color: "#10b981",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [
      { nombre: "Papas Serena", precio: 3200, unidad: "2 kg" },
      { nombre: "Papas nuevas", precio: 2400, unidad: "3 kg" },
      { nombre: "Papas", precio: 4000, unidad: "3 kg" }
    ]
  },
  {
    id: 103,
    numero: "Puesto 103",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 104,
    numero: "Puesto 104",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 105,
    numero: "Puesto 105",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 106,
    numero: "Puesto 106",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  },
  {
    id: 107,
    numero: "Puesto 107",
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  }
];



let map;
let markersLayerGroup;
let STALLS = [];
let currentUser = null; // { id, nombre, email, token }
let pendingStallAfterAuth = null; // Si intentó registrar un puesto antes de iniciar sesión

// ======================================================
// UTILIDADES DE USUARIO Y HASHING
// ======================================================
async function hashPassword(password) {
  const enc = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", enc);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function cargarSesionLocal() {
  try {
    const raw = localStorage.getItem(SUPABASE_CONFIG.localSessionKey);
    if (raw) currentUser = JSON.parse(raw);
  } catch (_) {
    currentUser = null;
  }
  renderUserHeader();
}

function guardarSesionLocal(userObj) {
  currentUser = userObj;
  if (userObj) {
    localStorage.setItem(SUPABASE_CONFIG.localSessionKey, JSON.stringify(userObj));
  } else {
    localStorage.removeItem(SUPABASE_CONFIG.localSessionKey);
  }
  renderUserHeader();
  if (markersLayerGroup) aplicarFiltros();
}

function renderUserHeader() {
  const container = document.getElementById("user-header-controls");
  if (!container) return;

  if (currentUser) {
    container.innerHTML = `
      <div class="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-xl">
        <div class="w-6 h-6 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs font-bold">
          ${escapeHtml(currentUser.nombre.charAt(0).toUpperCase())}
        </div>
        <span class="text-xs font-semibold text-slate-200 max-w-[110px] truncate">${escapeHtml(currentUser.nombre)}</span>
        <button onclick="cerrarSesion()" title="Cerrar sesión" class="text-xs text-slate-400 hover:text-rose-400 ml-1 transition">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button onclick="openAuthModal('login')" class="text-xs font-semibold bg-slate-700/80 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-600 transition">
        Iniciar Sesión
      </button>
      <button onclick="openAuthModal('register')" class="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl transition shadow-md shadow-emerald-600/20">
        Crear Cuenta
      </button>
    `;
  }
}

function cerrarSesion() {
  guardarSesionLocal(null);
  closeModal();
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function esPuestoPendiente(stall) {
  return (
    String(stall.nombre || "").trim().toLowerCase() === "pendiente" ||
    String(stall.categoria || "").trim().toLowerCase() === "pendiente"
  );
}

function esDueñoDelPuesto(stall) {
  if (!currentUser || esPuestoPendiente(stall)) return false;
  return Boolean(stall.owner_id && String(stall.owner_id) === String(currentUser.id));
}

function normalizarPuesto(puesto) {
  const pendiente = esPuestoPendiente(puesto);
  return {
    ...puesto,
    owner_id: puesto.owner_id || null,
    owner_nombre: puesto.owner_nombre || null,
    imagen: obtenerImagenCategoria(puesto.categoria),
    descripcion:
      puesto.descripcion && puesto.descripcion.trim().length > 0
        ? puesto.descripcion.trim()
        : pendiente
          ? "Puesto disponible para registro de vendedor en Feria Grecia."
          : `Puesto de ${puesto.categoria} atendido por ${puesto.nombre}.`
  };
}

function construirPuestoPendienteBase(id) {
  const baseList = [
    ...generarCoordenadasCalle(INICIO_CALLE, FIN_CALLE, PUESTOS_BASE1),
    ...generarCoordenadasCalle(INICIO_NUEVA_CALLE, FIN_NUEVA_CALLE, PUESTOS_BASE2)
  ];
  const original = baseList.find(p => p.id === id) || STALLS.find(p => p.id === id);
  return normalizarPuesto({
    id: original.id,
    numero: original.numero,
    nombre: "Pendiente",
    categoria: "Pendiente",
    descripcion: "Puesto disponible para registro de vendedor en Feria Grecia.",
    icono: "fa-basket-shopping",
    color: "#64748b",
    imagen: obtenerImagenCategoria("Pendiente"),
    lat: original.lat,
    lng: original.lng,
    owner_id: null,
    owner_nombre: null,
    productos: [{ nombre: "Por definir", precio: 1000, unidad: "kg" }]
  });
}

// ======================================================
// AUTENTICACIÓN (VERCEL API -> SUPABASE -> LOCALSTORAGE)
// ======================================================
async function parseJsonSafe(res) {
  const rawText = await res.text();
  try {
    return { ok: res.ok, status: res.status, data: JSON.parse(rawText), rawText };
  } catch (_) {
    return { ok: false, status: res.status, data: null, rawText };
  }
}

async function autenticarUsuario({ mode, nombre, email, password }) {
  const emailClean = email.trim().toLowerCase();
  const passHash = await hashPassword(password);

  // 1. Intentar API Serverless (/api/auth)
  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, nombre, email: emailClean, password_hash: passHash })
    });
    if (res.status !== 404 && res.status !== 503) {
      const parsed = await parseJsonSafe(res);
      if (!parsed.data) {
        throw new Error(parsed.rawText || `Error de autenticación (${parsed.status})`);
      }
      if (!res.ok || !parsed.data.ok) {
        throw new Error(parsed.data.error || "Error de autenticación.");
      }
      return parsed.data.user;
    }
  } catch (err) {
    if (err.message && !err.message.includes("Failed to fetch")) {
      throw err;
    }
  }

  // 2. Intentar Supabase directo si está configurado
  if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
    const headers = {
      "Content-Type": "application/json",
      apikey: SUPABASE_CONFIG.anonKey,
      Authorization: `Bearer ${SUPABASE_CONFIG.anonKey}`
    };

    if (mode === "register") {
      const checkRes = await fetch(
        `${SUPABASE_CONFIG.url}/rest/v1/${SUPABASE_CONFIG.tableUsuarios}?email=eq.${encodeURIComponent(emailClean)}&select=id`,
        { headers }
      );
      const existing = await checkRes.json();
      if (Array.isArray(existing) && existing.length > 0) {
        throw new Error("Este correo ya está registrado. Inicia sesión.");
      }

      const newUser = {
        id: crypto.randomUUID(),
        nombre: nombre.trim(),
        email: emailClean,
        password_hash: passHash
      };

      const insRes = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/${SUPABASE_CONFIG.tableUsuarios}`, {
        method: "POST",
        headers: { ...headers, Prefer: "return=representation" },
        body: JSON.stringify(newUser)
      });
      if (!insRes.ok) throw new Error("No se pudo crear el usuario en la base de datos.");
      const created = await insRes.json();
      return { id: created[0].id, nombre: created[0].nombre, email: created[0].email, password_hash: passHash };
    } else {
      const loginRes = await fetch(
        `${SUPABASE_CONFIG.url}/rest/v1/${SUPABASE_CONFIG.tableUsuarios}?email=eq.${encodeURIComponent(emailClean)}&select=*`,
        { headers }
      );
      const rows = await loginRes.json();
      if (!Array.isArray(rows) || rows.length === 0 || rows[0].password_hash !== passHash) {
        throw new Error("Correo o contraseña incorrectos.");
      }
      return { id: rows[0].id, nombre: rows[0].nombre, email: rows[0].email, password_hash: passHash };
    }
  }

  // 3. Fallback localStorage (para pruebas locales sin nube)
  const usersRaw = localStorage.getItem(SUPABASE_CONFIG.localUsersKey);
  const users = usersRaw ? JSON.parse(usersRaw) : [];

  if (mode === "register") {
    if (users.some(u => u.email === emailClean)) {
      throw new Error("Este correo ya está registrado. Inicia sesión.");
    }
    const newUser = {
      id: "usr_" + Date.now(),
      nombre: nombre.trim(),
      email: emailClean,
      password_hash: passHash
    };
    users.push(newUser);
    localStorage.setItem(SUPABASE_CONFIG.localUsersKey, JSON.stringify(users));
    return { id: newUser.id, nombre: newUser.nombre, email: newUser.email, password_hash: passHash };
  } else {
    const found = users.find(u => u.email === emailClean && u.password_hash === passHash);
    if (!found) {
      throw new Error("Correo o contraseña incorrectos.");
    }
    return { id: found.id, nombre: found.nombre, email: found.email, password_hash: passHash };
  }
}

// ======================================================
// MODAL DE INICIO DE SESIÓN / REGISTRO DE USUARIO
// ======================================================
function openAuthModal(defaultMode = "login", avisoExtra = "") {
  const modal = document.getElementById("auth-modal");
  const box = modal.querySelector("div");
  const isRegister = defaultMode === "register";

  box.innerHTML = `
    <div class="px-5 py-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/60">
      <div>
        <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">Cuenta de Vendedor</span>
        <h2 class="text-lg font-bold text-slate-100">${isRegister ? "Crear Cuenta" : "Iniciar Sesión"}</h2>
      </div>
      <button onclick="closeAuthModal()" class="bg-slate-800 hover:bg-slate-700 text-slate-300 w-9 h-9 rounded-full flex items-center justify-center border border-slate-700 transition">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <div class="p-5 space-y-4">
      ${avisoExtra ? `
        <div class="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs p-3 rounded-xl flex items-start gap-2">
          <i class="fa-solid fa-lock mt-0.5"></i>
          <span>${escapeHtml(avisoExtra)}</span>
        </div>
      ` : ""}

      <!-- Tabs Login / Registro -->
      <div class="grid grid-cols-2 bg-slate-900 p-1 rounded-xl border border-slate-700">
        <button type="button" onclick="openAuthModal('login', '${escapeHtml(avisoExtra)}')"
          class="py-1.5 text-xs font-bold rounded-lg transition ${!isRegister ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200"}">
          Iniciar Sesión
        </button>
        <button type="button" onclick="openAuthModal('register', '${escapeHtml(avisoExtra)}')"
          class="py-1.5 text-xs font-bold rounded-lg transition ${isRegister ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200"}">
          Registrarse
        </button>
      </div>

      <form id="auth-form" class="space-y-3.5">
        ${isRegister ? `
          <div>
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Tu Nombre *</label>
            <input type="text" name="nombre" required placeholder="Ej: Pedro González"
              class="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none">
          </div>
        ` : ""}

        <div>
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Correo Electrónico *</label>
          <input type="email" name="email" required placeholder="vendedor@correo.cl"
            class="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Contraseña *</label>
          <input type="password" name="password" required minlength="4" placeholder="Mínimo 4 caracteres"
            class="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none">
        </div>

        <p id="auth-error" class="text-xs text-rose-400 hidden"></p>

        <button type="submit" id="btn-auth-submit" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2">
          <i class="fa-solid ${isRegister ? "fa-user-plus" : "fa-right-to-bracket"}"></i>
          ${isRegister ? "Crear Cuenta y Continuar" : "Entrar"}
        </button>
      </form>
    </div>
  `;

  modal.classList.remove("hidden");

  document.getElementById("auth-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const errEl = document.getElementById("auth-error");
    const btn = document.getElementById("btn-auth-submit");
    errEl.classList.add("hidden");

    const fd = new FormData(e.target);
    const nombre = String(fd.get("nombre") || "");
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");

    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Procesando...`;

    try {
      const user = await autenticarUsuario({
        mode: isRegister ? "register" : "login",
        nombre,
        email,
        password
      });
      guardarSesionLocal(user);
      closeAuthModal();

      // Si el usuario venía desde un puesto pendiente o clic derecho en el mapa, abrirle el formulario directo
      if (pendingStallAfterAuth) {
        const targetId = pendingStallAfterAuth;
        pendingStallAfterAuth = null;
        openRegisterForm(targetId);
      } else if (pendingCoordsAfterAuth) {
        const targetCoords = pendingCoordsAfterAuth;
        pendingCoordsAfterAuth = null;
        openRegisterForm(null, targetCoords);
      }
    } catch (err) {
      errEl.textContent = err.message || "Error al iniciar sesión.";
      errEl.classList.remove("hidden");
      btn.disabled = false;
      btn.innerHTML = isRegister ? "Crear Cuenta y Continuar" : "Entrar";
    }
  });
}

function closeAuthModal() {
  document.getElementById("auth-modal").classList.add("hidden");
}

document.getElementById("auth-modal").addEventListener("click", (e) => {
  if (e.target.id === "auth-modal") {
    pendingStallAfterAuth = null;
    closeAuthModal();
  }
});

// ======================================================
// BACKEND DE PUESTOS (VERCEL API -> SUPABASE -> LOCALSTORAGE)
// ======================================================
async function cargarPuestosDesdeBackend() {
  const baseConCoordenadas = [
    ...generarCoordenadasCalle(INICIO_CALLE, FIN_CALLE, PUESTOS_BASE1),
    ...generarCoordenadasCalle(INICIO_NUEVA_CALLE, FIN_NUEVA_CALLE, PUESTOS_BASE2)
  ].map(normalizarPuesto);

  const coordMap = new Map(baseConCoordenadas.map(p => [p.id, p]));

  // 1. Intentar API Serverless (/api/puestos)
  try {
    const res = await fetch("/api/puestos", { method: "GET" });
    if (res.ok) {
      const parsed = await parseJsonSafe(res);
      if (parsed.data && Array.isArray(parsed.data.puestos)) {
        actualizarEstadoBadge("Sincronizado (Nube)", "bg-emerald-500");
        return fusionarConBase(baseConCoordenadas, parsed.data.puestos, coordMap);
      }
    }
  } catch (_) {}

  // 2. Intentar Supabase directo
  if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
    try {
      const url = `${SUPABASE_CONFIG.url}/rest/v1/${SUPABASE_CONFIG.tablePuestos}?select=*&order=id.asc`;
      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_CONFIG.anonKey,
          Authorization: `Bearer ${SUPABASE_CONFIG.anonKey}`
        }
      });
      if (res.ok) {
        const rows = await res.json();
        actualizarEstadoBadge("Supabase Activo", "bg-emerald-500");
        return fusionarConBase(baseConCoordenadas, rows, coordMap);
      }
    } catch (err) {
      console.warn("Error leyendo Supabase:", err);
    }
  }

  // 3. Respaldo localStorage
  actualizarEstadoBadge("Modo Local", "bg-amber-400");
  try {
    const guardado = localStorage.getItem(SUPABASE_CONFIG.localPuestosKey);
    if (guardado) {
      const parsed = JSON.parse(guardado);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return fusionarConBase(baseConCoordenadas, parsed, coordMap);
      }
    }
  } catch (err) {
    console.warn("Error leyendo localStorage:", err);
  }

  return baseConCoordenadas;
}

function fusionarConBase(baseList, remoteList) {
  const baseIds = new Set(baseList.map(b => Number(b.id)));
  const remoteMap = new Map(remoteList.map(r => [Number(r.id), r]));

  const fusionadosBase = baseList.map(base => {
    const rem = remoteMap.get(base.id);
    if (!rem) return base;
    return normalizarPuesto({
      ...base,
      ...rem,
      lat: base.lat,
      lng: base.lng,
      productos: typeof rem.productos === "string" ? JSON.parse(rem.productos) : (rem.productos || base.productos)
    });
  });

  const puestosExtra = remoteList
    .filter(r => !baseIds.has(Number(r.id)) && Number(r.lat) && Number(r.lng))
    .map(r =>
      normalizarPuesto({
        ...r,
        id: Number(r.id),
        lat: Number(r.lat),
        lng: Number(r.lng),
        productos: typeof r.productos === "string" ? JSON.parse(r.productos) : (r.productos || [{ nombre: "Por definir", precio: 1000, unidad: "kg" }])
      })
    );

  return [...fusionadosBase, ...puestosExtra];
}

async function guardarPuestoEnBackend(puestoActualizado) {
  if (!currentUser) throw new Error("Debes iniciar sesión para registrar un puesto.");

  // 1. Intentar API Serverless (/api/puestos)
  try {
    const res = await fetch("/api/puestos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        puesto: puestoActualizado,
        user: {
          id: currentUser.id,
          nombre: currentUser.nombre,
          email: currentUser.email,
          password_hash: currentUser.password_hash
        }
      })
    });
    if (res.status !== 404 && res.status !== 503) {
      const parsed = await parseJsonSafe(res);
      if (!parsed.data) {
        throw new Error(parsed.rawText || `Error al guardar el puesto (${parsed.status})`);
      }
      if (!res.ok || !parsed.data.ok) throw new Error(parsed.data.error || "Error al guardar el puesto.");
      STALLS = STALLS.map(item => (item.id === puestoActualizado.id ? puestoActualizado : item));
      localStorage.setItem(SUPABASE_CONFIG.localPuestosKey, JSON.stringify(STALLS));
      actualizarEstadoBadge("Guardado en Nube", "bg-emerald-500");
      return;
    }
  } catch (err) {
    if (err.message && !err.message.includes("Failed to fetch")) throw err;
  }

  // 2. Supabase directo
  if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
    const url = `${SUPABASE_CONFIG.url}/rest/v1/${SUPABASE_CONFIG.tablePuestos}?on_conflict=id`;
    const payload = {
      id: puestoActualizado.id,
      numero: puestoActualizado.numero,
      nombre: puestoActualizado.nombre,
      categoria: puestoActualizado.categoria,
      descripcion: puestoActualizado.descripcion,
      icono: puestoActualizado.icono,
      color: puestoActualizado.color,
      imagen: puestoActualizado.imagen,
      lat: puestoActualizado.lat,
      lng: puestoActualizado.lng,
      owner_id: currentUser.id,
      owner_nombre: currentUser.nombre,
      productos: puestoActualizado.productos
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_CONFIG.anonKey,
        Authorization: `Bearer ${SUPABASE_CONFIG.anonKey}`,
        Prefer: "resolution=merge-duplicates,return=representation"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(await res.text());
    actualizarEstadoBadge("Guardado en Supabase", "bg-emerald-500");
  }

  STALLS = STALLS.map(item => (item.id === puestoActualizado.id ? puestoActualizado : item));
  localStorage.setItem(SUPABASE_CONFIG.localPuestosKey, JSON.stringify(STALLS));
}

async function eliminarPuestoEnBackend(stallId) {
  if (!currentUser) throw new Error("Debes iniciar sesión.");
  const target = STALLS.find(s => s.id === stallId);
  if (!target || !esDueñoDelPuesto(target)) {
    throw new Error("No tienes permiso para eliminar este puesto. Solo el usuario que lo registró puede eliminarlo.");
  }

  const puestoReseteado = construirPuestoPendienteBase(stallId);

  // 1. Intentar API Serverless (/api/puestos)
  try {
    const res = await fetch("/api/puestos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: stallId,
        user: {
          id: currentUser.id,
          email: currentUser.email,
          password_hash: currentUser.password_hash
        }
      })
    });
    if (res.status !== 404 && res.status !== 503) {
      const parsed = await parseJsonSafe(res);
      if (!parsed.data) {
        throw new Error(parsed.rawText || `No se pudo eliminar el puesto (${parsed.status})`);
      }
      if (!res.ok || !parsed.data.ok) throw new Error(parsed.data.error || "No se pudo eliminar el puesto.");
      STALLS = STALLS.map(item => (item.id === stallId ? puestoReseteado : item));
      localStorage.setItem(SUPABASE_CONFIG.localPuestosKey, JSON.stringify(STALLS));
      return puestoReseteado;
    }
  } catch (err) {
    if (err.message && !err.message.includes("Failed to fetch")) throw err;
  }

  // 2. Supabase directo (filtrando por id y owner_id)
  if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
    const url = `${SUPABASE_CONFIG.url}/rest/v1/${SUPABASE_CONFIG.tablePuestos}?id=eq.${stallId}&owner_id=eq.${encodeURIComponent(currentUser.id)}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_CONFIG.anonKey,
        Authorization: `Bearer ${SUPABASE_CONFIG.anonKey}`
      }
    });
    if (!res.ok) throw new Error("Error al eliminar en Supabase.");
  }

  STALLS = STALLS.map(item => (item.id === stallId ? puestoReseteado : item));
  localStorage.setItem(SUPABASE_CONFIG.localPuestosKey, JSON.stringify(STALLS));
  return puestoReseteado;
}

function actualizarEstadoBadge(texto, colorDot) {
  const el = document.getElementById("backend-status");
  if (!el) return;
  el.innerHTML = `<span class="w-2.5 h-2.5 rounded-full ${colorDot} animate-pulse"></span> ${texto}`;
}

// ======================================================
// INICIALIZACIÓN DEL MAPA
// ======================================================
document.addEventListener("DOMContentLoaded", async () => {
  cargarSesionLocal();
  const centerIctinos = [-33.471744, -70.562851];

  map = L.map("map", {
    center: centerIctinos,
    zoom: 17,
    zoomControl: false
  });

  L.control.zoom({ position: "topright" }).addTo(map);

  L.tileLayer("https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    attribution: "&copy; Google Maps Relieve"
  }).addTo(map);

  markersLayerGroup = L.layerGroup().addTo(map);
  inicializarRegistroPorClicDerecho();

  STALLS = await cargarPuestosDesdeBackend();
  poblarOpcionesCategoriasFiltro();
  aplicarFiltros();
});

function cargarPuestos(listaPuestos = STALLS) {
  markersLayerGroup.clearLayers();

  listaPuestos.forEach(stall => {
    const esMio = esDueñoDelPuesto(stall);
    const customIcon = L.divIcon({
      className: "custom-marker",
      html: `
        <div class="marker-pin ${esMio ? "my-stall-pin" : ""}" style="background-color: ${stall.color};">
          <i class="fa-solid ${stall.icono}"></i>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker([stall.lat, stall.lng], { icon: customIcon }).addTo(markersLayerGroup);

    marker.on("click", () => {
      openModal(stall);
    });
  });
}

// ======================================================
// FILTRADO POR CATEGORÍA Y PRECIOS
// ======================================================
let filtroEstado = {
  categoria: "todas",
  precioMin: null,
  precioMax: null,
  incluirPendientes: true
};

function toggleFilterPanel(forzarEstado = null) {
  const panel = document.getElementById("filter-panel");
  if (!panel) return;
  if (typeof forzarEstado === "boolean") {
    panel.classList.toggle("hidden", !forzarEstado);
  } else {
    panel.classList.toggle("hidden");
  }
}

function poblarOpcionesCategoriasFiltro() {
  const select = document.getElementById("filter-categoria");
  if (!select) return;

  const valorActual = select.value || "todas";
  const setCategorias = new Set(Object.keys(CATEGORIA_ESTILOS));
  STALLS.forEach(s => {
    if (s.categoria && s.categoria.trim().toLowerCase() !== "pendiente") {
      setCategorias.add(s.categoria.trim());
    }
  });

  const ordenadas = [...setCategorias].sort((a, b) => a.localeCompare(b, "es"));
  select.innerHTML =
    `<option value="todas">Todas las categorías</option>` +
    ordenadas.map(cat => `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`).join("");

  if ([...select.options].some(opt => opt.value === valorActual)) {
    select.value = valorActual;
  }
}

function marcarPresetActivo(presetName) {
  document.querySelectorAll(".price-preset-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.pricePreset === presetName);
  });
}

function seleccionarPresetPrecio(presetName) {
  const minInput = document.getElementById("filter-precio-min");
  const maxInput = document.getElementById("filter-precio-max");
  if (!minInput || !maxInput) return;

  if (presetName === "hasta-1500") {
    minInput.value = "";
    maxInput.value = "1500";
    marcarPresetActivo("hasta-1500");
  } else if (presetName === "1500-5000") {
    minInput.value = "1500";
    maxInput.value = "5000";
    marcarPresetActivo("1500-5000");
  } else if (presetName === "5000-mas") {
    minInput.value = "5000";
    maxInput.value = "";
    marcarPresetActivo("5000-mas");
  } else {
    minInput.value = "";
    maxInput.value = "";
    marcarPresetActivo(null);
  }

  aplicarFiltros();
}

function stallCumpleRangoPrecio(stall, minVal, maxVal) {
  if (minVal === null && maxVal === null) return true;
  if (esPuestoPendiente(stall)) return false;
  if (!Array.isArray(stall.productos) || stall.productos.length === 0) return false;

  return stall.productos.some(prod => {
    const precio = Number(prod.precio);
    if (Number.isNaN(precio)) return false;
    if (minVal !== null && precio < minVal) return false;
    if (maxVal !== null && precio > maxVal) return false;
    return true;
  });
}

function aplicarFiltros() {
  const catSelect = document.getElementById("filter-categoria");
  const minInput = document.getElementById("filter-precio-min");
  const maxInput = document.getElementById("filter-precio-max");
  const pendCheckbox = document.getElementById("filter-incluir-pendientes");

  const categoria = catSelect ? catSelect.value : "todas";
  const rawMin = minInput && minInput.value !== "" ? Number(minInput.value) : null;
  const rawMax = maxInput && maxInput.value !== "" ? Number(maxInput.value) : null;
  const precioMin = rawMin !== null && !Number.isNaN(rawMin) && rawMin >= 0 ? rawMin : null;
  const precioMax = rawMax !== null && !Number.isNaN(rawMax) && rawMax >= 0 ? rawMax : null;
  const incluirPendientes = pendCheckbox ? pendCheckbox.checked : true;

  filtroEstado = { categoria, precioMin, precioMax, incluirPendientes };

  const filtrados = STALLS.filter(stall => {
    const pendiente = esPuestoPendiente(stall);
    if (pendiente && !incluirPendientes) return false;
    if (categoria !== "todas" && String(stall.categoria || "").trim() !== categoria) return false;
    if (!stallCumpleRangoPrecio(stall, precioMin, precioMax)) return false;
    return true;
  });

  cargarPuestos(filtrados);
  actualizarIndicadoresFiltro(filtrados.length);
}

function actualizarIndicadoresFiltro(cantidadVisible) {
  const badge = document.getElementById("filter-active-badge");
  const pill = document.getElementById("filter-count-pill");
  const quickClear = document.getElementById("btn-clear-filters-quick");

  let activos = 0;
  if (filtroEstado.categoria !== "todas") activos++;
  if (filtroEstado.precioMin !== null || filtroEstado.precioMax !== null) activos++;
  if (!filtroEstado.incluirPendientes) activos++;

  if (badge) {
    if (activos > 0) {
      badge.textContent = String(activos);
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  }

  if (quickClear) {
    quickClear.classList.toggle("hidden", activos === 0);
  }

  if (pill) {
    if (activos === 0) {
      pill.textContent = `${cantidadVisible} puestos`;
    } else {
      pill.textContent = `${cantidadVisible} de ${STALLS.length} puestos`;
    }
  }
}

function resetFiltros() {
  const catSelect = document.getElementById("filter-categoria");
  const minInput = document.getElementById("filter-precio-min");
  const maxInput = document.getElementById("filter-precio-max");
  const pendCheckbox = document.getElementById("filter-incluir-pendientes");

  if (catSelect) catSelect.value = "todas";
  if (minInput) minInput.value = "";
  if (maxInput) maxInput.value = "";
  if (pendCheckbox) pendCheckbox.checked = true;
  marcarPresetActivo(null);

  aplicarFiltros();
}

// ======================================================
// MODAL DETALLADO DEL PUESTO
// ======================================================
function openModal(stall) {
  const modal = document.getElementById("stall-modal");
  const content = modal.querySelector("div");
  const pendiente = esPuestoPendiente(stall);
  const esMio = esDueñoDelPuesto(stall);

  content.innerHTML = `
    <div class="relative h-44 overflow-hidden border-b border-slate-700 shrink-0">
      <img src="${stall.imagen}" class="w-full h-full object-cover" alt="${escapeHtml(stall.nombre)}">
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
      
      <button onclick="closeModal()" class="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-slate-300 w-9 h-9 rounded-full flex items-center justify-center border border-slate-700 transition">
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>

      <div class="absolute bottom-3 left-4 right-4">
        <div class="flex flex-wrap items-center gap-1.5 mb-1">
          <span class="text-xs font-bold px-2.5 py-0.5 rounded-md text-slate-950 inline-block" style="background-color: ${stall.color}">
            ${escapeHtml(stall.numero)} • ${escapeHtml(stall.categoria)}
          </span>
          ${esMio ? `
            <span class="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-400 text-slate-950">
              <i class="fa-solid fa-star"></i> Tu puesto registrado
            </span>
          ` : ""}
        </div>
        <h2 class="text-xl font-bold text-slate-100">${escapeHtml(stall.nombre)}</h2>
        ${stall.owner_nombre ? `<p class="text-[11px] text-slate-300 mt-0.5">Registrado por: <strong>${escapeHtml(stall.owner_nombre)}</strong></p>` : ""}
      </div>
    </div>

    <div class="p-5 overflow-y-auto space-y-4 flex-1">
      <!-- Descripción del Puesto -->
      <div class="bg-slate-900/60 border border-slate-700/70 p-3.5 rounded-2xl">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-2">
          <i class="fa-solid fa-align-left text-emerald-400"></i> Descripción del Puesto
        </h3>
        <p class="text-sm text-slate-300 leading-relaxed">
          ${escapeHtml(stall.descripcion)}
        </p>
      </div>

      <!-- Lista de Productos y Precios -->
      <div>
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
          <i class="fa-solid fa-tag text-emerald-400"></i> Productos y Precios Destacados
        </h3>
        <div class="space-y-2">
          ${stall.productos.map(p => `
            <div class="bg-slate-900/80 border border-slate-700/80 p-3 rounded-xl flex items-center justify-between">
              <span class="font-medium text-slate-200 text-sm">${escapeHtml(p.nombre)}</span>
              <span class="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                $${Number(p.precio).toLocaleString("es-CL")} / ${escapeHtml(p.unidad)}
              </span>
            </div>
          `).join("")}
        </div>
      </div>

      <p id="modal-action-error" class="text-xs text-rose-400 hidden"></p>
    </div>

    <div class="p-4 border-t border-slate-700/80 bg-slate-900/60 flex flex-col sm:flex-row gap-2.5">
      ${pendiente ? `
        <button onclick="iniciarRegistroPuesto(${stall.id})" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20">
          <i class="fa-solid fa-user-plus"></i> ${currentUser ? "Registrar este Puesto" : "Inicia sesión para Registrar"}
        </button>
      ` : ""}

      ${esMio ? `
        <button onclick="confirmarEliminarMiPuesto(${stall.id})" id="btn-delete-stall" class="flex-1 bg-rose-600/90 hover:bg-rose-600 text-white py-2.5 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2">
          <i class="fa-solid fa-trash-can"></i> Eliminar mi Puesto
        </button>
      ` : ""}

      <button onclick="closeModal()" class="${(pendiente || esMio) ? "sm:w-32" : "w-full"} bg-slate-700 hover:bg-slate-600 text-slate-200 py-2.5 px-4 rounded-xl font-bold text-sm transition">
        Cerrar Ficha
      </button>
    </div>
  `;

  modal.classList.remove("hidden");
}

function iniciarRegistroPuesto(stallId) {
  if (!currentUser) {
    pendingStallAfterAuth = stallId;
    openAuthModal("login", "Debes iniciar sesión o crear una cuenta antes de registrar un puesto.");
    return;
  }
  openRegisterForm(stallId);
}

async function confirmarEliminarMiPuesto(stallId) {
  const stall = STALLS.find(s => s.id === stallId);
  if (!stall || !esDueñoDelPuesto(stall)) return;

  const ok = window.confirm(`¿Seguro que deseas eliminar el registro de "${stall.nombre}" (${stall.numero}) y dejar el puesto nuevamente como Pendiente?`);
  if (!ok) return;

  const btn = document.getElementById("btn-delete-stall");
  const errEl = document.getElementById("modal-action-error");
  if (errEl && errEl.classList) errEl.classList.add("hidden");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Eliminando...`;
  }

  try {
    const puestoPendiente = await eliminarPuestoEnBackend(stallId);
    poblarOpcionesCategoriasFiltro();
    aplicarFiltros();
    openModal(puestoPendiente);
  } catch (err) {
    if (errEl) {
      errEl.textContent = err.message || "No se pudo eliminar el puesto.";
      errEl.classList.remove("hidden");
    }
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-solid fa-trash-can"></i> Eliminar mi Puesto`;
    }
  }
}

// ======================================================
// FORMULARIO DE REGISTRO PARA PUESTOS "PENDIENTE"
// ======================================================
// ======================================================
// CUADRÍCULA DE CALLES Y REGISTRO POR CLIC DERECHO
// ======================================================
let gridSnapMarker = null;
let pendingCoordsAfterAuth = null;

function proyectarEnCuadriculaCalles(lat, lng) {
  // Cuadrícula global en metros alineada con el eje de la feria para permitir registro en cualquier parte del mapa
  const mPerLat = 111320;
  const mPerLng = 111320 * Math.cos((lat * Math.PI) / 180);

  const px = lng * mPerLng;
  const py = lat * mPerLat;

  // Paso de cuadrícula (~4.5 m) y ángulo de la calle de la feria
  const pasoGrid = 4.5;
  const anguloCalle = Math.atan2(
    (FIN_CALLE[0] - INICIO_CALLE[0]) * mPerLat,
    (FIN_CALLE[1] - INICIO_CALLE[1]) * mPerLng
  );
  const cosA = Math.cos(anguloCalle);
  const sinA = Math.sin(anguloCalle);

  // Rotar coordenadas a sistema local (u = a lo largo de la calle, v = perpendicular/borde)
  const u = px * cosA + py * sinA;
  const v = -px * sinA + py * cosA;

  const uSnap = Math.round(u / pasoGrid) * pasoGrid;
  const vSnap = Math.round(v / pasoGrid) * pasoGrid;

  // Volver a coordenadas en metros y luego a lat/lng
  const snapX = uSnap * cosA - vSnap * sinA;
  const snapY = uSnap * sinA + vSnap * cosA;

  return {
    lat: Number((snapY / mPerLat).toFixed(6)),
    lng: Number((snapX / mPerLng).toFixed(6))
  };
}

function abrirRegistroEnCoordenadas(lat, lng) {
  const snapped = proyectarEnCuadriculaCalles(lat, lng);
  mostrarMarcadorCuadricula(snapped.lat, snapped.lng);

  if (!currentUser) {
    pendingCoordsAfterAuth = snapped;
    openAuthModal("login", "Inicia sesión o crea una cuenta para registrar un nuevo puesto en esta ubicación.");
    return;
  }
  openRegisterForm(null, snapped);
}

function mostrarMarcadorCuadricula(lat, lng) {
  if (!map) return;
  if (gridSnapMarker) {
    map.removeLayer(gridSnapMarker);
  }
  const icon = L.divIcon({
    className: "grid-snap-marker",
    html: `<div class="grid-snap-pin" title="Toca para registrar puesto aquí"><i class="fa-solid fa-plus"></i></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
  gridSnapMarker = L.marker([lat, lng], {
    icon,
    zIndexOffset: 900,
    interactive: true
  }).addTo(map);

  gridSnapMarker.on("click", (ev) => {
    L.DomEvent.stopPropagation(ev);
    abrirRegistroEnCoordenadas(lat, lng);
  });
}

function limpiarMarcadorCuadricula() {
  if (gridSnapMarker && map) {
    map.removeLayer(gridSnapMarker);
    gridSnapMarker = null;
  }
}

let modoAgregarPuestoActivo = false;

function toggleModoAgregarPuesto(forzar = null) {
  modoAgregarPuestoActivo = typeof forzar === "boolean" ? forzar : !modoAgregarPuestoActivo;
  const btn = document.getElementById("btn-add-stall-mode");
  const banner = document.getElementById("add-stall-banner");
  const mapEl = document.getElementById("map");

  if (btn) {
    btn.classList.toggle("bg-emerald-600", modoAgregarPuestoActivo);
    btn.classList.toggle("text-white", modoAgregarPuestoActivo);
    btn.classList.toggle("border-emerald-400", modoAgregarPuestoActivo);
    btn.classList.toggle("bg-slate-900/95", !modoAgregarPuestoActivo);
    btn.classList.toggle("text-slate-100", !modoAgregarPuestoActivo);
  }
  if (banner) {
    banner.classList.toggle("hidden", !modoAgregarPuestoActivo);
  }
  if (mapEl) {
    mapEl.style.cursor = modoAgregarPuestoActivo ? "crosshair" : "";
  }
}

function inicializarRegistroPorClicDerecho() {
  if (!map) return;

  // Clic derecho en PC / pulsación larga en móvil
  map.on("contextmenu", (e) => {
    abrirRegistroEnCoordenadas(e.latlng.lat, e.latlng.lng);
  });

  // Toque/clic normal cuando está activo el modo "+ Registrar Puesto"
  map.on("click", (e) => {
    if (!modoAgregarPuestoActivo) return;
    toggleModoAgregarPuesto(false);
    abrirRegistroEnCoordenadas(e.latlng.lat, e.latlng.lng);
  });
}

function obtenerSiguienteNumeroPuesto() {
  const maxId = STALLS.reduce((max, s) => Math.max(max, Number(s.id) || 0), 107);
  const nextId = maxId + 1;
  return {
    id: nextId,
    numero: `Puesto ${String(nextId).padStart(2, "0")}`
  };
}

function openRegisterForm(stallId = null, coordsOverride = null) {
  if (!currentUser) {
    if (coordsOverride) {
      pendingCoordsAfterAuth = coordsOverride;
      openAuthModal("login", "Debes iniciar sesión o crear una cuenta antes de registrar un puesto.");
    } else {
      iniciarRegistroPuesto(stallId);
    }
    return;
  }

  const esNuevoEnMapa = stallId === null || stallId === undefined;
  let stall = null;

  if (!esNuevoEnMapa) {
    stall = STALLS.find(s => s.id === stallId);
    if (!stall) return;
  } else {
    const coords = coordsOverride || proyectarEnCuadriculaCalles(map.getCenter().lat, map.getCenter().lng);
    const siguiente = obtenerSiguienteNumeroPuesto();
    stall = {
      id: siguiente.id,
      numero: siguiente.numero,
      lat: coords.lat,
      lng: coords.lng
    };
  }

  const modal = document.getElementById("stall-modal");
  const content = modal.querySelector("div");
  const categoriasDisponibles = Object.keys(CATEGORIA_ESTILOS);
  modal.classList.remove("hidden");

  const volverAction = esNuevoEnMapa
    ? "limpiarMarcadorCuadricula(); closeModal();"
    : `openModal(STALLS.find(s => s.id === ${stall.id}))`;

  content.innerHTML = `
    <div class="px-5 py-4 border-b border-slate-700 flex items-center justify-between shrink-0 bg-slate-900/50">
      <div>
        <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">${stall.numero} • ${esNuevoEnMapa ? `Grilla (${stall.lat}, ${stall.lng})` : `Usuario: ${escapeHtml(currentUser.nombre)}`}</span>
        <h2 class="text-lg font-bold text-slate-100">${esNuevoEnMapa ? "Registrar Nuevo Puesto en Mapa" : "Registrar Vendedor en Puesto"}</h2>
      </div>
      <button onclick="${volverAction}" class="bg-slate-800 hover:bg-slate-700 text-slate-300 w-9 h-9 rounded-full flex items-center justify-center border border-slate-700 transition">
        <i class="fa-solid ${esNuevoEnMapa ? "fa-xmark" : "fa-arrow-left"}"></i>
      </button>
    </div>

    <form id="register-stall-form" class="p-5 overflow-y-auto space-y-4 flex-1">
      <div>
        <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
          Nombre del Vendedor o Puesto *
        </label>
        <input type="text" name="nombre" required value="${escapeHtml(currentUser.nombre)}" placeholder="Ej: Frutería Don Pedro"
          class="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none">
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
          Categoría *
        </label>
        <select name="categoria" required
          class="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none">
          <option value="" disabled selected>Selecciona una categoría</option>
          ${categoriasDisponibles.map(cat => `<option value="${cat}">${cat}</option>`).join("")}
        </select>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
          Descripción del Puesto *
        </label>
        <textarea name="descripcion" rows="3" required placeholder="Describe qué productos ofrece el puesto o su especialidad..."
          class="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none resize-none"></textarea>
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Productos y Precios Destacados *
          </label>
          <button type="button" onclick="agregarFilaProducto()" class="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
            <i class="fa-solid fa-plus-circle"></i> Agregar producto
          </button>
        </div>

        <div id="productos-container" class="space-y-2.5">
          ${renderFilaProducto(0)}
        </div>
      </div>

      <p id="form-error" class="text-xs text-rose-400 hidden"></p>
    </form>

    <div class="p-4 border-t border-slate-700/80 bg-slate-900/60 flex gap-2.5 shrink-0">
      <button type="button" onclick="${volverAction}" class="w-1/3 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2.5 rounded-xl font-bold text-sm transition">
        ${esNuevoEnMapa ? "Cancelar" : "Volver"}
      </button>
      <button type="submit" form="register-stall-form" id="btn-submit-registro" class="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2">
        <i class="fa-solid fa-check"></i> Guardar Registro
      </button>
    </div>
  `;

  document.getElementById("register-stall-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    await procesarRegistroVendedor(esNuevoEnMapa ? null : stall.id, e.target, esNuevoEnMapa ? stall : null);
  });
}

function renderFilaProducto(index) {
  return `
    <div class="producto-row bg-slate-900/80 border border-slate-700/80 p-3 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
      <input type="text" name="prod_nombre_${index}" required placeholder="Producto (ej: Palta)"
        class="sm:col-span-5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-500">
      <input type="number" name="prod_precio_${index}" required min="1" step="1" placeholder="Precio ($)"
        class="sm:col-span-3 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-500">
      <div class="sm:col-span-4 flex items-center gap-1.5">
        <input type="text" name="prod_unidad_${index}" required placeholder="Unidad (kg, 1 un)"
          class="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 outline-none focus:border-emerald-500">
        ${index > 0 ? `
          <button type="button" onclick="this.closest('.producto-row').remove()" class="text-slate-400 hover:text-rose-400 p-1">
            <i class="fa-solid fa-trash-can text-xs"></i>
          </button>
        ` : ""}
      </div>
    </div>
  `;
}

function agregarFilaProducto() {
  const container = document.getElementById("productos-container");
  const nextIndex = container.querySelectorAll(".producto-row").length;
  container.insertAdjacentHTML("beforeend", renderFilaProducto(nextIndex));
}

async function procesarRegistroVendedor(stallId, form, nuevoDraft = null) {
  const errorEl = document.getElementById("form-error");
  const submitBtn = document.getElementById("btn-submit-registro");
  errorEl.classList.add("hidden");

  const formData = new FormData(form);
  const nombre = String(formData.get("nombre") || "").trim();
  const categoria = String(formData.get("categoria") || "").trim();
  const descripcion = String(formData.get("descripcion") || "").trim();

  const filas = [...form.querySelectorAll(".producto-row")];
  const productos = filas.map((_, idx) => {
    const pNombre = String(formData.get(`prod_nombre_${idx}`) || "").trim();
    const pPrecio = Number(formData.get(`prod_precio_${idx}`));
    const pUnidad = String(formData.get(`prod_unidad_${idx}`) || "").trim();
    return { nombre: pNombre, precio: pPrecio, unidad: pUnidad };
  }).filter(p => p.nombre && !Number.isNaN(p.precio) && p.precio > 0 && p.unidad);

  if (!nombre || !categoria || !descripcion || productos.length === 0) {
    errorEl.textContent = "Completa todos los campos obligatorios y agrega al menos un producto con precio válido.";
    errorEl.classList.remove("hidden");
    return;
  }

  const original = stallId ? STALLS.find(s => s.id === stallId) : nuevoDraft;
  if (!original) return;

  const estilo = CATEGORIA_ESTILOS[categoria] || { icono: "fa-store", color: "#10b981" };
  const imagenCat = obtenerImagenCategoria(categoria);

  const puestoActualizado = {
    ...original,
    nombre,
    categoria,
    descripcion,
    icono: estilo.icono,
    color: estilo.color,
    imagen: imagenCat,
    owner_id: currentUser.id,
    owner_nombre: currentUser.nombre,
    productos
  };

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Guardando...`;

  try {
    if (!stallId) {
      STALLS = [...STALLS, puestoActualizado];
    }
    await guardarPuestoEnBackend(puestoActualizado);
    limpiarMarcadorCuadricula();
    poblarOpcionesCategoriasFiltro();
    aplicarFiltros();
    openModal(puestoActualizado);
  } catch (err) {
    console.error(err);
    errorEl.textContent = err.message || "Error al guardar el registro. Intenta nuevamente.";
    errorEl.classList.remove("hidden");
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Guardar Registro`;
  }
}

function closeModal() {
  document.getElementById("stall-modal").classList.add("hidden");
}

document.getElementById("stall-modal").addEventListener("click", (e) => {
  if (e.target.id === "stall-modal") {
    closeModal();
  }
});

// ======================================================
// UBICACIÓN ACTUAL (GEOLOCALIZACIÓN EN TIEMPO REAL)
// ======================================================
let userLocationMarker = null;
let userAccuracyCircle = null;
let watchLocationId = null;
let ubicacionActiva = false;

function actualizarBotonUbicacion(estado, texto) {
  const btn = document.getElementById("btn-locate-me");
  const icon = document.getElementById("locate-icon");
  const label = document.getElementById("locate-label");
  if (!btn || !icon || !label) return;

  label.textContent = texto;
  icon.classList.remove("fa-spinner", "fa-spin", "text-sky-400", "text-emerald-400", "text-rose-400");
  btn.classList.remove("border-emerald-500/70", "bg-emerald-950/80", "border-rose-500/60");

  if (estado === "loading") {
    icon.classList.add("fa-spinner", "fa-spin", "text-sky-400");
  } else if (estado === "active") {
    icon.classList.add("fa-location-crosshairs", "text-emerald-400");
    btn.classList.add("border-emerald-500/70", "bg-emerald-950/80");
  } else if (estado === "error") {
    icon.classList.add("fa-triangle-exclamation", "text-rose-400");
    btn.classList.add("border-rose-500/60");
  } else {
    icon.classList.add("fa-location-crosshairs", "text-sky-400");
  }
}

function pintarUbicacionEnMapa(lat, lng, accuracy = 15, centrar = false) {
  if (!map) return;

  const latlng = [lat, lng];
  const radio = Math.max(Number(accuracy) || 10, 6);

  if (!userLocationMarker) {
    const userIcon = L.divIcon({
      className: "user-location-marker",
      html: `<div class="user-location-dot"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });

    userLocationMarker = L.marker(latlng, {
      icon: userIcon,
      zIndexOffset: 800
    })
      .addTo(map)
      .bindPopup(`<strong>Tu ubicación actual</strong><br><span style="font-size:11px;">Precisión aprox.: ±${Math.round(radio)} m</span>`);
  } else {
    userLocationMarker.setLatLng(latlng);
    userLocationMarker.setPopupContent(
      `<strong>Tu ubicación actual</strong><br><span style="font-size:11px;">Precisión aprox.: ±${Math.round(radio)} m</span>`
    );
  }

  if (!userAccuracyCircle) {
    userAccuracyCircle = L.circle(latlng, {
      radius: radio,
      color: "#0ea5e9",
      weight: 1.5,
      fillColor: "#38bdf8",
      fillOpacity: 0.14
    }).addTo(map);
  } else {
    userAccuracyCircle.setLatLng(latlng);
    userAccuracyCircle.setRadius(radio);
  }

  if (centrar) {
    map.setView(latlng, Math.max(map.getZoom(), 18), { animate: true });
    userLocationMarker.openPopup();
  }
}

function detenerUbicacionActual() {
  ubicacionActiva = false;
  if (watchLocationId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchLocationId);
    watchLocationId = null;
  }
  if (userLocationMarker && map) {
    map.removeLayer(userLocationMarker);
    userLocationMarker = null;
  }
  if (userAccuracyCircle && map) {
    map.removeLayer(userAccuracyCircle);
    userAccuracyCircle = null;
  }
  actualizarBotonUbicacion("idle", "Mi Ubicación");
}

function toggleUbicacionActual() {
  if (!navigator.geolocation) {
    actualizarBotonUbicacion("error", "Sin GPS");
    alert("Tu navegador no soporta geolocalización.");
    return;
  }

  if (ubicacionActiva) {
    detenerUbicacionActual();
    return;
  }

  actualizarBotonUbicacion("loading", "Buscando...");
  let primerCentro = true;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      ubicacionActiva = true;
      pintarUbicacionEnMapa(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy, primerCentro);
      primerCentro = false;
      actualizarBotonUbicacion("active", "Ubicación Activa");
    },
    (err) => {
      let msg = "No se pudo obtener tu ubicación.";
      if (err.code === 1) msg = "Permiso de ubicación denegado. Actívalo en tu navegador.";
      else if (err.code === 2) msg = "Señal de ubicación no disponible en este momento.";
      else if (err.code === 3) msg = "Tiempo de espera agotado al buscar tu ubicación.";
      actualizarBotonUbicacion("error", "Sin Permiso");
      alert(msg);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
  );

  watchLocationId = navigator.geolocation.watchPosition(
    (pos) => {
      ubicacionActiva = true;
      pintarUbicacionEnMapa(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy, false);
      actualizarBotonUbicacion("active", "Ubicación Activa");
    },
    () => {},
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
  );
}
