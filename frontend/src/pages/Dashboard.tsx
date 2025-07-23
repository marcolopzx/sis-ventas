import { useState, useEffect } from "react";
import {
  Users,
  Package,
  Tag,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import {
  clienteAPI,
  productoAPI,
  categoriaAPI,
  ventaAPI,
} from "../services/api";

interface StatCardProps {
  icon: React.ComponentType<any>;
  title: string;
  value: number | string;
  change?: string;
  color: string;
}

const StatCard = ({
  icon: Icon,
  title,
  value,
  change,
  color,
}: StatCardProps) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <div className="flex items-center mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 ml-1">{change}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    clientes: 0,
    productos: 0,
    categorias: 0,
    ventas: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clientes, productos, categorias, ventas] = await Promise.all([
          clienteAPI.getAll(),
          productoAPI.getAll(),
          categoriaAPI.getAll(),
          ventaAPI.getAll(),
        ]);

        setStats({
          clientes: clientes.length,
          productos: productos.length,
          categorias: categorias.length,
          ventas: ventas.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      icon: Users,
      title: "Total Clientes",
      value: stats.clientes,
      change: "+12% este mes",
      color: "bg-blue-500",
    },
    {
      icon: Package,
      title: "Total Productos",
      value: stats.productos,
      change: "+8% este mes",
      color: "bg-green-500",
    },
    {
      icon: Tag,
      title: "Categorías",
      value: stats.categorias,
      color: "bg-purple-500",
    },
    {
      icon: ShoppingCart,
      title: "Ventas",
      value: stats.ventas,
      change: "+15% este mes",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Resumen general del sistema de ventas
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-gray-700">Agregar Cliente</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Package className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Agregar Producto</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <ShoppingCart className="w-5 h-5 text-orange-500" />
              <span className="text-gray-700">Nueva Venta</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Actividad Reciente
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Nuevo cliente registrado
                </p>
                <p className="text-xs text-gray-500">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Venta completada</p>
                <p className="text-xs text-gray-500">Hace 4 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Producto agregado al inventario
                </p>
                <p className="text-xs text-gray-500">Hace 6 horas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
