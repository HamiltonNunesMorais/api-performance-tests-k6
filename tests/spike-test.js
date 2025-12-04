import http from "k6/http";
import { sleep, check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  stages: [
    { duration: "10s", target: 5 },
    { duration: "5s", target: 200 },
    { duration: "20s", target: 5 },
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
    "results/spike-report.html": htmlReport(data),
  };
}



//  { duration: '10s', target: 5 },   // aquecimento
// { duration: '5s', target: 200 },  // pico brusco!
// { duration: '20s', target: 5 },   // recuperação
