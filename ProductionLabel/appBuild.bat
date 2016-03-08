cls

::http://www.robvanderwoude.com/battech_convertcase.php
::http://stackoverflow.com/questions/2027070/how-to-concatenate-strings-in-a-windows-batch-file

::Preparando build version
    set curPath="%cd%"
    set appName="%appName%"
    ::php -f %curPath%/smart/Build.php

::Gerando build
    sencha app build classic

::Concatenando
set appName=%appName%pro

::ToLowerCase
CALL :LoCase appName

::Iniciando versão build
    start http://localhost/siemens-pro/productionlabel/

GOTO:EOF

:LoCase
FOR %%i IN ("A=a" "B=b" "C=c" "D=d" "E=e" "F=f" "G=g" "H=h" "I=i" "J=j" "K=k" "L=l" "M=m" "N=n" "O=o" "P=p" "Q=q" "R=r" "S=s" "T=t" "U=u" "V=v" "W=w" "X=x" "Y=y" "Z=z") DO CALL SET "%1=%%%1:%%~i%%"