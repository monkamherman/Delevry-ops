const { PrismaClient } = require("@prisma/client");

async function testDeliveryService() {
  const prisma = new PrismaClient();

  try {
    console.log("Test de connexion à la base de données...");

    // Test de création d'une livraison
    const delivery = await prisma.delivery.create({
      data: {
        clientId: "test-client-123",
        status: "PENDING",
        addresses: [
          {
            street: "123 Test Street",
            city: "Test City",
            postalCode: "12345",
            country: "Test Country",
            formatted: "123 Test Street, Test City, 12345",
          },
        ],
      },
    });

    console.log("Livraison créée avec succès:", delivery.id);

    // Test de récupération
    const deliveries = await prisma.delivery.findMany({
      where: {
        status: {
          in: ["PENDING", "ASSIGNED"],
        },
      },
    });

    console.log(`Nombre de livraisons trouvées: ${deliveries.length}`);

    console.log("Test réussi !");
  } catch (error) {
    console.error("Erreur lors du test:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDeliveryService();
