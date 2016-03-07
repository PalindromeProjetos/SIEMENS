<?php

namespace Smart\Setup;

use Smart\Setup\Start;

class Setup extends \Smart\Common\Coach {

    public function __construct() {
        Start::setTimeZone();

        $this->pwd = Start::getPassWord();
        $this->usr = Start::getUserName();
        $this->dns = Start::getConnnect();

        parent::__construct();
    }

}