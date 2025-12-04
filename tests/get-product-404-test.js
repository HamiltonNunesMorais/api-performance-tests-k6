import http from "k6/http";
import { check } from "k6";
import { Counter } from "k6/metrics";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const not_found_errors = new Counter("get_product_404_errors");

export const options = {
  vus: 5,
  duration: "10s",
  thresholds: {
    get_product_404_errors: ["count<1"], // não deve retornar 200 por engano
  },
};

export default function () {
  const res = http.get("http://localhost:8000/products/9999");

  const ok = check(res, {
    "status é 404": (r) => r.status === 404,
  });

  if (!ok) {
    not_found_errors.add(1);
  }
}

// Relatório HTML
export function handleSummary(data) {
  return {
    "results/get-product-404-report.html": htmlReport(data),
  };
}
