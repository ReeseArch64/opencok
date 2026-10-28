import { ResearchDomain } from "@opencok/research/services/research";
import { ResearchMapper } from "@opencok/research/mappings/research";
import { recordTargetTask } from "@opencok/services/target-task";
import { recordExpeditionScore } from "@opencok/services/new-expedition";

export function createRealmResearchDomain()
{
    return new ResearchDomain(
        { target: recordTargetTask, expedition: recordExpeditionScore },
        new ResearchMapper(),
    );
}
