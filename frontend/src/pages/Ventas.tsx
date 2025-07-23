import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  ShoppingCart,
  DollarSign,
  Calendar,
  User,
  Package,
  X,
  Check,
  ChevronUp,
} from "lucide-react";
import {
  ventaAPI,
  clienteAPI,
  productoAPI,
  Venta,
  Cliente,
  Producto,
  CrearVentaRequest,
} from "../services/api";

interface CartItem {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

const Ventas = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null
  );
  const [cantidad, setCantidad] = useState(1);
  const [showDetails, setShowDetails] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ventasData, clientesData, productosData] = await Promise.all([
        ventaAPI.getAll(),
        clienteAPI.getAll(),
        productoAPI.getAll(),
      ]);
      setVentas(ventasData);
      setClientes(clientesData);
      setProductos(productosData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta venta?")) {
      try {
        await ventaAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting venta:", error);
      }
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await ventaAPI.update(id, { estado: newStatus as any });
      fetchData();
    } catch (error) {
      console.error("Error updating venta status:", error);
    }
  };

  const addToCart = () => {
    if (!selectedProducto || cantidad <= 0) return;

    const existingItem = cart.find(
      (item) => item.producto.id === selectedProducto.id
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.producto.id === selectedProducto.id
            ? {
                ...item,
                cantidad: item.cantidad + cantidad,
                subtotal: (item.cantidad + cantidad) * item.producto.precio,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          producto: selectedProducto,
          cantidad,
          subtotal: cantidad * selectedProducto.precio,
        },
      ]);
    }

    setSelectedProducto(null);
    setCantidad(1);
  };

  const removeFromCart = (productoId: number) => {
    setCart(cart.filter((item) => item.producto.id !== productoId));
  };

  const updateCartQuantity = (productoId: number, newCantidad: number) => {
    if (newCantidad <= 0) {
      removeFromCart(productoId);
      return;
    }

    setCart(
      cart.map((item) =>
        item.producto.id === productoId
          ? {
              ...item,
              cantidad: newCantidad,
              subtotal: newCantidad * item.producto.precio,
            }
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  const handleCreateVenta = async () => {
    if (!selectedCliente || cart.length === 0) {
      alert("Por favor selecciona un cliente y agrega productos al carrito");
      return;
    }

    try {
      const ventaData: CrearVentaRequest = {
        cliente_id: selectedCliente.id!,
        detalles: cart.map((item) => ({
          producto_id: item.producto.id!,
          cantidad: item.cantidad,
        })),
      };

      await ventaAPI.create(ventaData);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error creating venta:", error);
      alert("Error al crear la venta. Verifica el stock disponible.");
    }
  };

  const resetForm = () => {
    setSelectedCliente(null);
    setCart([]);
    setSelectedProducto(null);
    setCantidad(1);
    setShowForm(false);
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "completada":
        return "bg-green-100 text-green-700";
      case "pendiente":
        return "bg-yellow-100 text-yellow-700";
      case "cancelada":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case "completada":
        return "Completada";
      case "pendiente":
        return "Pendiente";
      case "cancelada":
        return "Cancelada";
      default:
        return estado;
    }
  };

  const filteredVentas = ventas.filter(
    (venta) =>
      venta.id?.toString().includes(searchTerm) ||
      venta.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando ventas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ventas</h1>
            <p className="text-gray-600 mt-2">
              Gestiona el historial de ventas
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Venta
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar ventas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Sales Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVentas.map((venta) => (
            <div
              key={venta.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Venta #{venta.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(
                        venta.fecha_venta || new Date()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setShowDetails(
                        showDetails === venta.id ? null : venta.id || 0
                      )
                    }
                    className="p-2 text-gray-400 hover:text-orange-600 transition-colors duration-200"
                  >
                    {showDetails === venta.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(venta.id!)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold text-green-600">
                      ${venta.total}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      venta.estado
                    )}`}
                  >
                    {getStatusText(venta.estado)}
                  </span>
                </div>

                {venta.cliente_nombre && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{venta.cliente_nombre}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(venta.fecha_venta || new Date()).toLocaleString()}
                  </span>
                </div>

                {/* Sale Details */}
                {showDetails === venta.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Detalles de la Venta
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Cliente:</span>
                        <span className="font-medium">
                          {venta.cliente_nombre}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">
                          {venta.cliente_email}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Productos:</span>
                        <span className="font-medium">
                          {venta.total_productos || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Fecha:</span>
                        <span className="font-medium">
                          {new Date(
                            venta.fecha_venta || new Date()
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Update Buttons */}
                <div className="flex space-x-2 pt-2">
                  {venta.estado === "pendiente" && (
                    <>
                      <button
                        onClick={() =>
                          handleUpdateStatus(venta.id!, "completada")
                        }
                        className="flex-1 bg-green-600 text-white py-1 px-2 rounded text-xs hover:bg-green-700 transition-colors duration-200"
                      >
                        <Check className="w-3 h-3 inline mr-1" />
                        Completar
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(venta.id!, "cancelada")
                        }
                        className="flex-1 bg-red-600 text-white py-1 px-2 rounded text-xs hover:bg-red-700 transition-colors duration-200"
                      >
                        <X className="w-3 h-3 inline mr-1" />
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVentas.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron ventas
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Intenta con otros términos de búsqueda"
                : "Comienza registrando tu primera venta"}
            </p>
          </div>
        )}

        {/* New Sale Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Nueva Venta
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Client and Product Selection */}
                <div className="space-y-6">
                  {/* Client Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cliente
                    </label>
                    <select
                      value={selectedCliente?.id || ""}
                      onChange={(e) => {
                        const cliente = clientes.find(
                          (c) => c.id === parseInt(e.target.value)
                        );
                        setSelectedCliente(cliente || null);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar cliente</option>
                      {clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nombre} - {cliente.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Product Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Producto
                    </label>
                    <select
                      value={selectedProducto?.id || ""}
                      onChange={(e) => {
                        const producto = productos.find(
                          (p) => p.id === parseInt(e.target.value)
                        );
                        setSelectedProducto(producto || null);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar producto</option>
                      {productos
                        .filter((p) => p.stock > 0)
                        .map((producto) => (
                          <option key={producto.id} value={producto.id}>
                            {producto.nombre} - ${producto.precio} (Stock:{" "}
                            {producto.stock})
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedProducto?.stock || 1}
                      value={cantidad}
                      onChange={(e) =>
                        setCantidad(parseInt(e.target.value) || 1)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={addToCart}
                    disabled={!selectedProducto || cantidad <= 0}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Agregar al Carrito
                  </button>
                </div>

                {/* Right Column - Cart */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Carrito
                  </h3>

                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-2" />
                      <p>El carrito está vacío</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {cart.map((item) => (
                          <div
                            key={item.producto.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {item.producto.nombre}
                              </p>
                              <p className="text-xs text-gray-600">
                                ${item.producto.precio} c/u
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                min="1"
                                max={item.producto.stock}
                                value={item.cantidad}
                                onChange={(e) =>
                                  updateCartQuantity(
                                    item.producto.id!,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <span className="text-sm font-medium">
                                ${item.subtotal}
                              </span>
                              <button
                                onClick={() =>
                                  removeFromCart(item.producto.id!)
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center text-lg font-semibold">
                          <span>Total:</span>
                          <span className="text-green-600">
                            ${getCartTotal()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleCreateVenta}
                        disabled={!selectedCliente || cart.length === 0}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <Check className="w-4 h-4 inline mr-2" />
                        Crear Venta
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ventas;
