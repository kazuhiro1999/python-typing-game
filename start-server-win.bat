@echo off
rem ポート番号を指定（デフォルトで8000番）
set PORT=8000

rem Pythonのhttp.serverモジュールを使用してHTTPサーバーを起動
python -m http.server %PORT%

rem 終了メッセージ
echo サーバーがポート %PORT% で起動しました。
pause
