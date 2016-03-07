<?php

namespace Smart\Utils;

use Smart\Common\Traits as Traits;

/**
 * Address
 * 
 * Classe para consumir WebService dos Correios
 */
class Address {
    use Traits\TresultSet;

    protected $post;

    public function __construct() {
        $this->post = $_POST;        
    }

    public function getWebService($url,$post=array(),$get=array()){
        $url = explode('?',$url,2);

        if(count($url)===2){
            $temp_get = array();
            parse_str($url[1],$temp_get);
            $get = array_merge($get,$temp_get);
        }

        $ch = curl_init($url[0]."?".http_build_query($get));
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        return curl_exec ($ch);
    }

    public function buscarCep() {
        $query = $this->post['query'];
        $url = 'http://m.correios.com.br/movel/buscaCepConfirma.do';
//        $query = $this->removeAccents($this->post['query']);

        if(strlen(trim($query)) != 0 ) {
            
            $html = $this->getWebService($url,array(
                        'cepEntrada'=>$query,
                        'tipoCep'=>'',
                        'cepTemp'=>'',
                        'metodo'=>'buscarCep'
                    ));
            
            $findout  = array();
            $address  = array();
            $matches  = 'Logradouro:';
            $parse = array('Logradouro','Bairro','Localidade / UF','CEP');

            $dom = new \DOMDocument;
            @$dom->loadHTML($html);
            $form = $dom->getElementsByTagName('form');

            foreach ($form as $elements) {
                $div = $elements->getElementsByTagName('div');
                for ($i = 0; $i < $div->length; $i++) {
                    $haystack   = $div->item($i)->nodeValue;
                    if(strpos($haystack, $matches) !== false) {
                        $address[] = explode(':',$haystack);
                    }
                }
            }

            foreach ($address as $fields) {
                $field  = array();

                for ($i = 1; $i < count($fields); $i++) {
                    $value = str_replace($parse, '', $fields[$i]);
                    $field[$parse[$i-1]] = rtrim(ltrim($value));
                }

                $field['Localidade / UF'] = explode('/',$field['Localidade / UF']);
                $field['Localidade'] = trim($field['Localidade / UF'][0]);
                $field['UF'] = trim($field['Localidade / UF'][1]);
                $field['CEP'] = substr($field['CEP'],0,8);
                unset($field['Localidade / UF']);

                $findout[] = $field;
            }

            self::_setRows($findout);
        }
        
        return self::getResultToJson();
    }

}