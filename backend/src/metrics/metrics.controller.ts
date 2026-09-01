import { Controller, Get, Header } from "@nestjs/common";
import { collectDefaultMetrics, register } from "prom-client";

let metricsInitialized = false;

function ensureMetrics() {
	if (!metricsInitialized) {
		collectDefaultMetrics({ register });
		metricsInitialized = true;
	}
}

@Controller()
export class MetricsController {
	@Get("metrics")
	@Header("Content-Type", register.contentType)
	async getMetrics(): Promise<string> {
		ensureMetrics();
		return register.metrics();
	}
}
