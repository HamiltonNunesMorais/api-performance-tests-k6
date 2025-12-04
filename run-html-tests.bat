@echo off
setlocal enabledelayedexpansion

REM ======== CRIAR TIMESTAMP ========
for /f "tokens=1-4 delims=/ " %%a in ("%date%") do (
    set day=%%a
    set month=%%b
    set year=%%c
)

for /f "tokens=1-2 delims=: " %%x in ("%time%") do (
    set hour=%%x
    set min=%%y
)

set timestamp=%year%%month%%day%_%hour%%min%

echo ===========================
echo Rodando testes K6 (HTML direto dos scripts)...
echo Timestamp: %timestamp%
echo ===========================

REM cria pasta de results se não existir
if not exist results mkdir results

REM ========= FUNÇÃO PARA EXECUTAR E RENOMEAR =========
:runAndRename
set testfile=%1
set expected=%2

echo Executando %testfile% ...

k6 run tests/%testfile%

REM Verifica se o HTML foi gerado pelo handleSummary
if exist results/%expected%.html (
    ren results/%expected%.html %expected%-%timestamp%.html
)

exit /b

REM ========= EXECUÇÃO DOS TESTES =========
call :runAndRename simple-load-test.js simple-report
call :runAndRename stress-test.js stress-report
call :runAndRename soak-test.js soak-report
call :runAndRename capacity-test.js capacity-report
call :runAndRename spike-test.js spike-report
call :runAndRename ramp-test.js ramp-report
call :runAndRename api-scenario-test.js api-scenario-report
call :runAndRename get-product-test.js get-product-report
call :runAndRename get-product-404-test.js get-product-404-report
call :runAndRename get-product-random-test.js get-product-random-report

echo ===========================
echo Processo concluído!
echo Relatórios HTML gerados na pasta results\
echo ===========================
pause
