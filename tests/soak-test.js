import http from "k6/http";
import { sleep, check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "2m", target: 20 },
    { duration: "30s", target: 0 },
  ],
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
    "results/soak-report.html": htmlReport(data),
  };
}


// { duration: '30s', target: 20 },   // sobe até 20 usuários
// { duration: '2m',  target: 20 },   // mantém 20 usuários por 2 minutos
// { duration: '30s', target: 0 },    // reduz carga
  