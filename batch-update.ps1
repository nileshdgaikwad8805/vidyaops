$pageMeta = @{}
$pageMeta["about.html"] = "Learn about VidyaOps - a Pune-based practical tech training brand offering workshops, IT certifications, corporate training, and career mentorship in Cloud, AI, Data, and Cybersecurity."
$pageMeta["admin.html"] = "VidyaOps admin dashboard for managing workshops, leads, and chatbot activity."
$pageMeta["certifications.html"] = "Explore VidyaOps IT certification training programs in Cloud Computing, AI, Data Analysis, and Cybersecurity with guided preparation and practical labs."
$pageMeta["contact.html"] = "Contact VidyaOps in Pune for inquiries about tech training, workshops, corporate programs, and career guidance."
$pageMeta["corporate-training.html"] = "VidyaOps offers structured corporate training programs for colleges, batches, and organized learner groups with practical technology outcomes."
$pageMeta["enroll.html"] = "Enroll in VidyaOps free and paid workshops. Choose your learning path and get automated onboarding with learner dashboard access."
$pageMeta["index.html"] = "VidyaOps offers practical tech training in Cloud, Data Analysis, AI, and Cybersecurity for students, freshers, and professionals in Pune."
$pageMeta["learner-dashboard.html"] = "Access your VidyaOps learner dashboard to track workshop progress, enrollments, and your learning journey."
$pageMeta["payment-success.html"] = "Your payment was successful. Access your VidyaOps learner dashboard and start your learning journey."
$pageMeta["programs.html"] = "Explore VidyaOps training programs - structured learning paths in Cloud, Data Analysis, AI, and Cybersecurity designed for career growth."
$pageMeta["services.html"] = "VidyaOps offers IT training and certifications, software development, digital learning, corporate training, R&D internships, and collaborations."
$pageMeta["volunteer.html"] = "Join VidyaOps as a volunteer trainer. Share your expertise, build your personal brand, and contribute to the tech community."
$pageMeta["workshops.html"] = "Explore VidyaOps upcoming workshops in Cloud, Data Analysis, AI, and Cybersecurity. Free and paid options for all skill levels."

$pageTitle = @{}
$pageTitle["about.html"] = "About VidyaOps | Practical Tech Training and Workshops"
$pageTitle["admin.html"] = "VidyaOps | Admin Dashboard"
$pageTitle["certifications.html"] = "VidyaOps | IT Certification Training"
$pageTitle["contact.html"] = "Contact VidyaOps | Tech Training in Pune"
$pageTitle["corporate-training.html"] = "VidyaOps | Corporate Training Programs"
$pageTitle["enroll.html"] = "Enroll in VidyaOps | Free and Paid Workshops"
$pageTitle["index.html"] = "VidyaOps | Practical Tech Training in Pune"
$pageTitle["learner-dashboard.html"] = "VidyaOps | Learner Dashboard"
$pageTitle["payment-success.html"] = "VidyaOps | Payment Successful"
$pageTitle["programs.html"] = "VidyaOps | Training Programs"
$pageTitle["services.html"] = "VidyaOps | IT Training, Software, and Digital Learning Services"
$pageTitle["volunteer.html"] = "VidyaOps | Become a Volunteer Trainer"
$pageTitle["workshops.html"] = "VidyaOps | Upcoming Workshops"
$pageTitle["collaborations.html"] = "VidyaOps | Collaborations and Technology Partnerships"
$pageTitle["digital-learning.html"] = "VidyaOps | Digital Learning Solutions"
$pageTitle["rd-internship.html"] = "VidyaOps | R&D Internship Program"
$pageTitle["software-services.html"] = "VidyaOps | Software Development Services"
$pageTitle["admin-login.html"] = "VidyaOps | Admin Login"

$ogImage = "https://vidyaops.com/assets/vidyaops-logo.jpeg"
$skipAnalytics = @("admin.html","admin-login.html","learner-dashboard.html","payment-success.html")

$files = Get-ChildItem "public/*.html"
foreach ($f in $files) {
  $name = $f.Name
  $content = [System.IO.File]::ReadAllText($f.FullName)
  $orig = $content
  $changed = $false
  
  # 1. Add meta description if missing
  if ($content -notmatch '<meta name="description"') {
    $desc = $pageMeta[$name]
    if ($desc) {
      $insert = '<meta name="description" content="' + $desc + '" />'
      $content = $content -replace '(?=<link rel="preconnect")', $insert
      if ($? -and ($content -ne $orig)) { $changed = $true }
    }
  }
  
  # 2. Add OG tags (skip admin pages)
  if ($name -ne "admin.html" -and $name -ne "admin-login.html") {
    $title = $pageTitle[$name]
    $desc = $pageMeta[$name]
    if ($title -and ($content -notmatch 'property="og:title"')) {
      $ogBlock = '<meta property="og:title" content="' + $title + '" />'
      $ogBlock = $ogBlock + "`n    <meta property=`"og:description`" content=`"" + $desc + "`" />"
      $ogBlock = $ogBlock + "`n    <meta property=`"og:image`" content=`"" + $ogImage + "`" />"
      $ogBlock = $ogBlock + "`n    <meta property=`"og:url`" content=`"https://vidyaops.com/" + $name + "`" />"
      $ogBlock = $ogBlock + "`n    <meta property=`"og:type`" content=`"website`" />"
      $ogBlock = $ogBlock + "`n    <meta name=`"twitter:card`" content=`"summary_large_image`" />"
      $ogBlock = $ogBlock + "`n    <meta name=`"twitter:title`" content=`"" + $title + "`" />"
      $ogBlock = $ogBlock + "`n    <meta name=`"twitter:description`" content=`"" + $desc + "`" />"
      $ogBlock = $ogBlock + "`n    <meta name=`"twitter:image`" content=`"" + $ogImage + "`" />"
      $insert = "  " + $ogBlock + "`n  "
      $content = $content -replace '(?=<link rel="icon")', $insert
      if ($? -and ($content -ne $orig)) { $changed = $true }
    }
  }
  
  # 3. Add analytics if not present
  if ($name -notin $skipAnalytics -and ($content -notmatch 'googletagmanager')) {
    $gaSnippet = '<!-- Google tag (gtag.js) -->'
    $gaSnippet = $gaSnippet + "`n  <script async src=`"https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`"></script>"
    $gaSnippet = $gaSnippet + "`n  <script>"
    $gaSnippet = $gaSnippet + "`n    window.dataLayer = window.dataLayer || [];"
    $gaSnippet = $gaSnippet + "`n    function gtag(){dataLayer.push(arguments);}"
    $gaSnippet = $gaSnippet + "`n    gtag('js', new Date());"
    $gaSnippet = $gaSnippet + "`n    gtag('config', 'G-XXXXXXXXXX');"
    $gaSnippet = $gaSnippet + "`n  </script>"
    $insert = "  " + $gaSnippet + "`n  "
    $content = $content -replace '(?=</head>)', $insert
    if ($? -and ($content -ne $orig)) { $changed = $true }
  }
  
  if ($changed) {
    [System.IO.File]::WriteAllText($f.FullName, $content)
    Write-Output "Updated: $name"
  } else {
    Write-Output "No change: $name"
  }
}
