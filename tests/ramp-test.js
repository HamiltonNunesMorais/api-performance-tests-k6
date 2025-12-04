import http from "k6/http";
import { sleep, check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export let options = {
  stages: [
    { duration: "5s", target: 5 },
    { duration: "10s", target: 20 },
    { duration: "5s", target: 0 },
  ],
};

export default function () {
  let res = http.get("http://localhost:8000");

  check(res, {
    "status 200": (r) => r.status === 200,
    "resposta rápida": (r) => r.timings.duration < 200,
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    "results/ramp-report.html": htmlReport(data),
  };
}

// { duration: '5s', target: 5 },   // sobe para 5 usuários
// { duration: '10s', target: 20 }, // mantém 20 usuários
// { duration: '5s', target: 0 },   // reduz para 0 (cooldown)

