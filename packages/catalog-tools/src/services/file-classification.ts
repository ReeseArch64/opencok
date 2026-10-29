import { InventoryFileRole } from "../contracts/source-ownership";

export class FileClassification
{
    public role(path: string): InventoryFileRole
    {
        if (/\/(tests?|integration)\//.test(path) || /\.(test|spec)\.[cm]?[jt]sx?$/.test(path))
        {
            return InventoryFileRole.Test;
        }

        if (/\.md$|(^|\/)(LICENSE|NOTICE)$/.test(path))
        {
            return InventoryFileRole.Documentation;
        }

        if (/\/(scripts|bin)\//.test(path))
        {
            return InventoryFileRole.Tooling;
        }

        if (/\/catalogs\/data\/|\/buildings\/\d+\.ts$|\/data\//.test(path))
        {
            return InventoryFileRole.Catalog;
        }

        if (/\/schema\/|\/catalogs\/types\/|\/migrations\//.test(path))
        {
            return InventoryFileRole.Schema;
        }

        if (
            /(^|\/)(package\.json|tsconfig[^/]*\.json|[^/]*\.config\.[^/]+|Dockerfile|bun\.lock|[^/]+\.ya?ml|\.[^/]+)$/
                .test(
                    path,
                )
        )
        {
            return InventoryFileRole.Configuration;
        }

        if (/\.[cm]?[jt]sx?$/.test(path))
        {
            return InventoryFileRole.Source;
        }

        return InventoryFileRole.Asset;
    }
}
