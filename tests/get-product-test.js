import http from "k6/http";
import { check } from "k6";
import { Trend, Counter } from "k6/metrics";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// Métricas customizadas
const get_product_duration = new Trend("get_product_duration"); // tempo da requisição /products/1
const get_product_errors = new Counter("get_product_errors");   // contador de erros só desse endpoint

// Opções do teste com thresholds (regras de aprovação/reprovação)
export const options = {
  vus: 10,            // 10 usuários virtuais
  duration: "20s",    // por 20 segundos

  thresholds: {
    // Thresholds globais de qualidade
    http_req_duration: ["p(95)<500"],  // 95% das requisições abaixo de 500ms
    http_req_failed: ["rate<0.01"],    // menos de 1% das requisições falhando

    // Thresholds das métricas customizadas
    get_product_duration: ["p(95)<500"], // 95% das requisições /products/1 < 500ms
    // Para Counter não existe "rate", então usamos count<1 (nenhum erro aceito)
    // Se quiser tolerar alguns erros: ["count<3"]
    get_product_errors: ["count<1"],
  },
};

export default function () {
  // Requisição ao endpoint crítico
  const res = http.get("http://localhost:8000/products/1");

  // Adiciona a duração dessa chamada na métrica customizada
  get_product_duration.add(res.timings.duration);

  // Valida se status é 200
  const ok = check(res, {
    "status é 200": (r) => r.status === 200,
    "tempo < 500ms": (r) => r.timings.duration < 500,
  });

  // Se não for OK, incrementa o contador de erros customizados
  if (!ok) {
    get_product_errors.add(1);
  }
}

// Relatório HTML ao final
export function handleSummary(data) {
  return {
    "results/get-product-report.html": htmlReport(data),
  };
}
