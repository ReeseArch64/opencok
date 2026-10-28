import { TrainingDomain } from "@opencok/troops/services/training";
import { HospitalDomain } from "@opencok/troops/services/hospital";
import { FortificationDomain } from "@opencok/troops/services/fortifications";
import { recordTargetTask } from "./target-task";
import { recordExpeditionScore } from "@opencok/services/new-expedition";

export function createRealmTrainingDomain()
{
    return new TrainingDomain({ target: recordTargetTask, expedition: recordExpeditionScore });
}

export function createRealmHospitalDomain()
{
    return new HospitalDomain({ target: recordTargetTask });
}

export function createRealmFortificationDomain()
{
    return new FortificationDomain({ target: recordTargetTask });
}
