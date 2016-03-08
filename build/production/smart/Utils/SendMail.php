<?php

namespace Smart\Utils;

use PHPMailer;
use SMTP;

class SendMail extends PHPMailer {

    public function __construct() {
        parent::__construct();

        $this->IsSMTP();							                // telling the class to use SMTP
        $this->SMTPDebug  = 0;                                      // enables SMTP debug information (for testing)
                                                                    //  - 1 = errors and messages
                                                                    //  - 2 = messages only

        //== Set Config Server
        $this->SMTPAuth   = true;									// enable SMTP authentication
//        $this->SMTPSecure = "tls";
        $this->Host       = "smtp1.dsa.org.br";						// sets the SMTP server
        $this->Port       = 2525;                    				// set the SMTP port for the GMAIL server
        $this->From       = "webmaster@armseguros.com.br"; 			// SMTP account username@domain
        $this->FromName   = "AppAnest - NoReplay";
        $this->Username   = "webmaster@armseguros.com.br";			// SMTP account username@domain
        $this->Password   = "mRAst5817$";							// SMTP account password

        $this->IsHTML(true);
    }

    /**
     * @param array $data
     * @param $body
     */
    public function configEmail (array $data, $body) {

    }

}