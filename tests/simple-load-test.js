import http from "k6/http";
import { sleep, check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  vus: 10,
  duration: "10s",
};

export default function () {
  const res = http.get("http://localhost:8000/products");

  check(res, {
    "status é 200": (r) => r.status === 200,
    "tempo < 300ms": (r) => r.timings.duration < 300,
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    "results/simple-report.html": htmlReport(data),
  };
}
