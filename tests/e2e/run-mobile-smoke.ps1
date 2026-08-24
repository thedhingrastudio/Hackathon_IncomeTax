$ErrorActionPreference = "Stop"
$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$artifactsDirectory = Join-Path $projectRoot "test-results"
New-Item -ItemType Directory -Path $artifactsDirectory -Force | Out-Null
$serverOutput = Join-Path $artifactsDirectory "next-server.out.log"
$serverError = Join-Path $artifactsDirectory "next-server.err.log"

$server = Start-Process `
  -FilePath "node.exe" `
  -ArgumentList @("node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3100") `
  -WorkingDirectory $projectRoot `
  -RedirectStandardOutput $serverOutput `
  -RedirectStandardError $serverError `
  -WindowStyle Hidden `
  -PassThru

try {
  $ready = $false
  for ($attempt = 0; $attempt -lt 120; $attempt++) {
    if ($server.HasExited) {
      throw "The production Next.js server exited before becoming ready. See $serverError."
    }
    try {
      $client = New-Object System.Net.Sockets.TcpClient
      $client.Connect("127.0.0.1", 3100)
      $client.Dispose()
      $ready = $true
      break
    } catch {
      if ($client) { $client.Dispose() }
      Start-Sleep -Milliseconds 250
    }
  }
  if (-not $ready) {
    throw "Timed out waiting for the production Next.js server. See $serverError."
  }

  & node.exe "node_modules/@playwright/test/cli.js" test
  $testExitCode = $LASTEXITCODE
} finally {
  if (-not $server.HasExited) {
    Stop-Process -Id $server.Id -Force
    $server.WaitForExit()
  }
}

exit $testExitCode
