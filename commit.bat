@echo off
cd /d "c:\Users\Vishal pc\Desktop\AI_Agent"
echo Adding files to git...
git add .
echo.
echo Current status:
git status
echo.
echo Committing changes...
git commit -m "feat: Add cryptocurrency functionality to AgentVinod

- Added real-time crypto price fetching using CoinGecko API
- Integrated crypto function from index.js into web backend
- Added support for Bitcoin, Ethereum, Dogecoin, Cardano, Polkadot
- Improved natural language parsing for crypto queries
- Fixed API dependency from @google/genai to @google/generative-ai
- Enhanced parseMessage function with async crypto support
- Prioritized crypto detection to avoid conflicts with math queries
- Updated default response to reflect working crypto functionality"
echo.
echo Pushing to GitHub...
git push origin master
echo.
echo Done!
pause
