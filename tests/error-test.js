import http from "k6/http";
import { check, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  vus: 10,
  duration: "20s",
};

export default function () {
  // Força um ID inexistente
  const res = http.get("http://localhost:8000/products/9999");

  check(res, {
    "status 404": (r) => r.status === 404,
    "erro retornado corretamente": (r) => r.body.includes("Product not found"),
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    "results/error-report.html": htmlReport(data),
  };
}

// Esse teste garante que sua API retorna erros consistentes e 
// não quebra sob requisições inválidas.