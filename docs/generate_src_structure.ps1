# Create directory structure for src folder only
$outputPath = "src_structure.txt"

Get-ChildItem -Path "X:\Cursor\Projects\ai_powered_learning_platform\src" -Recurse | 
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