@echo off
echo ===========================
echo Rodando testes K6 (JSON)...
echo ===========================

REM === gera timestamp YYYYMMDD_HHMM ===
set timestamp=%date:~10,4%%date:~7,2%%date:~4,2%_%time:~0,2%%time:~3,2%

REM remove espaço
set timestamp=%timestamp: =0%

REM remove ":" caso exista em outra localidade
set timestamp=%timestamp::=%

REM remove "/" caso apareça em localizações PT-BR
set timestamp=%timestamp:/=%

echo Timestamp gerado: %timestamp%

REM Simple Load Test
k6 run tests/simple-load-test.js --out json=results/simple_%timestamp%.json

REM Stress Test
k6 run tests/stress-test.js --out json=results/stress_%timestamp%.json

REM Soak Test
k6 run tests/soak-test.js --out json=results/soak_%timestamp%.json

REM Capacity Test
k6 run tests/capacity-test.js --out json=results/capacity_%timestamp%.json

REM Spike Test
k6 run tests/spike-test.js --out json=results/spike_%timestamp%.json

REM Ramp Test
k6 run tests/ramp-test.js --out json=results/ramp_%timestamp%.json

REM API Scenario Test
k6 run tests/api-scenario-test.js --out json=results/api-scenario_%timestamp%.json

REM Produto existente
k6 run tests/get-product-test.js --out json=results/get-product_%timestamp%.json

REM Produto inexistente (404 esperado)
k6 run tests/get-product-404-test.js --out json=results/get-product-404_%timestamp%.json

REM Produto aleatório
k6 run tests/get-product-random-test.js --out json=results/get-product-random_%timestamp%.json

echo ===========================
echo Processo concluído!
echo JSONs gerados na pasta results\
echo Timestamp aplicado: %timestamp%
echo ===========================
pause
