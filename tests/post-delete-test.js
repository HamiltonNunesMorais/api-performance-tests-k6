import http from "k6/http";
import { check, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  vus: 5,
  duration: "20s",
  thresholds: {
    http_req_duration: ["p(95)<800"],
    http_req_failed: ["rate<0.05"],
  },
};

export default function () {
  const BASE_URL = __ENV.BASE_URL || "http://localhost:8000";

  const payload = JSON.stringify({
    title: `Tenis-${__VU}-${Date.now()}`,
    price: 300.0,
  });

  const headers = { "Content-Type": "application/json" };
  const postRes = http.post(`${BASE_URL}/products`, payload, { headers });

  console.log("POST status:", postRes.status);
  console.log("POST body:", postRes.body);

  check(postRes, {
    "POST status 200 ou 201": (r) => r.status === 200 || r.status === 201,
  });

  // Aguarda 200ms para garantir que o produto foi persistido
  sleep(0.2);

  if ((postRes.status === 200 || postRes.status === 201) && postRes.body) {
    try {
      const created = JSON.parse(postRes.body);
      if (created.id) {
        const delRes = http.del(`${BASE_URL}/products/${created.id}`);
        console.log("DELETE status:", delRes.status);
        console.log("DELETE body:", delRes.body);

        check(delRes, {
          "DELETE status 200": (r) => r.status === 200,
        });
      }
    } catch (e) {
      console.error("Erro ao interpretar resposta do POST:", e);
    }
  }
}

export function handleSummary(data) {
  return {
    "results/post-delete-report.html": htmlReport(data),
  };
}
