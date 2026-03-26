@echo off
cd /d C:\Users\TR\Documents\guard

:loop
git add .
git commit -m "Auto sync %date% %time%"
git push
timeout /t 20 >nul
goto loop