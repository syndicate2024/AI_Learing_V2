# Smart Documentation Update Script
# Created: $(Get-Date -Format "yyyy-MM-dd")

# Configuration
$docsRoot = ".\docs"
$completeDocsPath = "$docsRoot\complete"
$changesPath = "$docsRoot\changes"
$handoffPath = "$docsRoot\handoff"
$sessionPath = "$docsRoot\sessions"

# Create directory structure if it doesn't exist
$folders = @(
    "$completeDocsPath\structure",
    "$completeDocsPath\features",
    "$completeDocsPath\implementations",
    "$changesPath",
    "$handoffPath\active_features",
    "$sessionPath"
)

foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force
    }
}

# Function to get current timestamp
function Get-TimeStamp {
    return Get-Date -Format "yyyy-MM-dd_HH-mm"
}

# Function to clean up old files with logging
function Remove-OldFiles {
    param (
        [string]$directory,
        [int]$keepCount = 5
    )
    
    $files = Get-ChildItem -Path $directory -File | Sort-Object LastWriteTime -Descending
    $oldFiles = $files | Select-Object -Skip $keepCount
    
    if ($oldFiles) {
        Write-Host "🧹 Cleaning up old files in $directory" -ForegroundColor Yellow
        $oldFiles | ForEach-Object {
            Write-Host "  - Removing $($_.Name)" -ForegroundColor Gray
            Remove-Item $_.FullName -Force
        }
    }
}

# Function to detect deep component relationships
function Get-ComponentRelationships {
    param (
        [string]$file
    )
    
    if (Test-Path $file) {
        $content = Get-Content $file
        $imports = $content | Where-Object { $_ -match '^import .+ from' }
        
        # Track imported components and their usage
        $importedComponents = @{}
        $imports | ForEach-Object {
            if ($_ -match 'import \{(.+)\} from [''"](.+)[''"]') {
                $componentList = $matches[1] -split ',' | ForEach-Object { $_.Trim() }
                $source = $matches[2]
                $componentList | ForEach-Object {
                    $importedComponents[$_] = $source
                }
            }
        }
        
        # Find component declarations
        $components = $content | Where-Object { 
            $_ -match '^(function|const)\s+([A-Z]\w+)' -or 
            $_ -match '^export\s+(function|const)\s+([A-Z]\w+)'
        } | ForEach-Object {
            if ($_ -match '(function|const)\s+([A-Z]\w+)') {
                $matches[2]
            }
        }
        
        # Find component usage in JSX (safely)
        $componentUsage = @()
        $content | Where-Object { $_ -match '<[A-Z]\w+' } | ForEach-Object {
            $line = $_
            if ($line) {
                try {
                    $matches = [regex]::Matches($line, '<([A-Z]\w+)')
                    if ($matches.Count -gt 0) {
                        $componentUsage += $matches.Groups[1].Value
                    }
                } catch {
                    # Skip if regex fails
                }
            }
        }
        $componentUsage = $componentUsage | Select-Object -Unique
        
        return @{
            Imports = $imports
            Components = $components
            ImportedComponents = $importedComponents
            UsedComponents = $componentUsage
        }
    }
    return $null
}

