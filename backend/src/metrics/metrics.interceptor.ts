import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Request, Response } from "express";
import { Counter, Histogram, Registry, collectDefaultMetrics } from "prom-client";

const register = new Registry();
collectDefaultMetrics({ register });

const httpRequestsTotal = new Counter({
	name: "http_requests_total",
	help: "Total HTTP requests",
	labelNames: ["method", "route", "status"],
	registers: [register],
});

const httpRequestDuration = new Histogram({
	name: "http_request_duration_seconds",
	help: "HTTP request duration in seconds",
	labelNames: ["method", "route", "status"],
	buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
	registers: [register],
});

export { register as metricsRegister };

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const http = context.switchToHttp();
		const req = http.getRequest<Request>();
		const res = http.getResponse<Response>();
		const start = Date.now();
		const route = req.route?.path ?? req.path ?? "unknown";

		return next.handle().pipe(
			tap({
				finalize: () => {
					const labels = {
						method: req.method,
						route,
						status: String(res.statusCode),
					};
					httpRequestsTotal.inc(labels);
					httpRequestDuration.observe(labels, (Date.now() - start) / 1000);
				},
			}),
		);
	}
}
