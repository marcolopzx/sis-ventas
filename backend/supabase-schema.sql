-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create clientes table
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categorias table
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create productos table
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ventas table
CREATE TABLE IF NOT EXISTS ventas (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completada', 'cancelada')),
    fecha_venta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create detalles_venta table
CREATE TABLE IF NOT EXISTS detalles_venta (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON clientes(nombre);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos(nombre);
CREATE INDEX IF NOT EXISTS idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(fecha_venta);
CREATE INDEX IF NOT EXISTS idx_ventas_estado ON ventas(estado);
CREATE INDEX IF NOT EXISTS idx_detalles_venta_venta ON detalles_venta(venta_id);
CREATE INDEX IF NOT EXISTS idx_detalles_venta_producto ON detalles_venta(producto_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ventas_updated_at BEFORE UPDATE ON ventas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update stock when sale is created
CREATE OR REPLACE FUNCTION update_stock_on_sale()
RETURNS TRIGGER AS $$
BEGIN
    -- Update product stock
    UPDATE productos 
    SET stock = stock - NEW.cantidad
    WHERE id = NEW.producto_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update stock when sale detail is created
CREATE TRIGGER update_stock_on_sale_detail AFTER INSERT ON detalles_venta
    FOR EACH ROW EXECUTE FUNCTION update_stock_on_sale();

-- Create function to restore stock when sale is cancelled
CREATE OR REPLACE FUNCTION restore_stock_on_cancel()
RETURNS TRIGGER AS $$
BEGIN
    -- Restore stock when sale is cancelled
    IF NEW.estado = 'cancelada' AND OLD.estado != 'cancelada' THEN
        UPDATE productos 
        SET stock = stock + (
            SELECT SUM(cantidad) 
            FROM detalles_venta 
            WHERE venta_id = NEW.id
        )
        WHERE id IN (
            SELECT producto_id 
            FROM detalles_venta 
            WHERE venta_id = NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to restore stock when sale is cancelled
CREATE TRIGGER restore_stock_on_sale_cancel AFTER UPDATE ON ventas
    FOR EACH ROW EXECUTE FUNCTION restore_stock_on_cancel();

-- Insert sample data
INSERT INTO categorias (nombre, descripcion) VALUES
    ('Electrónicos', 'Productos electrónicos y tecnología'),
    ('Ropa', 'Vestimenta y accesorios'),
    ('Hogar', 'Artículos para el hogar'),
    ('Deportes', 'Equipamiento deportivo'),
    ('Libros', 'Libros y material educativo')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id) VALUES
    ('Laptop HP Pavilion', 'Laptop de 15 pulgadas con procesador Intel i5', 899.99, 10, 1),
    ('Smartphone Samsung Galaxy', 'Teléfono inteligente con cámara de 48MP', 599.99, 15, 1),
    ('Camiseta Básica', 'Camiseta de algodón 100%', 19.99, 50, 2),
    ('Jeans Clásicos', 'Jeans de mezclilla azul', 49.99, 30, 2),
    ('Sofá de 3 Plazas', 'Sofá cómodo para sala', 299.99, 5, 3),
    ('Mesa de Centro', 'Mesa de centro moderna', 89.99, 8, 3),
    ('Balón de Fútbol', 'Balón oficial de competición', 29.99, 20, 4),
    ('Raqueta de Tenis', 'Raqueta profesional', 79.99, 12, 4),
    ('El Señor de los Anillos', 'Trilogía completa', 39.99, 25, 5),
    ('Cálculo Diferencial', 'Libro de matemáticas avanzadas', 29.99, 15, 5)
ON CONFLICT DO NOTHING;

-- Create view for sales summary
CREATE OR REPLACE VIEW ventas_resumen AS
SELECT 
    v.id,
    v.fecha_venta,
    c.nombre as cliente_nombre,
    c.email as cliente_email,
    v.total,
    v.estado,
    COUNT(dv.id) as total_productos
FROM ventas v
JOIN clientes c ON v.cliente_id = c.id
LEFT JOIN detalles_venta dv ON v.id = dv.venta_id
GROUP BY v.id, v.fecha_venta, c.nombre, c.email, v.total, v.estado;

-- Create view for product sales
CREATE OR REPLACE VIEW productos_ventas AS
SELECT 
    p.id,
    p.nombre,
    p.precio,
    p.stock,
    c.nombre as categoria_nombre,
    COALESCE(SUM(dv.cantidad), 0) as total_vendido,
    COALESCE(SUM(dv.subtotal), 0) as total_ingresos
FROM productos p
JOIN categorias c ON p.categoria_id = c.id
LEFT JOIN detalles_venta dv ON p.id = dv.producto_id
LEFT JOIN ventas v ON dv.venta_id = v.id AND v.estado = 'completada'
GROUP BY p.id, p.nombre, p.precio, p.stock, c.nombre;

-- Enable Row Level Security (RLS)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalles_venta ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
-- In production, you should implement proper authentication
CREATE POLICY "Allow public read access to clientes" ON clientes FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to clientes" ON clientes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to clientes" ON clientes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to clientes" ON clientes FOR DELETE USING (true);

CREATE POLICY "Allow public read access to categorias" ON categorias FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to categorias" ON categorias FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to categorias" ON categorias FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to categorias" ON categorias FOR DELETE USING (true);

CREATE POLICY "Allow public read access to productos" ON productos FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to productos" ON productos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to productos" ON productos FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to productos" ON productos FOR DELETE USING (true);

CREATE POLICY "Allow public read access to ventas" ON ventas FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to ventas" ON ventas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to ventas" ON ventas FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to ventas" ON ventas FOR DELETE USING (true);

CREATE POLICY "Allow public read access to detalles_venta" ON detalles_venta FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to detalles_venta" ON detalles_venta FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to detalles_venta" ON detalles_venta FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to detalles_venta" ON detalles_venta FOR DELETE USING (true); 