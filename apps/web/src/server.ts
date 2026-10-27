import { WebApplication } from "./web-application.ts";

const application = new WebApplication();

console.log(`OpenCok Web: ${application.server.url}`);
