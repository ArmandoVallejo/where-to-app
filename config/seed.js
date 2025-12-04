import { db } from "../config/config";
import { ref, push, set, get } from "firebase/database";

export async function runSeed() {
  try {
    console.log("🌱 Iniciando seed...");

    // Verificar si ya se ejecutó el seed
    const seedRef = ref(db, "seed_executed");
    const seedSnapshot = await get(seedRef);

    if (seedSnapshot.exists() && seedSnapshot.val() === true) {
      console.log("⚠️ Seed ya fue ejecutado previamente. Saltando...");
      return;
    }

    // Edificios iniciales
    const edificios = [
      { mac: "76:A1:2B:7F:24:3E", name: "Centro de computo" },
      { mac: "D1:09:1A:DA:9D:2E", name: "Salones A-C" },
    ];

    const edificiosRef = ref(db, "edificios");
    console.log("📍 Creando edificios...");

    for (const edificio of edificios) {
      await push(edificiosRef, edificio);
      console.log(`  ✅ Edificio creado: ${edificio.name}`);
    }

    // Usuario administrador
    const adminUser = {
      name: "Juan Chavez",
      control: "11111111",
      email: "admin@tec.mx",
      password: "Hola1234#",
      phone: "4491231234",
      location: "Aguascalientes",
      career: "TICS",
      role: "admin",
      historialEventos: [],
      createdAt: new Date().toISOString(),
    };

    const usersRef = ref(db, "users");
    console.log("👤 Creando usuario administrador...");
    await push(usersRef, adminUser);
    console.log(`  ✅ Admin creado: ${adminUser.control}`);

    // Marcar seed como ejecutado
    await set(seedRef, true);

    console.log("✅ Seed ejecutado exitosamente");
  } catch (e) {
    console.error("❌ Error en seed:", e);
  }
}
