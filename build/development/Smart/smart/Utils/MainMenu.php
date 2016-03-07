<?php

namespace Smart\Utils;

use Smart\Setup\Start;
use Smart\Utils\Session;

/**
 * MainMenu
 *
 * Classe para carregamento de menu desktop
 *
 */
class MainMenu extends \Smart\Data\Proxy
{

    public function __construct() {
        $this->submit = $_POST;

        $this->pwd = Start::getPassWord();
        $this->usr = Start::getUserName();
        $this->dns = Start::getConnnect();
        $this->dtb = Start::getDataBase();

        $link = array( $this->dns, $this->usr, $this->pwd );

        parent::__construct( $link );
    }

    public function selectMenu () {

        $sql = "
            select
                id,
                parentid,
                name as text,
                description,
                router,
                glyph,
                isactive,
                classname
            from
                menu
            order by orderby, id, parentid";

        try {
            $data = $this->query($sql)->fetchAll();
            $rows = self::buildMenu($data);
        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText($e->getMessage());
            return self::getResultToJson();
        }
        return self::arrayToJson($rows);
    }

}