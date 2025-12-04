import http from "k6/http";
import { check, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  vus: 50,              // 50 usuários simultâneos
  duration: "30s",      // durante 30 segundos
};

export default function () {
  const res = http.get("http://localhost:8000/products");

  check(res, {
    "status 200": (r) => r.status === 200,
    "tempo < 500ms": (r) => r.timings.duration < 500,
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    "results/concurrency-report.html": htmlReport(data),
  };
}

//Esse teste mostra como o endpoint se comporta sob concorrência alta.