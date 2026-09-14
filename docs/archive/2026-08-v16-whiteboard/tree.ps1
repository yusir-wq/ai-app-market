$json = Get-Content "./v1_6_tmp/wb1_nodes.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$nodes = @{}
foreach ($n in $json.nodes) {
  $parentId = $null
  if ($n.mind_map) { $parentId = $n.mind_map.parent_id }
  if (-not $parentId -and $n.mind_map_node) { $parentId = $n.mind_map_node.parent_id }
  $txt = ""
  if ($n.text -and $n.text.text) { $txt = $n.text.text }
  $txt = $txt -replace "`r`n", " / " -replace "`n", " / "
  $nodes[$n.id] = @{ p = $parentId; t = $txt }
}
$children = @{}
foreach ($id in $nodes.Keys) {
  $p = $nodes[$id].p
  if (-not $p) { $p = "ROOT" }
  if (-not $children[$p]) { $children[$p] = @() }
  $children[$p] += $id
}
$lines = New-Object System.Collections.Generic.List[string]
function PrintTree($id, $depth) {
  $prefix = "  " * $depth
  $t = $nodes[$id].t
  if (-not $t) { $t = "(empty)" }
  $script:lines.Add("$prefix- $t")
  if ($children[$id]) {
    foreach ($c in $children[$id]) { PrintTree $c ($depth + 1) }
  }
}
foreach ($root in $children["ROOT"]) { PrintTree $root 0 }
$lines | Out-File "./v1_6_tmp/wb1_tree.txt" -Encoding UTF8
Write-Output ("total lines: " + $lines.Count)
