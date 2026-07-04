$files = Get-ChildItem "public/*.html"
foreach ($f in $files) {
  $content = [System.IO.File]::ReadAllText($f.FullName)
  $orig = $content
  
  # Remove meta description injected before preconnect links (duplicate)
  $content = $content -replace '<meta name="description" content="[^"]*" /><link rel="preconnect" ', '<link rel="preconnect" '
  
  # Remove standalone duplicate meta description before preconnect (if present)
  $content = $content -replace '<meta name="description" content="[^"]*" />\s*<link rel="preconnect" ', '<link rel="preconnect" '
  
  # Fix indentation of OG block (should be consistent 4-space)
  $content = $content -replace '(?m)^      <meta property="og:', '    <meta property="og:'
  $content = $content -replace '(?m)^      <meta name="twitter:', '    <meta name="twitter:'
  $content = $content -replace '(?m)^    <meta property="og:', '    <meta property="og:'
  $content = $content -replace '(?m)^  <meta property="og:', '    <meta property="og:'
  
  # Fix analytics indentation
  $content = $content -replace '(?m)^  <!-- Google tag', '    <!-- Google tag'
  $content = $content -replace '(?m)^  <script async src="https://www.googletagmanager.com', '    <script async src="https://www.googletagmanager.com'
  $content = $content -replace '(?m)^  <script>', '    <script>'
  $content = $content -replace '(?m)^    window.dataLayer', '      window.dataLayer'
  $content = $content -replace '(?m)^    function gtag', '      function gtag'
  $content = $content -replace '(?m)^    gtag', '      gtag'
  $content = $content -replace '(?m)^  </script>', '    </script>'
  
  if ($content -ne $orig) {
    [System.IO.File]::WriteAllText($f.FullName, $content)
    Write-Output "Cleaned: $f.Name"
  }
}
