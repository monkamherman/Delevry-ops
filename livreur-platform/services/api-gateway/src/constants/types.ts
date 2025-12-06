const TYPES = {
  // Contrôleurs
  UserController: Symbol.for("UserController"),
  DeliveryController: Symbol.for("DeliveryController"),

  // Services
  UserService: Symbol.for("UserService"),
  DeliveryService: Symbol.for("DeliveryService"),

  // Repositories
  UserRepository: Symbol.for("UserRepository"),
  DeliveryRepository: Symbol.for("DeliveryRepository"),

  // Autres
  Logger: Symbol.for("Logger"),
};

export { TYPES };
