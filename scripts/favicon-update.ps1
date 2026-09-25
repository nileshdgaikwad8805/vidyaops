$publicDir = Join-Path $PSScriptRoot "..\public"
$files = Get-ChildItem "$publicDir/*.html"
foreach ($f in $files) {
  $content = [System.IO.File]::ReadAllText($f.FullName)
  $orig = $content
  $oldLink = '<link rel="icon" type="image/svg+xml" href="assets/favicon.svg?v=6" />'
  $newLink = '<link rel="icon" type="image/svg+xml" href="assets/logo-mark.svg?v=1" sizes="any" />'
  $content = $content -replace [regex]::Escape($oldLink), $newLink
  if ($content -ne $orig) {
    [System.IO.File]::WriteAllText($f.FullName, $content)
    Write-Output $f.Name
  }
}
