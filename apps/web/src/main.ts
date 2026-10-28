import background from "../assets/loading.jpg";
import logo from "../assets/logo.png";
import frame from "../assets/progress-frame.png";
import { LoadingApplication } from "./loading-application.ts";
import { LoadingView } from "./loading-view.ts";
import { GatewayPingClient } from "./gateway-ping-client.ts";

const application = new LoadingApplication(new LoadingView(document), new GatewayPingClient(), [
    ["background", background],
    ["logo", logo],
    ["progress-frame", frame],
]);

void application.start();
