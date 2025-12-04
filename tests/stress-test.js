import http from "k6/http";
import { check, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export let options = {
  stages: [
    { duration: "10s", target: 20 },
    { duration: "20s", target: 50 },
    { duration: "20s", target: 100 },
    { duration: "10s", target: 200 },
    { duration: "10s", target: 0 },
  ],
};

export default function () {
  let res = http.get("http://localhost:8000/products");

  check(res, {
    "status 200": (r) => r.status === 200,
    "tempo < 500ms": (r) => r.timings.duration < 500,
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    "results/stress-report.html": htmlReport(data),
  };
}

//  { duration: "10s", target: 20 },   // rampa leve
//  { duration: "20s", target: 50 },   // carga moderada
//  { duration: "20s", target: 100 },  // carga forte
// { duration: "10s", target: 200 },  // estresse máximo
// { duration: "10s", target: 0 },    // cooldown
