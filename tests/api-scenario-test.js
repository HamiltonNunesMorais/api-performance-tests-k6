import http from "k6/http";
import { check, sleep } from "k6";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export let options = {
  stages: [
    { duration: "5s", target: 5 },
    { duration: "10s", target: 15 },
    { duration: "5s", target: 0 },
  ],
};

export default function () {
  let listRes = http.get("http://localhost:8000/products");
  check(listRes, { "GET list 200": (r) => r.status === 200 });
  sleep(1);

  let payload = JSON.stringify({
    title: `Produto-${Math.random().toString(16).slice(2)}`,
    price: randomIntBetween(10, 500),
  });
  let headers = { headers: { "Content-Type": "application/json" } };
  let postRes = http.post("http://localhost:8000/products", payload, headers);
  check(postRes, { "POST 200/201": (r) => r.status === 200 || r.status === 201 });
  sleep(1);

  let created = JSON.parse(postRes.body);
  let id = created.id;
  let getRes = http.get(`http://localhost:8000/products/${id}`);
  check(getRes, { "GET id 200": (r) => r.status === 200 });
  sleep(1);

  let deleteRes = http.del(`http://localhost:8000/products/${id}`);
  check(deleteRes, { "DELETE 200/204/OK": (r) => r.status === 200 || r.status === 204 });
  sleep(1);
}

export function handleSummary(data) {
  return {
    "results/api-scenario-report.html": htmlReport(data),
  };
}
