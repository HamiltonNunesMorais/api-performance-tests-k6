import http from "k6/http";
import { check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  stages: [
    { duration: "10s", target: 20 },   // começa com 20 usuários
    { duration: "20s", target: 100 },  // sobe para 100
    { duration: "20s", target: 200 },  // força até 200
    { duration: "10s", target: 0 },    // cooldown
  ],
};

export default function () {
  const res = http.get("http://localhost:8000/products");

  check(res, {
    "status 200": (r) => r.status === 200,
  });
}

export function handleSummary(data) {
  return {
    "results/throughput-report.html": htmlReport(data),
  };
}
//Esse teste mostra o limite de throughput da sua API 
// (quantas requisições por segundo ela aguenta antes de falhar ou ficar lenta).