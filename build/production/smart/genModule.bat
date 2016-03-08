@echo off

cls

set appName=""

set /p appName=Informe o Nome do Modulo:

IF "%appName%"=="" GOTO :exit

:generateApp

	cd ../ext

	sencha generate app %appName% ../%appName%

	cd ../

	copy .\build\appBuild.bat .\%appName%\appBuild.bat
	copy .\build\composer.json .\%appName%\composer.json
	copy .\build\autoloadDump.bat .\%appName%\autoloadDump.bat

	mkdir .\%appName%\business

	DEL .\%appName%\smart\genModule.bat
	
	cd ./%appName%
	
	composer install

	GOTO :endGenerateApp

:exit
	echo Nome do Modulo NAO foi escolhido...
	pause

	GOTO :halt

:endGenerateApp
	echo Modulo criado com sucesso!
	pause

:halt
	cls