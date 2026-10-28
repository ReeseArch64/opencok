export interface ChatServerListResponse
{
    code: 1;
    data: { ip: string; port: string; protocol: string; }[];
    message: "success";
}
