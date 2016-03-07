<?php

namespace Smart\Utils;

//if( House\Utils\Session::have() === false ) {
//    $page = $_SERVER['PHP_SELF'];
//    $sec = "10";
//    header("Refresh: $sec; url=$page");
//    echo("<meta http-equiv='refresh' content='0'>");
//}

/**
 * @author Elton Schivei Costa 
 * @link http://schivei.wordpress.com/2012/05/11/realizando-autoload-de-scripts-com-php-5-3/
 */
class Loader
{
    private $pathLoader = null; // Guarda o endereço de busca pelas classes
    private static $_instance = null; // Guarda a instância do objeto Loader em memória

    protected function __construct()
    {
        error_reporting(E_ALL ^ (E_NOTICE | E_WARNING));
        $this->pathLoader = __DIR__ . '/../..' . DIRECTORY_SEPARATOR; // introduz o endereço de busca na variável local
        spl_autoload_register(array($this, '__autoload')); // guarda o loader no core do PHP
    }

    public function __autoload($object)
    {
        $file = preg_replace('#(\\|/)#', DIRECTORY_SEPARATOR, $object); // prepara o nome do arquivo

        if(preg_match('#^(\\|/)(.+)$#', $file)) // remove o separador de diretório do início do nome
            $file = substr($file, 1);

        if(preg_match('#^(.+)(\\|/)$#', $file)) // remove o separador de diretório do fim do nome
            $file = substr($file, -1);

        // Se a versão do seu PHP for 5.4 ou posterior, descomente o bloco de código dentro do if abaixo
        if (!class_exists($object, false) && !interface_exists($object, false) && !trait_exists($object, false))
        {
            $file = $this->pathLoader . $file . '.php';

            if (file_exists($file) && !is_dir($file)) // verifica se o arquivo existe e se ele não é um diretório
                require_once $file;
        }
    }

    public static function &getInstance()
    {
        if(empty(self::$_instance))
            self::$_instance = new self(); // cria a instância do objeto Loader em memória, é utilizado o "new self()" por que nossa classe é uma singleton

        return self::$_instance; // retorna a instância do objeto
    }

    public function loadObject($object)
    {
        $this->__autoload($object);
    }

}
 
Loader::getInstance();