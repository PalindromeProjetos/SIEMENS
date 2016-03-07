@echo off

cls

set appName=""

set /p appName=Informe o Nome do Projeto:

IF "%appName%"=="" GOTO :exit

:generateApp

	cd ../ext

	sencha generate app %appName% ../../%appName%

	cd ../

	xcopy /y extras\*.* ..\..\..\%appName% /e

	cd ../../../%appName%

	mkdir .\smart

    xcopy /y ..\Smart__\framework\*.* .\smart /e

	cd ../%appName%

	composer install

	GOTO :endGenerateApp

:exit
	echo Nome do Projeto NAO foi escolhido...
	pause

	GOTO :halt

:endGenerateApp
	echo Projeto criado com sucesso!
	pause

:halt
	cls