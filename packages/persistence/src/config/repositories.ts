import {
    defaultCacheTtlSeconds,
    defaultPageLimit,
    maximumPageLimit,
} from "../constants/persistence";

export const repositoryConfig = Object.freeze({
    defaultPageLimit,
    maximumPageLimit,
    cacheTtlSeconds: defaultCacheTtlSeconds,
    cacheKeyPrefix: "opencok:cache:v1",
});
