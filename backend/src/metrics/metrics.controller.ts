import { Controller, Get, Header } from "@nestjs/common";
import { metricsRegister } from "./metrics.interceptor";

@Controller()
export class MetricsController {
	@Get("metrics")
	@Header("Content-Type", metricsRegister.contentType)
	async getMetrics(): Promise<string> {
		return metricsRegister.metrics();
	}
}
