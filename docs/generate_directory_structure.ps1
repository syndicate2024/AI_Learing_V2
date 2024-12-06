# Create a more detailed directory structure
$outputPath = "directory_structure.txt"

Get-ChildItem -Path "X:\Cursor\Projects\ai_powered_learning_platform" -Recurse | 
    Where-Object { $_.FullName -notlike '*\node_modules\*' -and $_.FullName -notlike '*\.git\*' } | 
    Select-Object @{
        Name = "Structure"
        Expression = {
            $indent = "    " * ($_.FullName.Split("\").Count - ($_.FullName.Split("\")[0] + "\" + $_.FullName.Split("\")[1]).Split("\").Count)
            if ($_.PSIsContainer) {
                "$indent+---$($_.Name)"
            } else {
                "$indent|   $($_.Name)"
            }
        }
    } | 
    ForEach-Object { $_.Structure } | 
    Out-File -FilePath $outputPath -Encoding UTF8

# Display the contents of the file
Get-Content $outputPath 