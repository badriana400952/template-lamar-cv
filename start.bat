@echo off
echo Starting MailCraft Local Server at http://localhost:8080 ...
start http://localhost:8080
npx -y serve -l 8080 .
pause
