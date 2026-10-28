export interface ProgressionActivityData
{
    schema: 1;
    kind:
        | "civilization"
        | "upgrade"
        | "destroy"
        | "research"
        | "train"
        | "heal"
        | "fort"
        | "equipment"
        | "material";
    costs: Record<string, string>;
    items: Record<string, number>;
    target?: { level: number; star: number; progress: number; };
    units?: Record<string, number>;
}
