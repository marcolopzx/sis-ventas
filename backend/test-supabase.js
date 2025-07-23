require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Función para probar conexión a Supabase
async function testSupabaseConnection() {
  console.log("🔍 Verificando configuración de Supabase...\n");

  // Verificar variables de entorno
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("📋 Variables de entorno:");
  console.log(
    `   SUPABASE_URL: ${supabaseUrl ? "✅ Configurada" : "❌ No configurada"}`
  );
  console.log(
    `   SUPABASE_ANON_KEY: ${
      supabaseAnonKey ? "✅ Configurada" : "❌ No configurada"
    }`
  );
  console.log(
    `   SUPABASE_SERVICE_ROLE_KEY: ${
      supabaseServiceRoleKey ? "✅ Configurada" : "❌ No configurada"
    }`
  );

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("\n❌ Error: Faltan variables de entorno de Supabase");
    console.log("\n📝 Para configurar Supabase:");
    console.log("1. Crea un proyecto en https://supabase.com");
    console.log("2. Ve a Settings > API");
    console.log("3. Copia la URL del proyecto y las claves");
    console.log("4. Crea un archivo .env en la carpeta backend con:");
    console.log("   SUPABASE_URL=tu_url_del_proyecto");
    console.log("   SUPABASE_ANON_KEY=tu_clave_anonima");
    console.log("   SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio");
    return;
  }

  try {
    console.log("\n🔌 Intentando conectar a Supabase...");

    // Crear cliente de Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Probar conexión básica
    console.log("   Probando conexión básica...");
    const { data, error } = await supabase
      .from("clientes")
      .select("count")
      .limit(1);

    if (error) {
      console.log("   ❌ Error de conexión:", error.message);

      if (error.message.includes('relation "clientes" does not exist')) {
        console.log(
          '\n📋 La tabla "clientes" no existe. Ejecuta el script SQL en Supabase:'
        );
        console.log("1. Ve a SQL Editor en tu proyecto Supabase");
        console.log(
          "2. Copia y pega el contenido de backend/supabase-schema.sql"
        );
        console.log("3. Ejecuta el script");
      }

      return;
    }

    console.log("   ✅ Conexión exitosa!");

    // Probar operaciones CRUD básicas
    console.log("\n🧪 Probando operaciones CRUD...");

    // Test 1: Leer datos
    console.log("   📖 Probando lectura de datos...");
    const { data: clientes, error: readError } = await supabase
      .from("clientes")
      .select("*")
      .limit(5);

    if (readError) {
      console.log("   ❌ Error al leer datos:", readError.message);
    } else {
      console.log(
        `   ✅ Lectura exitosa. ${clientes.length} clientes encontrados`
      );
    }

    // Test 2: Crear datos de prueba
    console.log("   ✏️  Probando creación de datos...");
    const testCliente = {
      nombre: "Cliente de Prueba",
      email: `test-${Date.now()}@example.com`,
      telefono: "123456789",
    };

    const { data: newCliente, error: createError } = await supabase
      .from("clientes")
      .insert([testCliente])
      .select()
      .single();

    if (createError) {
      console.log("   ❌ Error al crear datos:", createError.message);
    } else {
      console.log("   ✅ Creación exitosa. ID:", newCliente.id);

      // Test 3: Actualizar datos
      console.log("   🔄 Probando actualización...");
      const { error: updateError } = await supabase
        .from("clientes")
        .update({ nombre: "Cliente Actualizado" })
        .eq("id", newCliente.id);

      if (updateError) {
        console.log("   ❌ Error al actualizar:", updateError.message);
      } else {
        console.log("   ✅ Actualización exitosa");
      }

      // Test 4: Eliminar datos de prueba
      console.log("   🗑️  Limpiando datos de prueba...");
      const { error: deleteError } = await supabase
        .from("clientes")
        .delete()
        .eq("id", newCliente.id);

      if (deleteError) {
        console.log("   ❌ Error al eliminar:", deleteError.message);
      } else {
        console.log("   ✅ Eliminación exitosa");
      }
    }

    console.log("\n🎉 ¡Todas las pruebas de Supabase fueron exitosas!");
    console.log(
      "✅ El backend está correctamente configurado para usar Supabase"
    );
  } catch (error) {
    console.log("\n❌ Error inesperado:", error.message);
    console.log("\n🔧 Posibles soluciones:");
    console.log("1. Verifica que las credenciales de Supabase sean correctas");
    console.log("2. Asegúrate de que el proyecto Supabase esté activo");
    console.log("3. Verifica tu conexión a internet");
  }
}

// Ejecutar la prueba
testSupabaseConnection();