# Function to get theme information
function Get-ThemeInformation {
    $themeInfo = @{
        Colors = @()
        Animations = @()
        Typography = @()
        Components = @()
        Layout = @()
        Effects = @()
    }
    
    # Check existing theme documentation
    if (Test-Path "docs/Cyberpunk_Theme_Documentation.md") {
        $lines = Get-Content "docs/Cyberpunk_Theme_Documentation.md"
        $section = ""
        $subsection = ""
        
        foreach ($line in $lines) {
            # Detect main sections
            if ($line -match "^## \d+\. (.+)") {
                $section = $matches[1]
                continue
            }
            
            # Skip empty lines or non-list items
            if (-not ($line.Trim().StartsWith("-") -or $line.Trim().StartsWith("*"))) {
                continue
            }
            
            $item = $line.TrimStart("- ").TrimStart("* ").Trim()
            
            # Add items to appropriate sections based on the main section
            switch -Wildcard ($section) {
                "*Colors*" {
                    if ($item -match "\(([^)]+)\)") {
                        $themeInfo.Colors += "- 🎨 $item"
                    }
                }
                "*Fonts*" {
                    $themeInfo.Typography += "- 📝 $item"
                }
                "*Animations*" {
                    $themeInfo.Animations += "- 🎬 $item"
                }
                "*UI Components*" {
                    $themeInfo.Components += "- 🎨 $item"
                }
                "*Backgrounds*" {
                    $themeInfo.Effects += "- ✨ $item"
                }
                "*Layout*" {
                    $themeInfo.Layout += "- 📐 $item"
                }
            }
        }
    }
    
    # Check component patterns
    $componentPaths = @(
        "src\features",
        "src\shared\components"
    )
    
    foreach ($basePath in $componentPaths) {
        if (Test-Path $basePath) {
            Get-ChildItem -Path $basePath -Recurse -File -Filter "*.jsx" | ForEach-Object {
                $content = Get-Content $_.FullName -Raw
                if ($content -match "styled\.") {
                    $themeInfo.Components += "- 🎨 Styled Component: $($_.BaseName)"
                }
                if ($content -match "@keyframes") {
                    $themeInfo.Animations += "- 🎬 Animation in: $($_.BaseName)"
                }
            }
        }
    }
    
    return $themeInfo
}

# Function to get component status
function Get-ComponentStatus {
    param (
        [string]$componentPath,
        [string]$componentName
    )
    
    if (-not (Test-Path $componentPath -PathType Leaf)) {
        return @{
            Status = "⚪ Pending"
            Description = ""
            Dependencies = @()
        }
    }
    
    $content = Get-Content $componentPath -Raw
    if (-not $content) {
        return @{
            Status = "⚪ Pending"
            Description = ""
            Dependencies = @()
        }
    }
    
    $status = "⚪ Pending"
    $description = ""
    $dependencies = @()
    
    # Check implementation status
    if ($content -match "(function|const)\s+\w+\s*[=]?\s*\(") {
        if ($content -match "(TODO|FIXME)") {
            $status = "🟡 In Progress"
        } else {
            $status = "🟢 Complete"
        }
    }
    
    # Extract component description from comments
    if ($content -match "/\*\*([^*]+)\*/") {
        $description = $matches[1].Trim()
    }
    
    # Find dependencies
    $importMatches = [regex]::Matches($content, "import.+?from\s+[""']([^""']+)[""']")
    foreach ($match in $importMatches) {
        $dependencies += "  - 📦 $($match.Groups[1].Value)"
    }
    
    return @{
        Status = $status
        Description = $description
        Dependencies = $dependencies
    }
}

# Function to create session summary
function New-SessionSummary {
    param (
        [string]$handoffFile
    )
    
    $timestamp = Get-TimeStamp
    $sessionFile = "$sessionPath\session_$timestamp.md"
    
    "# Session Summary - $(Get-Date -Format 'yyyy-MM-dd HH:mm')`n" | Out-File $sessionFile
    
    # Get changes since last session
    "## Changes Made`n" | Add-Content $sessionFile
    Get-ChildItem -Path "src" -Recurse -File | 
        Where-Object { $_.LastWriteTime -gt (Get-Date).AddHours(-24) } |
        ForEach-Object {
            $status = Get-ComponentStatus $_.FullName $_.BaseName
            "- Modified: $($_.Name) $($status.Status)" | Add-Content $sessionFile
            if ($status.Description) {
                "  - $($status.Description)" | Add-Content $sessionFile
            }
            foreach ($dep in $status.Dependencies) {
                $dep | Add-Content $sessionFile
            }
        }
    
    # Get implementation status
    "`n## Implementation Status`n" | Add-Content $sessionFile
    Get-ChildItem -Path "src\\features\\*\\components" -Directory | ForEach-Object {
        "### $($_.Name)" | Add-Content $sessionFile
        $files = Get-ChildItem -Path $_.FullName -File -Recurse
        $files | ForEach-Object {
            $status = Get-ComponentStatus $_.FullName $_.BaseName
            "- $($status.Status) $($_.Name)" | Add-Content $sessionFile
            if ($status.Description) {
                "  - $($status.Description)" | Add-Content $sessionFile
            }
            foreach ($dep in $status.Dependencies) {
                $dep | Add-Content $sessionFile
            }
        }
        "`n" | Add-Content $sessionFile
    }
    
    # Get theme updates
    "`n## Theme Updates`n" | Add-Content $sessionFile
    $themeInfo = Get-ThemeInformation
    foreach ($key in $themeInfo.Keys) {
        "### $key" | Add-Content $sessionFile
        $themeInfo[$key] | ForEach-Object {
            $_ | Add-Content $sessionFile
        }
    }
    
    return $sessionFile
}

