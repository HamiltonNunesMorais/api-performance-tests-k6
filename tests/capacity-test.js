import http from "k6/http";
import { check, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export let options = {
  stages: [
    { duration: "10s", target: 10 },
    { duration: "20s", target: 50 },
    { duration: "20s", target: 100 },
    { duration: "20s", target: 200 },
    { duration: "20s", target: 300 },
  ],
};

export default function () {
  let res = http.get("http://localhost:8000/products");

  check(res, {
    "status 200": (r) => r.status === 200,
    "resposta rápida (<500ms)": (r) => r.timings.duration < 500,
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    "results/capacity-report.html": htmlReport(data),
  };
}

// { duration: "10s", target: 10 },   // começo leve
// { duration: "20s", target: 50 },   // sobe
// { duration: "20s", target: 100 },  // sobe mais
//  { duration: "20s", target: 200 },  // força muito
//  { duration: "20s", target: 300 },  // deve começar a falhar aqui
