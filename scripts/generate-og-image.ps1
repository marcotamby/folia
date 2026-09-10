Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$bmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

# 1. Background Gradient (Rich Dark Green / Slate)
$rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$colStart = [System.Drawing.Color]::FromArgb(255, 11, 20, 16)   # Deep dark forest #0b1410
$colEnd = [System.Drawing.Color]::FromArgb(255, 18, 36, 28)     # Deep emerald slate #12241c
$brushBg = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $colStart, $colEnd, 45.0)
$g.FillRectangle($brushBg, $rect)

# 2. Subtle Glow Circle in Top-Left and Center
$glowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 45, 106, 79))
$g.FillEllipse($glowBrush, -100, -100, 600, 600)
$g.FillEllipse($glowBrush, 700, 100, 700, 700)

# 3. Outer subtle border
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 255, 255, 255), 2)
$g.DrawRectangle($borderPen, 1, 1, ($width - 2), ($height - 2))

# 4. Load Folia Logo
$logoPath = 'd:\Folia\website\assets\logo.png'
if (Test-Path $logoPath) {
    $logoBmp = [System.Drawing.Bitmap]::FromFile($logoPath)
    $logoSize = 84
    $g.DrawImage($logoBmp, 60, 65, $logoSize, $logoSize)
    $logoBmp.Dispose()
}

# 5. Fonts
$fontBrand = New-Object System.Drawing.Font('Georgia', [single]38, [System.Drawing.FontStyle]::Bold)
$fontTitle = New-Object System.Drawing.Font('Georgia', [single]23, [System.Drawing.FontStyle]::Bold)
$fontSubtitle = New-Object System.Drawing.Font('Arial', [single]15, [System.Drawing.FontStyle]::Regular)
$fontBadge = New-Object System.Drawing.Font('Arial', [single]13, [System.Drawing.FontStyle]::Bold)
$fontCheck = New-Object System.Drawing.Font('Arial', [single]14, [System.Drawing.FontStyle]::Bold)

# 6. Brand Name & Badge
$brushGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 235, 245, 240))
$g.DrawString('Folia', $fontBrand, $brushGold, [single]160, [single]68)

$brushPillBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(50, 45, 106, 79))
$penPill = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(160, 82, 183, 136), [single]1.5)
$pillRect = New-Object System.Drawing.Rectangle(162, 126, 175, 26)
$g.FillRectangle($brushPillBg, $pillRect)
$g.DrawRectangle($penPill, $pillRect)
$brushPillText = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 149, 213, 176))
$fontPill = New-Object System.Drawing.Font('Arial', [single]10, [System.Drawing.FontStyle]::Bold)
$g.DrawString('SOFTWARE DESKTOP', $fontPill, $brushPillText, [single]170, [single]132)

# 7. Main Headline
$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
$headlineRect = New-Object System.Drawing.RectangleF(60, 185, 520, 110)
$g.DrawString("L'ambiente di scrittura per chi da vita a nuove storie.", $fontTitle, $brushWhite, $headlineRect)

# 8. Description
$brushMuted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 200, 215, 208))
$descRect = New-Object System.Drawing.RectangleF(60, 295, 510, 100)
$descText = "L'unica suite con cartelle editoriali da 1800 battute, formato romanzo 14x21, mappe geografiche con pin, schede D&D 5e e outliner con 18+ strutture narrative."
$g.DrawString($descText, $fontSubtitle, $brushMuted, $descRect)

# 9. Badges
$badges = @(
    '100% Offline & Privato',
    'Cartelle editoriali 1800 battute',
    'Mappe con Pin & Lore',
    'Gratuito per Windows'
)

$badgeY = 415
foreach ($badge in $badges) {
    $brushCheck = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 82, 183, 136))
    $g.DrawString('>', $fontCheck, $brushCheck, [single]60, [single]$badgeY)
    
    $brushBadgeText = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 240, 246, 242))
    $g.DrawString($badge, $fontBadge, $brushBadgeText, [single]85, [single]$badgeY)
    $badgeY += 34
}

# 10. URL at bottom left
$brushUrl = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 116, 198, 157))
$fontUrl = New-Object System.Drawing.Font('Arial', [single]13, [System.Drawing.FontStyle]::Bold)
$g.DrawString('folia-suite.com', $fontUrl, $brushUrl, [single]60, [single]565)

# 11. Screenshot on Right Side with Shadow & Rounded frame
$screenshotPath = 'd:\Folia\website\assets\screenshots\editor_real.png'
if (Test-Path $screenshotPath) {
    $shotBmp = [System.Drawing.Bitmap]::FromFile($screenshotPath)
    
    $shotX = 600
    $shotY = 85
    $shotW = 540
    $shotH = 460
    
    # Shadow
    $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, 0, 0, 0))
    $g.FillRectangle($shadowBrush, ($shotX + 10), ($shotY + 14), $shotW, $shotH)
    
    # Frame background
    $g.FillRectangle([System.Drawing.Brushes]::Black, $shotX, $shotY, $shotW, $shotH)
    
    # Draw screenshot fitted
    $g.DrawImage($shotBmp, $shotX, $shotY, $shotW, $shotH)
    
    # Frame border
    $penShotBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100, 255, 255, 255), [single]1.5)
    $g.DrawRectangle($penShotBorder, $shotX, $shotY, $shotW, $shotH)
    
    $shotBmp.Dispose()
}

$g.Dispose()

$outputPath = 'd:\Folia\website\assets\og-image.png'
$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Host "Open Graph image successfully generated at $outputPath"
