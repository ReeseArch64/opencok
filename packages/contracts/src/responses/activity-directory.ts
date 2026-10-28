export interface ActivityDirectoryEntryResponse
{
    t: number;
    opt?: number;
    st?: number;
    et?: number;
}

export interface ActivityDirectoryResponse
{
    act: readonly ActivityDirectoryEntryResponse[];
}
