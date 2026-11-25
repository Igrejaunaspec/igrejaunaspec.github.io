#!/bin/bash
# Instala (ou conserta) o Importador de Letras no Mac Nicolly.
# Ele pega as músicas que o app "Letras da Partitura" salva em Downloads e pede ao ProPresenter para importá-las.
set -e
APP="$HOME/Applications/Importador de Letras.app"
mkdir -p "$HOME/Applications"
pkill -f "Importador de Letras.app" 2>/dev/null || true
cat > /tmp/importador.applescript <<'AS'
on run
	idle
end run
on idle
	try
		set r to do shell script "/bin/bash " & quoted form of (POSIX path of (path to me) & "Contents/Resources/importar.sh")
		if r is not "" then display notification r with title "Importador de Letras"
	end try
	return 3
end idle
AS
rm -rf "$APP"
osacompile -s -o "$APP" /tmp/importador.applescript
cat > "$APP/Contents/Resources/importar.sh" <<'SH'
#!/bin/bash
# Pega as músicas que o app "Letras da Partitura" salva em Downloads e pede ao ProPresenter para importá-las.
DL="$HOME/Downloads"
HOLD="$HOME/Documents/Letras da Partitura"
mkdir -p "$HOLD"
shopt -s nullglob
novos=()
guardar() {
  local f="$1" b d k=2
  b=$(basename "$f" .pro); b=${b#LETRAS - }; d="$HOLD/$b.pro"
  while [ -e "$d" ]; do d="$HOLD/$b ($k).pro"; k=$((k+1)); done
  mv "$f" "$d" && novos+=("$d")
}
for z in "$DL"/LETRAS\ -\ *.zip; do
  [ $(( $(date +%s) - $(stat -f %m "$z") )) -lt 2 ] && continue
  tmp=$(mktemp -d)
  if ditto -x -k "$z" "$tmp"; then
    for f in "$tmp"/*.pro; do guardar "$f"; done
    mv "$z" "$HOME/.Trash/" 2>/dev/null || rm -f "$z"
  fi
  rm -rf "$tmp"
done
for f in "$DL"/LETRAS\ -\ *.pro; do guardar "$f"; done
[ ${#novos[@]} -eq 0 ] && exit 0
auto=0
for f in "${novos[@]}"; do
  open -a ProPresenter "$f"
  for i in $(seq 1 15); do
    sleep 1
    r=$(osascript 2>/dev/null <<'AS'
on apertarOK(w, olharTexto)
	tell application "System Events"
	set alvo to false
	try
		if (name of w) contains "Importar" then set alvo to true
	end try
	if (not alvo) and olharTexto then
		try
			repeat with t in (every static text of entire contents of w)
				if (value of t as text) contains "local para importar" then set alvo to true
			end repeat
		end try
	end if
	if not alvo then return false
	try
		click button "OK" of w
		return true
	end try
	repeat with e in (entire contents of w)
		try
			if (class of e is button) and (name of e is "OK") then
				click e
				return true
			end if
		end try
	end repeat
	return false
	end tell
end apertarOK
tell application "System Events"
	if not (exists process "ProPresenter") then return "no"
	tell process "ProPresenter"
		repeat with w in windows
			if my apertarOK(w, false) then return "ok"
			try
				repeat with s in sheets of w
					if my apertarOK(s, true) then return "ok"
				end repeat
			end try
		end repeat
	end tell
end tell
return "no"
AS
)
    [ "$r" = "ok" ] && { auto=$((auto+1)); sleep 1; break; }
  done
done
n=${#novos[@]}
if [ $auto -eq $n ]; then
  [ $n -eq 1 ] && echo "1 música importada no ProPresenter" || echo "$n músicas importadas no ProPresenter"
else
  echo "$n música(s) enviada(s) ao ProPresenter. Clique em OK na janela de importação."
fi
exit 0
SH
/usr/libexec/PlistBuddy -c "Add :LSUIElement bool true" "$APP/Contents/Info.plist" 2>/dev/null || true
codesign --force --deep -s - "$APP"
osascript -e 'tell application "System Events" to if not (exists login item "Importador de Letras") then make login item at end with properties {path:(POSIX path of (path to home folder)) & "Applications/Importador de Letras.app", hidden:true}' >/dev/null || true
open "$APP"
echo "PRONTO: Importador de Letras instalado e ligado"
