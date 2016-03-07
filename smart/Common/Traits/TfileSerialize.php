<?php

namespace Smart\Common\Traits;

trait TfileSerialize {
    private static $response;
    private static $resizableSize;
    private static $resizableQuality;
    private static $mapping = array();

    private static function setMapping() {
        self::$mapping["image/gif"] = true;
        self::$mapping["image/png"] = true;
        self::$mapping["image/jpeg"] = true;
        self::$mapping["image/pjpeg"] = true;
        self::$mapping["text/plain"] = false;
        self::$mapping["application/pdf"] = false;
        self::$mapping["application/zip"] = false;
        self::$mapping["application/msword"] = false;
        self::$mapping["application/x-excel"] = false;
        self::$mapping["application/x-msexcel"] = false;
        self::$mapping["application/octet-stream"] = false;
        self::$mapping["application/vnd.ms-excel"] = false;
        self::$mapping["text/comma-separated-values"] = false;
        self::$mapping["application/vnd.ms-powerpoint"] = false;
        self::$mapping["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"] = false;
        self::$mapping["application/vnd.openxmlformats-officedocument.wordprocessingml.document"] = false;
    }

    public function filePath( ){
        return sprintf(
            "%s://%s%s",
            isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
            $_SERVER['SERVER_NAME'],
            $_SERVER['REQUEST_URI']
        );
    }

    public function saveFile($data) {
        $post = (object) $data;

        self::setMapping();

        // recupera variáveis
        $fileData = $_FILES["filedata"];
        $fileName = $fileData["name"];
        $fileType = $fileData["type"];
        $tempName = $fileData["tmp_name"];
        $dataType = self::$mapping[$fileType];

        if(!is_uploaded_file($tempName)) {
            self::$response->success = false;
            self::$response->text = "O arquivo não foi enviado com sucesso. Erro de sistema: {$fileData['error']}.";
            return json_encode(self::$response);
        }

        if(!array_key_exists($fileType, self::$mapping)) {
            return '{"success":false,"records":0,"error":2,"root":[],"text":"Tipo de arquivo não mapeado para esta operação!"}';
        }

        // comprime arquivo temporário
        if($dataType === true) {
            self::sizeFile();
            self::workSize($tempName);
        }

        $tempData = base64_encode(file_get_contents($tempName));

        // recupera extensão do arquivo
        $fileExtension = strtoupper(strrchr($fileName,"."));
        $fileExtension = str_replace(".","",$fileExtension);

        $fileInfo = array("fileType"=>$fileType,"fileExtension"=>$fileExtension,"dataType"=>$dataType, "fileName"=>$fileName);
        $fileInfo = stripslashes(json_encode($fileInfo));

        $affectedRows = $this->exec("update $post->tableName set filedata = '$tempData', fileinfo = '$fileInfo' where id = $post->id");

        unlink($tempName);

        return $affectedRows;
    }

    public function nullFile($data) {
        $post = (object) $data;

        $sql = "update $post->tableName set filedata = null, fileinfo = null where id = $post->id";

        $affectedRows = $this->exec($sql);

        return $affectedRows;
    }

    public function loadFile() {
        $result = $this->loadData();

        $info = json_decode($result["fileinfo"]);
        $data = base64_decode($result["filedata"]);

        $type = $info->fileType;

        ob_clean();
        header("Content-Type: $type");

        print($data);
    }

    public function downFile() {
        $result = $this->loadData();

        $info = json_decode($result["fileinfo"]);
        $data = base64_decode($result["filedata"]);

        $type = $info->fileType;
        $name = $info->fileName;

        ob_clean();
        header("Content-Type: $type;");
        header("Content-Length: " . strlen($data));
        header("Content-Disposition: attachment; filename=\"$name\"");

        print($data);
    }

    private function loadData() {
        $post = (object) $_REQUEST;

        $sql = "select filedata, fileinfo from $post->tableName where id = $post->id";

        $rows = $this->query($sql)->fetchAll();

        return $rows[0];
    }

    private static function fileLogo($type) {
        return "";
    }

    private static function sizeFile($size = 640, $quality = 80) {
        if($size < 10) $size = 10;
        if($quality > 100) $quality = 100;
        if($quality < 030) $quality = 030;

        self::$resizableSize = $size;
        self::$resizableQuality = $quality;
    }

    /**
     * Resize image class will allow you to resize an image
     *
     * Can resize to exact size
     * Max width size while keep aspect ratio
     * Max height size while keep aspect ratio
     * Automatic while keep aspect ratio
     *
     * site: http://www.paulund.co.uk/resize-image-class-php
     */
    private static function workSize($imgData) {
        $ext = getimagesize($imgData)['mime'];

        switch($ext) {
            case 'image/jpg':
            case 'image/jpeg':
                $tmpData = @imagecreatefromjpeg($imgData);
                break;
            case 'image/gif':
                $tmpData = @imagecreatefromgif($imgData);
                break;
            case 'image/png':
                $tmpData = @imagecreatefrompng($imgData);
                break;
            default:
                throw new \Exception("Este arquivo não é uma imagem válida!", 1);
        }

        $x = imagesx($tmpData);
        $y = imagesy($tmpData);

        $max = ($x > $y) ? $x : $y;

        $rate = $max/self::$resizableSize;
        $finalX = $x/$rate;
        $finalY = $y/$rate;

        if($finalX > $x) {
            $finalX = $x;
            $finalY = $y;
        }

        $finalX = ceil($finalX);
        $finalY = ceil($finalY);

        $newData = imagecreatetruecolor($finalX,$finalY);
        imagefill($newData,0,0,imagecolorallocate($newData, 255, 255, 255));
        imagecopyresampled($newData, $tmpData, 0, 0, 0, 0,$finalX, $finalY, $x, $y);

        switch($ext) {
            case 'image/png':
            case 'image/jpg':
            case 'image/jpeg':
                imagejpeg($newData, $imgData, self::$resizableQuality);
                break;
            case 'image/gif':
                imagegif($newData, $imgData);
                break;
        }

        imagedestroy($tmpData);
        imagedestroy($newData);
    }

}