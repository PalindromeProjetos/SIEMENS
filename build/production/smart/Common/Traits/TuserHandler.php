<?php

namespace Smart\Common\Traits;

/**
 * TuserHandler
 * 
 * Implementa criptografia de senha no padrão blowfish.
 *
 * @category traits
 */
trait TuserHandler {
    
    /**
     * Default salt prefix
     * 
     * @see http://www.php.net/security/crypt_blowfish.php
     * 
     * @var string
     */
    protected static $_saltPrefix = '2a';

    /**
     * Default hashing cost (4-31)
     * 
     * @var integer
     */
    protected static $_defaultCost = 8;

    /**
     * Salt limit length
     * 
     * @var integer
     */
    protected static $_saltLength = 22;
    
    public static function getHash($password, $cost = null) {        
        if (empty($cost)) {
            $cost = self::$_defaultCost;
        }

        // Salt
        $salt = self::getSalt();

        // Hash string
        $hashString = self::setHash((int)$cost, $salt);

        return crypt($password, $hashString);
    }

    private static function setHash($cost, $salt) {
        return sprintf('$%s$%02d$%s$', self::$_saltPrefix, $cost, $salt);
    }

    public static function tryHash($password, $hash) {
        return (crypt($password, $hash) === $hash);
    }

    private static function getSalt() {
        // Salt seed
        $seed = uniqid(mt_rand(), true);

        // Generate salt
        $salt = base64_encode($seed);
        $salt = str_replace('+', '.', $salt);

        return substr($salt, 0, self::$_saltLength);
    }    
}