<?php

namespace Smart\Setup;

class Start {

    private static $pwd = "";
    private static $usr = "root";
    private static $dtb = "siemens";
    private static $tmz = "America/Manaus";
    private static $dns = "mysql:host=localhost;dbname=dtb";
//    private static $dns = "sqlsrv:server=(local);database=dtb";

    public static function getPassWord() {
        return self::$pwd;
    }
    public static function getUserName() {
        return self::$usr;
    }
    public static function getTimeZone() {
        return self::$tmz;
    }
    public static function getDataBase() {
        return self::$dtb;
    }
    public static function setTimeZone() {
        date_default_timezone_set(self::$tmz);
    }
    public static function getConnnect() {
        return str_replace("dtb",self::$dtb,self::$dns);
    }

}