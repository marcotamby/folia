Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Bitmap]::FromFile('d:\Folia\assets\logo.jpg')

# Find bounding box of content (ignore white background: r,g,b > 240)
$minX = $src.Width
$maxX = 0
$minY = $src.Height
$maxY = 0

for ($x = 0; $x -lt $src.Width; $x++) {
    for ($y = 0; $y -lt $src.Height; $y++) {
        $pixel = $src.GetPixel($x, $y)
        if ($pixel.R -lt 240 -or $pixel.G -lt 240 -or $pixel.B -lt 240) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Bounding box: X=$minX to $maxX, Y=$minY to $maxY, Src=$($src.Width)x$($src.Height)"

# Add very small padding around cropped logo (2%)
$w = $maxX - $minX
$h = $maxY - $minY
$pad = [int]([Math]::Max($w, $h) * 0.02)

$cropX = [Math]::Max(0, $minX - $pad)
$cropY = [Math]::Max(0, $minY - $pad)
$cropW = [Math]::Min($src.Width - $cropX, $w + ($pad * 2))
$cropH = [Math]::Min($src.Height - $cropY, $h + ($pad * 2))

$cropRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$cropped = $src.Clone($cropRect, $src.PixelFormat)

# Create 512x512 canvas and draw cropped image centered and zoomed in
$target = New-Object System.Drawing.Bitmap(512, 512, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($target)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::White)

$scale = [Math]::Min(512 / $cropW, 512 / $cropH)
$destW = [int]($cropW * $scale)
$destH = [int]($cropH * $scale)
$destX = [int]((512 - $destW) / 2)
$destY = [int]((512 - $destH) / 2)

$g.DrawImage($cropped, $destX, $destY, $destW, $destH)
$g.Dispose()
$cropped.Dispose()
$src.Dispose()

$target.Save('d:\Folia\assets\logo_cropped.png', [System.Drawing.Imaging.ImageFormat]::Png)
$target.Dispose()
Copy-Item 'd:\Folia\assets\logo_cropped.png' 'd:\Folia\assets\logo.png' -Force
Copy-Item 'd:\Folia\assets\logo_cropped.png' 'd:\Folia\assets\logo_real.png' -Force
Write-Host "Enlarged tightly-cropped logo generated successfully!"
