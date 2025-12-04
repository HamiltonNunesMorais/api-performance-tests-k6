import http from "k6/http";
import { check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  scenarios: {
    leitura: {
      executor: "constant-vus",
      vus: 10,
      duration: "20s",
      exec: "getProduct",
    },
    escrita: {
      executor: "constant-vus",
      vus: 5,
      duration: "20s",
      exec: "createProduct",
    },
    exclusao: {
      executor: "constant-vus",
      vus: 3,
      duration: "20s",
      exec: "deleteProduct",
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<800"],
    http_req_failed: ["rate<0.10"], // tolera até 10% de falhas
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:8000";

export function getProduct() {
  const validIds = [2, 3, 4]; // IDs que não entram em conflito com o DELETE
  const id = validIds[Math.floor(Math.random() * validIds.length)];
  const res = http.get(`${BASE_URL}/products/${id}`);

  // Logs
  console.log("GET status:", res.status);
  console.log("GET body:", res.body);

  check(res, {
    "GET status 200": (r) => r.status === 200,
  });
}

export function createProduct() {
  const payload = JSON.stringify({
    title: `Produto-${__VU}-${Date.now()}`,
    price: 300.0,
  });
  const headers = { "Content-Type": "application/json" };
  const res = http.post(`${BASE_URL}/products`, payload, { headers });

  // Logs
  console.log("POST status:", res.status);
  console.log("POST body:", res.body);

  check(res, {
    "POST status 200 ou 201": (r) => r.status === 200 || r.status === 201,
  });
}

export function deleteProduct() {
  const res = http.del(`${BASE_URL}/products/1`);

  // Logs
  console.log("DELETE status:", res.status);
  console.log("DELETE body:", res.body);

  check(res, {
    "DELETE status 200 ou 404": (r) => r.status === 200 || r.status === 404,
  });
}

// Relatório HTML
export function handleSummary(data) {
  return {
    "results/mixed-scenarios-report.html": htmlReport(data),
  };
}
