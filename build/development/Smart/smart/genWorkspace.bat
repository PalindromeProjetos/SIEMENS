@echo off

cls

set wksName=""

set /p wksName=Informe o Nome da Area de Trabalho:

IF "%wksName%"=="" GOTO :exit

:generateWks

	cd ../ext

	sencha generate workspace ../../%wksName%

	cd ../

	mkdir ..\%wksName%\build

	copy .\build\build.bat ..\%wksName%\build.bat
	copy appBuild.bat ..\%wksName%\build\appBuild.bat
	copy composer.json ..\%wksName%\build\composer.json
	copy autoloadDump.bat ..\%wksName%\build\autoloadDump.bat

	mkdir ..\%wksName%\smart
	mkdir ..\%wksName%\vendor
	mkdir ..\%wksName%\library
	mkdir ..\%wksName%\overrides
	mkdir ..\%wksName%\build\development\Smart

	copy .\build\genModule.bat ..\%wksName%\smart\genModule.bat

    xcopy /y .\smart\*.* ..\%wksName%\smart /e
    xcopy /y .\vendor\*.* ..\%wksName%\vendor /e
    xcopy /y .\library\*.* ..\%wksName%\library /e
    xcopy /y .\overrides\*.* ..\%wksName%\overrides /e
	xcopy /y .\build\production\Smart\*.* ..\%wksName%\build\development\Smart /e

    DEL ..\%wksName%\smart\genWorkspace.bat
    DEL ..\%wksName%\smart\genApplication.bat

	cd ../%wksName%/smart

	rd Business /s /q

	cd ../

	GOTO :endGenerateWks

:exit
	echo Nome da Area de Trabalho NAO foi escolhida...
	pause

	GOTO :halt

:endGenerateWks
	echo Area de Trabalho criada com sucesso!
	pause

:halt
	cls