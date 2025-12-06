# API Performance Tests with K6

Este projeto contém uma suíte completa de testes de performance para uma API REST utilizando [K6](https://k6.io/). Os testes simulam diferentes cenários de carga, estresse, concorrência e validação funcional, com integração opcional ao Grafana e InfluxDB para visualização de métricas.

---

## Estrutura do Projeto

```bash
API-PERFORMANCE-TESTS-K6/
├── dashboards/ # Dashboard JSON importável no Grafana
│ └── k6_grafana_dashboard.json
├── results/ # Relatórios HTML e JSON gerados
├── resources/ # Dados externos (ex: products.json)
├── tests/ # Scripts organizados por tipo de teste
│ ├── simple-load-test.js
│ ├── stress-test.js
│ ├── soak-test.js
│ ├── spike-test.js
│ ├── ramp-test.js
│ ├── get-product-test.js
│ ├── get-product-random-test.js
│ ├── api-scenario-test.js
│ └── ...
├── docker-compose.yml # Grafana + InfluxDB
├── run-html-tests.bat # Executa testes gerando HTML
├── run-json-tests.bat # Executa testes gerando JSON com timestamp
└── README.md

```
## Requisitos
- Docker (para Grafana + InfluxDB)
- K6
  - Baixe: https://k6.io/docs/get-started/installation/

## Executando o Monitoramento 
- InfluxDB para armazenar métricas
- Grafana para visualização

1. Vá até a raiz do projeto  e rode via cmd:

```bash
docker-compose up -d
```
2. Acesse no browser:
```bash
Grafana: http://localhost:3000
# login e senha padrão Grafana: admin, admin
InfluxDB: http://localhost:8086
```
3. Executando Testes com Saída para InfluxDB
```bash
# Teste de carga simples
k6 run tests/simple-load-test.js --out influxdb=http://localhost:8086/k6 --tag test=simple

# Teste de throughput
k6 run tests/throughput-test.js --out influxdb=http://localhost:8086/k6 --tag test=throughput

# Teste de estresse
k6 run tests/stress-test.js --out influxdb=http://localhost:8086/k6 --tag test=stress

# Teste de longa duração (soak)
k6 run tests/soak-test.js --out influxdb=http://localhost:8086/k6 --tag test=soak

```
4. Visualizando no Grafana
- Acesse o Grafana em http://localhost:3000
- Importe ou crie um dashboard
- acompanhar métricas como:VUs , Taxa de requisições por segundo, Latência média e percentis (p95, p99), Taxa de erros e falhas
  
## Rodando TESTES e Gerando Relatórios localmente
### Gerar RELATÓRIOS HTML

Execute:
```bash
run-html-tests.bat
# executa todos os scripts de testes
# e salva relatórios em HTML na pasta results/
```
### Gerar RESULTADOS JSON
Execute:
```bash
run-json-tests.bat
# executa todos os scripts de testes
# e salva relatórios em JSON na pasta results/
```
## Tipos de Testes Incluídos

| Teste                       | Objetivo                                         |
|-----------------------------|------------------------------------------------------------------------|
| **simple-load-test.js**     | Carga constante para medir estabilidade básica                        |
| **stress-test.js**          | Aumento progressivo até saturação da API                             |
| **soak-test.js**            | Comportamento sob carga contínua ao longo do tempo                   |
| **spike-test.js**           | Picos súbitos de tráfego e capacidade de recuperação                  |
| **ramp-test.js**            | Crescimento gradual e sustentado de usuários                         |
| **capacity-test.js**        | Identifica o ponto de quebra / limite máximo de carga                |
| **throughput-test.js**      | Mede throughput (requisições processadas por segundo)                 |
| **concurrency-test.js**     | Avalia concorrência simultânea e controle de recursos                |
| **api-scenario-test.js**    | Fluxos reais ponta a ponta / cenários de uso integrados              |
| **mixed-scenarios-test.js** | Combinação de diferentes padrões de carga em uma execução            |
| **error-test.js**           | Respostas e estabilidade diante de requisições inválidas/erros       |
| **get-product-test.js**     | Consulta de produto existente (status 200 esperado)                   |
| **get-product-404-test.js** | Consulta de produto inexistente (status 404 esperado)                 |
| **get-product-random-test.js** | Distribuição aleatória de requests por vários IDs                 |
| **post-delete-test.js**     | Criação + exclusão para validar consistência do fluxo                |
| **test-json-data.js**       | Testes utilizando massa dinâmica vinda de arquivo JSON               |
       
## Executando Testes Individualmente

Além do script automatizado, **todos os testes podem ser executados separadamente** usando o comando `k6 run`.
- Exemplo saida em HTML:
```bash
k6 run tests/soak-test.js
```
- Salvar os resultados em JSON
```bash
k6 run tests/stress-test.js --out json=results/stress.json

```
