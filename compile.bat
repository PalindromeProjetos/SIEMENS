@echo off

cls

IF "%~1"=="" GOTO :askName

set appName="%1"

GOTO :callBuild

:askName
	set /p appName=Informe o Nome do Projeto:

IF "%appName%"=="" GOTO :exit

:callBuild
	cd %appName%
	call appBuild.bat

GOTO :endBuildApp

:exit
	echo Nome do Projeto NAO foi informado...!!!
	pause

	GOTO :halt

:endBuildApp
	echo Projeto %appName% foi compilado...
	pause

:halt
	exit