# Enhanced Update-HandoffDocs function
function Update-HandoffDocs {
    $timestamp = Get-TimeStamp
    $handoffFile = "$handoffPath\current_context.md"
    
    "# Current Development Context - $(Get-Date -Format 'yyyy-MM-dd HH:mm')`n" | Out-File $handoffFile
    
    # Get latest changes
    $latestChanges = Get-ChildItem "$changesPath\*.md" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($latestChanges) {
        "## Recent Changes`n" | Add-Content $handoffFile
        Get-Content $latestChanges.FullName | Select-Object -Skip 2 | Add-Content $handoffFile
    }
    
    # Add Feature Status with enhanced details
    "`n## Feature Status`n" | Add-Content $handoffFile
    Get-ChildItem -Path "src\\features\\*\\components" -Directory | ForEach-Object {
        $featureName = $_.Name
        $files = Get-ChildItem -Path $_.FullName -File -Recurse
        if ($files.Count -gt 0) {
            "### $($featureName.ToUpper())" | Add-Content $handoffFile
            $overallStatus = "⚪ Not Started"
            $completedCount = 0
            
            foreach ($file in $files) {
                $status = Get-ComponentStatus $file.FullName $file.BaseName
                if ($status.Status -eq "🟢 Complete") { $completedCount++ }
            }
            
            if ($completedCount -eq $files.Count) {
                $overallStatus = "🟢 Complete"
            } elseif ($completedCount -gt 0) {
                $overallStatus = "🟡 In Progress ($completedCount/$($files.Count) complete)"
            }
            
            "Status: $overallStatus`n" | Add-Content $handoffFile
            "Files:" | Add-Content $handoffFile
            $files | ForEach-Object {
                $status = Get-ComponentStatus $_.FullName $_.BaseName
                "- $($status.Status) $($_.Name)" | Add-Content $handoffFile
                if ($status.Description) {
                    "  - $($status.Description)" | Add-Content $handoffFile
                }
                foreach ($dep in $status.Dependencies) {
                    $dep | Add-Content $handoffFile
                }
            }
            "`n" | Add-Content $handoffFile
        }
    }
    
    # Add Core Component Structure
    "`n## Application Structure`n" | Add-Content $handoffFile
    
    # Check main.jsx and its relationships
    if (Test-Path "src\main.jsx") {
        "### Entry Point (main.jsx)`n" | Add-Content $handoffFile
        $mainDetails = Get-ComponentRelationships "src\main.jsx"
        if ($mainDetails) {
            "#### Core Providers and Setup" | Add-Content $handoffFile
            $mainDetails.Imports | ForEach-Object {
                "- $_" | Add-Content $handoffFile
            }
        }
    }
    
    # Check App.jsx and its connections
    if (Test-Path "src\App.jsx") {
        "`n### Main Application (App.jsx)`n" | Add-Content $handoffFile
        $appDetails = Get-ComponentRelationships "src\App.jsx"
        if ($appDetails) {
            "#### Component Relationships" | Add-Content $handoffFile
            $appDetails.UsedComponents | ForEach-Object {
                $component = $_
                $source = $appDetails.ImportedComponents[$component]
                if ($source) {
                    "- $component (from $source)" | Add-Content $handoffFile
                }
            }
        }
    }
    
    # Add Theme Documentation with enhanced details
    "`n## Theme Implementation`n" | Add-Content $handoffFile
    $themeInfo = Get-ThemeInformation
    foreach ($key in $themeInfo.Keys) {
        "### $key" | Add-Content $handoffFile
        $themeInfo[$key] | ForEach-Object {
            $_ | Add-Content $handoffFile
        }
    }
    
    # Add Recent Sessions (prevent duplication)
    "`n## Recent Sessions`n" | Add-Content $handoffFile
    Get-ChildItem "$sessionPath\*.md" | 
        Sort-Object LastWriteTime -Descending | 
        Select-Object -First 3 |
        ForEach-Object {
            $sessionContent = Get-Content $_.FullName
            $dateMatch = $sessionContent | Select-String -Pattern "# Session Summary - (\d{4}-\d{2}-\d{2} \d{2}:\d{2})"
            if ($dateMatch) {
                try {
                    $sessionDate = [datetime]::ParseExact(
                        $dateMatch.Matches[0].Groups[1].Value,
                        "yyyy-MM-dd HH:mm",
                        [System.Globalization.CultureInfo]::InvariantCulture
                    )
                    "### Session from $($sessionDate.ToString('yyyy-MM-dd HH:mm'))`n" | Add-Content $handoffFile
                    $sessionContent | Select-Object -Skip 2 | Add-Content $handoffFile
                    "`n---`n" | Add-Content $handoffFile
                } catch {
                    Write-Warning "Could not parse date from session file $($_.Name)"
                }
            }
        }
    
    # Add Enhanced Next Steps with context
    "`n## Next Steps`n" | Add-Content $handoffFile
    Get-ChildItem -Path "src\\features\\*\\components" -Directory | ForEach-Object {
        $files = Get-ChildItem -Path $_.FullName -File -Recurse
        if ($files.Count -eq 0) {
            $complexity = "🟢 Low"  # Default to low
            $dependencies = @()
            
            # Check for required dependencies
            if ($_.Name -match "auth|api") {
                $complexity = "🔴 High"
                $dependencies += "- Requires authentication setup"
            } elseif ($_.Name -match "dashboard|analytics") {
                $complexity = "🟡 Medium"
                $dependencies += "- Requires data processing"
            }
            
            "### Implement $($_.Name) feature" | Add-Content $handoffFile
            "- Complexity: $complexity" | Add-Content $handoffFile
            if ($dependencies.Count -gt 0) {
                "- Dependencies:" | Add-Content $handoffFile
                $dependencies | ForEach-Object {
                    "  $_" | Add-Content $handoffFile
                }
            }
            "`n" | Add-Content $handoffFile
        }
    }
    
    return $handoffFile
}

