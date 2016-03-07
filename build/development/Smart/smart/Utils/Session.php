<?php

namespace Smart\Utils;

/**
 * Session
 * 
 * Realiza todo o controle de autenticação do Usuário no servidor
 * 
 * <code>
 * $session = Session::getInstance();
 * </code>
 */
class Session
{
    public static function have() {
        $usercode = self::read('usercode');
        return ( $usercode !== false );
    }

    public static function read($id) {
        @\session_start();
        return isset($_SESSION[$id]) ? $_SESSION[$id]: false;
    }

    public static function save($id, $data) {
        @\session_start();
        return $_SESSION[$id] = $data;
    }

    public static function kill() {
        @\session_start();
        @\session_unset();
//        setcookie("PHPSESSID","",time()-3600,"/");
        return @\session_destroy();
    }

    public static function slay() {
        @\session_start();
        unset($_SESSION['usercode']);
    }

}
//http://stackoverflow.com/questions/3740845/php-session-without-cookies
//ini_set('session.use_cookies', 0);
//ini_set('session.use_only_cookies', 0);
//ini_set('session.use_trans_sid', 1);
//session_start();
//// IP check
//if($_SESSION['ip_check'] != $_SERVER['REMOTE_ADDR']){
//    session_regenerate_id();
//    session_destroy();
//    session_start();
//}
//$_SESSION['ip_check'] = $_SERVER['REMOTE_ADDR'];
//// session stuff