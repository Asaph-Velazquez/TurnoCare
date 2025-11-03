# Script para limpiar console.log, console.error, console.warn
$directorio = ".\src\Components"

# Extensiones que quieres revisar
$extensiones = @("*.tsx", "*.ts", "*.jsx", "*.js")

Write-Host "Iniciando limpieza de console.* en $directorio..." -ForegroundColor Cyan

$archivosModificados = 0

# Iterar sobre cada tipo de extensión
foreach ($extension in $extensiones) {
    Get-ChildItem -Path $directorio -Recurse -Include $extension -File | ForEach-Object {
        $archivo = $_.FullName
        $contenido = Get-Content $archivo -Raw
        
        # Guardar contenido original para comparar
        $contenidoOriginal = $contenido
        
        # Eliminar líneas con console.log, console.error, console.warn
        # Incluye el salto de línea para no dejar líneas vacías
        $contenido = $contenido -replace '^\s*console\.(log|error|warn)\([^)]*\);?\s*[\r\n]+', '', 'Multiline'
        
        # También eliminar console en medio de líneas (menos común pero posible)
        $contenido = $contenido -replace '\s*console\.(log|error|warn)\([^)]*\);?\s*', ''
        
        # Solo escribir si hubo cambios
        if ($contenido -ne $contenidoOriginal) {
            Set-Content -Path $archivo -Value $contenido -NoNewline
            Write-Host "✓ Limpiado: $($_.Name)" -ForegroundColor Green
            $archivosModificados++
        }
    }
}

Write-Host "`n✓ Limpieza completada" -ForegroundColor Green
Write-Host "Archivos modificados: $archivosModificados" -ForegroundColor Yellow
