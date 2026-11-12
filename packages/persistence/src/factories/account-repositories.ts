import type { EntityManager } from "typeorm";
import { Account } from "../models/global/account";
import { accountCreateValidator } from "../validators/account";
import type { CreateAccount } from "../types/account";

export function createAccountRepositories(manager: EntityManager)
{
    if (manager.connection.options.database !== "global")
    {
        throw new Error("Repository vinculado ao banco incorreto");
    }
    return {
        findOrCreate: {
            async execute(input: CreateAccount): Promise<Account>
            {
                const value = accountCreateValidator.parse(input);
                return manager.transaction(async tx => {
                    const repository = tx.getRepository(Account);
                    await repository.createQueryBuilder().insert().values(value)
                        .orIgnore().execute();
                    const account = await repository.findOneOrFail({
                        where: value,
                        withDeleted: true,
                    });
                    if (account.deletedAt || account.archivedAt)
                    {
                        throw new Error("Conta indisponível");
                    }
                    return account;
                });
            },
        },
    };
}
