import type { User } from '@prisma/client';

import { db } from '@/utils/db';

export class UserService {
  protected user: Partial<User>;

  constructor(user: Partial<User>) {
    this.user = user;
  }

  /**
   * Grouped by `type` and summing the `amount` field.
   */
  public async transactionBreakdown() {
    const transactionBreakdown = await db.transaction.groupBy({
      by: ['type'],
      where: { userId: this.user.id },
      _sum: { amount: true },
    });

    return transactionBreakdown;
  }

  /**
   * Calculates the user's balance by summing all `CREDIT` transactions and
   * subtracting all `DEBIT` transactions.
   */
  public async getBalance() {
    const transactionBreakdown = await this.transactionBreakdown();

    return transactionBreakdown.reduce((carry, item) => {
      if (item.type === 'CREDIT') return carry + (item._sum.amount ?? 0);

      return carry - (item._sum.amount ?? 0);
    }, 0);
  }
}
