import http from "k6/http";
import { check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { SharedArray } from "k6/data";

// Carrega os dados externos do JSON
const produtos = new SharedArray("products", function () {
  return JSON.parse(open("./resources/products.json")); //  caminho se resources estiver dentro dos testes
});

export const options = {
  vus: 5,
  duration: "20s",
  thresholds: {
    http_req_duration: ["p(95)<800"], // 95% das requisições devem responder em <800ms
    http_req_failed: ["rate<0.10"],   // tolera até 10% de falhas técnicas
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:8000";

export default function () {
  // Seleciona um produto aleatório da lista
  const produto = produtos[Math.floor(Math.random() * produtos.length)];

  const payload = JSON.stringify(produto);
  const headers = { "Content-Type": "application/json" };

  const res = http.post(`${BASE_URL}/products`, payload, { headers });

  // Logs para depuração
  console.log("POST status:", res.status);
  console.log("POST body:", res.body);

  // Check expandido para aceitar múltiplos status válidos
  const ok = check(res, {
    "POST status válido": (r) => [200, 201, 204].includes(r.status),
  });

  // Log extra para capturar falhas inesperadas
  if (!ok) {
    console.warn("⚠️ Falha inesperada:", res.status, res.body);
  }
}

// Relatório HTML
export function handleSummary(data) {
  return {
    "results/json-data-report.html": htmlReport(data),
  };
}
