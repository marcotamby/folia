const fs = require('fs');
const path = require('path');

// Let's analyze with PowerShell
const script = `
Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('d:\\Folia\\assets\\logo.jpg')

Write-Host "Corner 0,0: R=$($bmp.GetPixel(0,0).R) G=$($bmp.GetPixel(0,0).G) B=$($bmp.GetPixel(0,0).B)"
Write-Host "Corner 100,100: R=$($bmp.GetPixel(100,100).R) G=$($bmp.GetPixel(100,100).G) B=$($bmp.GetPixel(100,100).B)"
Write-Host "Center 512,512: R=$($bmp.GetPixel(512,512).R) G=$($bmp.GetPixel(512,512).G) B=$($bmp.GetPixel(512,512).B)"

# Find bounding box where pixel has green hue or dark color (R < 220 or B < 220 or G < 220)
$minX = 1024; $maxX = 0; $minY = 1024; $maxY = 0

for ($x = 0; $x -lt $bmp.Width; $x += 2) {
    for ($y = 0; $y -lt $bmp.Height; $y += 2) {
        $p = $bmp.GetPixel($x, $y)
        # Background is white/off-white (R > 230, G > 230, B > 230)
        # Logo has green/dark colors
        if ($p.R -lt 210 -or $p.B -lt 210) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Green leaf bounds: X=$minX to $maxX, Y=$minY to $maxY (Width=$($maxX-$minX), Height=$($maxY-$minY))"

# Crop tightly
$w = $maxX - $minX
$h = $maxY - $minY
$cropRect = New-Object System.Drawing.Rectangle($minX, $minY, $w, $h)
$cropped = $bmp.Clone($cropRect, $bmp.PixelFormat)

# Make 512x512 target
$target = New-Object System.Drawing.Bitmap(512, 512, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($target)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::White)

$scale = [Math]::Min(500 / $w, 500 / $h)
$destW = [int]($w * $scale)
$destH = [int]($h * $scale)
$destX = [int]((512 - $destW) / 2)
$destY = [int]((512 - $destH) / 2)

$g.DrawImage($cropped, $destX, $destY, $destW, $destH)
$g.Dispose()
$cropped.Dispose()
$bmp.Dispose()

$target.Save('d:\\Folia\\assets\\logo_zoomed.png', [System.Drawing.Imaging.ImageFormat]::Png)
$target.Dispose()
Copy-Item 'd:\\Folia\\assets\\logo_zoomed.png' 'd:\\Folia\\assets\\logo.png' -Force
Copy-Item 'd:\\Folia\\assets\\logo_zoomed.png' 'd:\\Folia\\assets\\logo_real.png' -Force
Write-Host "Logo successfully zoomed and centered to fill canvas!"
`;

fs.writeFileSync('d:/Folia/scripts/crop-precise.ps1', script);
