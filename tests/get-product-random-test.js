import http from "k6/http";
import { check } from "k6";
import { Trend } from "k6/metrics";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const random_product_duration = new Trend("get_random_product_duration");

export const options = {
  vus: 10,
  duration: "15s",
  thresholds: {
    get_random_product_duration: ["p(95)<600"],
  },
};

export default function () {
  // Ajuste os IDs conforme os produtos válidos da sua API
  const validIds = [1, 2, 3];
  const id = validIds[Math.floor(Math.random() * validIds.length)];

  const res = http.get(`http://localhost:8000/products/${id}`);

  random_product_duration.add(res.timings.duration);

  check(res, {
    "status é 200": (r) => r.status === 200,
  });
}

// Relatório HTML
export function handleSummary(data) {
  return {
    "results/get-product-random-report.html": htmlReport(data),
  };
}
