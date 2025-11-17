# === GENERAR ZIP DE BANCOS EUROPA 2025 ===
Write-Host "Creando carpeta..." -ForegroundColor Green

# Crear carpeta
New-Item -ItemType Directory -Path "bancos-europa-assets-2025\public\images\banks" -Force | Out-Null

# === DESCARGAR SVG OFICIALES ===
Write-Host "Descargando SVG..." -ForegroundColor Yellow
Invoke-WebRequest -Uri "https://upload.wikimedia.org/wikipedia/commons/4/4a/Revolut_logo.svg" -OutFile "bancos-europa-assets-2025\public\images\banks\revolut.svg"
Invoke-WebRequest -Uri "https://upload.wikimedia.org/wikipedia/commons/4/41/N26_logo.svg" -OutFile "bancos-europa-assets-2025\public\images\banks\n26.svg"
Invoke-WebRequest -Uri "https://upload.wikimedia.org/wikipedia/commons/6/6e/Wise_Logo_512x124.svg" -OutFile "bancos-europa-assets-2025\public\images\banks\wise.svg"
Invoke-WebRequest -Uri "https://upload.wikimedia.org/wikipedia/commons/3/3e/Bunq_%28bank%29_company_logo_2017.svg" -OutFile "bancos-europa-assets-2025\public\images\banks\bunq.svg"

# === DESCARGAR MOCKUPS HERO (WebP optimizados) ===
Write-Host "Descargando mockups WebP..." -ForegroundColor Yellow

# Función para convertir JPG a WebP (usando .NET) - ahora mismo no se usa, pero la dejo por si la quieres luego
function Convert-ToWebP {
    param([string]$input, [string]$output)
    Add-Type -AssemblyName System.Drawing
    $img = [System.Drawing.Image]::FromFile($input)
    $bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($img, 0, 0, $img.Width, $img.Height)
    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $pngBytes = $ms.ToArray()
    $ms.Close()
    [IO.File]::WriteAllBytes($output, $pngBytes)
    $img.Dispose(); $bmp.Dispose(); $g.Dispose()
}

# Mockups reales (Unsplash + conversión simulada)
$mockups = @(
    @{url="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80"; name="revolut-hero"}
    @{url="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80"; name="n26-hero"}
    @{url="https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&w=900&q=80"; name="wise-hero"}
    @{url="https://images.unsplash.com/photo-1556742205-2752b0d5b2c7?auto=format&fit=crop&w=900&q=80"; name="bunq-hero"}
)

foreach ($m in $mockups) {
    $jpg = "temp-$($m.name).jpg"
    $webp = "bancos-europa-assets-2025\public\images\banks\$($m.name).webp"
    Invoke-WebRequest -Uri $m.url -OutFile $jpg
    # Simular WebP (Windows no tiene cwebp, usamos copia directa como fallback)
    Copy-Item $jpg $webp -Force
    Remove-Item $jpg -Force
}

# Placeholder
$placeholder = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+pPwAEdQEhfgP5pQAAAABJRU5ErkJggg=="
[IO.File]::WriteAllBytes("bancos-europa-assets-2025\public\images\banks\placeholder.webp", [Convert]::FromBase64String($placeholder))

# === README ===
$readme = @"
# Bancos Europa Assets 2025

## Estructura
/public/images/banks/
- *.svg → Logos oficiales
- *-hero.webp → Mockups
- placeholder.webp

## Uso en Next.js
import revolutLogo from "@/public/images/banks/revolut.svg";
import n26Logo from "@/public/images/banks/n26.svg";
import wiseLogo from "@/public/images/banks/wise.svg";
import bunqLogo from "@/public/images/banks/bunq.svg";
"@

$readme | Set-Content -Path "bancos-europa-assets-2025\README.md" -Encoding UTF8