# Function to generate project structure
function Get-ProjectStructure {
    $timestamp = Get-TimeStamp
    $outputPath = "$completeDocsPath\structure\structure_$timestamp.md"
    
    "# Project Structure - $(Get-Date -Format 'yyyy-MM-dd HH:mm')`n" | Out-File $outputPath
    "## Directory Structure`n" | Add-Content $outputPath
    
    Get-ChildItem -Path "." -Recurse | 
        Where-Object { $_.FullName -notlike '*\node_modules\*' -and 
                      $_.FullName -notlike '*\.git\*' -and 
                      $_.FullName -notlike '*\docs\complete\*' } | 
        ForEach-Object {
            $indent = "  " * ($_.FullName.Split("\").Count - 2)
            $line = if ($_.PSIsContainer) {
                "$indent- 📁 $($_.Name)"
            } else {
                "$indent- 📄 $($_.Name)"
            }
            Add-Content $outputPath $line
        }
    
    return $outputPath
}

# Enhanced change tracking
function Get-Changes {
    $timestamp = Get-TimeStamp
    $changesFile = "$changesPath\changes_$timestamp.md"
    $lastChanges = Get-ChildItem "$changesPath\*.md" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    
    "# Changes Detected - $(Get-Date -Format 'yyyy-MM-dd HH:mm')`n" | Out-File $changesFile
    
    if ($lastChanges) {
        $lastContent = Get-Content $lastChanges.FullName
        $newChanges = Get-ChildItem -Path "." -Recurse | 
            Where-Object { $_.LastWriteTime -gt $lastChanges.LastWriteTime -and 
                          $_.FullName -notlike '*\node_modules\*' -and 
                          $_.FullName -notlike '*\.git\*' -and 
                          $_.FullName -notlike '*\docs\complete\*' }
        
        if ($newChanges) {
            "## Modified Files Since Last Run`n" | Add-Content $changesFile
            $newChanges | ForEach-Object {
                $status = Get-ComponentStatus $_.FullName $_.BaseName
                "- $($_.FullName.Replace($PWD.Path + '\', '')) $($status.Status)" | Add-Content $changesFile
                if ($status.Description) {
                    "  - $($status.Description)" | Add-Content $changesFile
                }
            }
            return $changesFile
        } else {
            Remove-Item $changesFile
            Write-Host "ℹ️ No new changes detected, using previous change log" -ForegroundColor Blue
            return $lastChanges.FullName
        }
    }
    
    return $changesFile
}

# Function to compare and update dependencies
function Update-DependenciesIfChanged {
    param (
        [string]$handoffFile
    )
    
    $lastDepsFile = "$handoffPath\last_dependencies.json"
    $currentDeps = Get-Content "package.json" | ConvertFrom-Json | Select-Object -ExpandProperty dependencies
    
    if (Test-Path $lastDepsFile) {
        $lastDeps = Get-Content $lastDepsFile | ConvertFrom-Json
        $changes = @()
        
        $currentDeps.PSObject.Properties | ForEach-Object {
            $depName = $_.Name
            $newVersion = $_.Value
            $oldVersion = $lastDeps.PSObject.Properties[$depName].Value
            if ($oldVersion -ne $newVersion) {
                $changes += "- Updated ${depName}: ${oldVersion} → ${newVersion}"
            }
        }
        
        if ($changes.Count -gt 0) {
            "`n## Dependency Updates`n" | Add-Content $handoffFile
            $changes | Add-Content $handoffFile
        }
    }
    
    $currentDeps | ConvertTo-Json | Out-File $lastDepsFile
}

# Main execution
Write-Host "🔄 Updating documentation..." -ForegroundColor Cyan

# Clean up old files (keep last 5)
Remove-OldFiles "$completeDocsPath\structure" 5
Remove-OldFiles "$changesPath" 5
Remove-OldFiles "$sessionPath" 5

# Generate new structure only if there are changes
$lastStructure = Get-ChildItem "$completeDocsPath\structure\*.md" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
$needsUpdate = $true

if ($lastStructure) {
    $lastContent = Get-Content $lastStructure.FullName
    $currentStructure = Get-ProjectStructure
    $currentContent = Get-Content $currentStructure
    
    if (Compare-Object $lastContent $currentContent -SyncWindow 0) {
        $needsUpdate = $true
    } else {
        $needsUpdate = $false
        Remove-Item $currentStructure
    }
}

if ($needsUpdate) {
    $structureFile = Get-ProjectStructure
    Write-Host "✅ Project structure updated: $structureFile" -ForegroundColor Green
} else {
    Write-Host "ℹ️ No structure changes detected" -ForegroundColor Blue
}

# Create new session summary
$sessionFile = New-SessionSummary
Write-Host "✅ Session summary created: $sessionFile" -ForegroundColor Green

# Detect and document changes
$changesFile = Get-Changes
Write-Host "✅ Changes documented: $changesFile" -ForegroundColor Green

# Update handoff documentation
$handoffFile = Update-HandoffDocs
Write-Host "✅ Handoff documentation updated: $handoffFile" -ForegroundColor Green

Write-Host "`n📚 Documentation update complete!" -ForegroundColor Cyan
Write-Host "   - Complete docs: $completeDocsPath"
Write-Host "   - Changes: $changesPath"
Write-Host "   - Sessions: $sessionPath"
Write-Host "   - Handoff: $handoffPath" 
