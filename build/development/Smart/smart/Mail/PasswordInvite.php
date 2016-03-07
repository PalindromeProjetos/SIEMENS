<?php

namespace Smart\Mail;

use Smart\Utils\SendMail;

class PasswordInvite extends SendMail {

    /**
     * @param array $data
     * @param $body
     */
    public function configEmail (array $data, $body) {

        foreach($data as $field=>$value) {
            $body = str_replace( '$'.$field, $value, $body );
        }

        $this->MsgHTML($body);
        $this->Subject = 'Senha Definitiva!';
        $this->AddAddress($data["mainmail"]);
    }
}