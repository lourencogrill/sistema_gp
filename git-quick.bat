@echo off
setlocal enabledelayedexpansion

:: ========= CONFIGURÁVEL =========
set "BRANCH=desenvolvimento"      :: Nome da branch de trabalho. Altere se necessário.
set "PREFIX=Commit #"         :: Prefixo da mensagem de commit.
set "TAG_PREFIX=Commit-"      :: Prefixo da tag (sem espaço).
:: ===============================

:: 1) Cria ou reseta a branch para o HEAD atual
git switch -C "%BRANCH%" || goto :err

:: 2) Calcula próximo número
set next=1
for /f "tokens=2 delims=# " %%A in ('
  git log -1 --grep "%PREFIX%" --pretty^=format:"%%s" 2^>nul
') do set /a next=%%A+1

:: 3) Adiciona e verifica mudanças
git add -A
git diff --cached --quiet && (
  echo Nada para commitar – working tree limpo.
  goto :done
)

:: 4) Commit, tag e push
echo Commitando: %PREFIX%!next!
git commit -m "%PREFIX%!next!" || goto :err
git tag -a "%TAG_PREFIX%!next!" -m "%PREFIX%!next!"
git push -u origin "%BRANCH%"
git push origin "%TAG_PREFIX%!next!"

echo.
echo ✅ Commit #!next! enviado a origin/%BRANCH%.
goto :done

:err
echo ❌ Ocorreu um erro. Verifique as mensagens acima.

:done
echo.
echo A janela será fechada em 5 segundos...
timeout /T 5 /NOBREAK >nul
exit /b
