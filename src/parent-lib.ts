import { PrismaClient } from '@prisma/client/extension';

/**
 * The `ParentService` class serves as a base class for services that require access to the Prisma client. It initializes a new instance of the Prisma client, allowing derived classes to interact with the database seamlessly.
 * @remarks This class is designed to be extended by other services that need database access, providing a centralized way to manage the Prisma client instance.
 */
export abstract class ParentService {
  protected prisma: PrismaClient;
  /**
   * Initializes a new instance of the Prisma client.
   * @remarks This constructor is deliberately not marked as `@internal` to allow for easier testing.
   */
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    this.prisma = new PrismaClient();
  }
}
