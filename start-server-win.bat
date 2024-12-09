@echo off
rem Conda環境をアクティベート
call C:\Users\esaki\anaconda3\Scripts\activate.bat base

rem ポート番号を指定（デフォルトで8000番）
set PORT=8000

rem Pythonのhttp.serverモジュールを使用してHTTPサーバーを起動
python -m http.server %PORT%

rem 終了メッセージ
echo サーバーがポート %PORT% で起動しました。
pause