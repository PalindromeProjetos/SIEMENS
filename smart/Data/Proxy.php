<?php

namespace Smart\Data;

use Smart\Setup\Start;
use Smart\Common\Traits as Traits;

/**
 * Um Proxy de acesso ao banco de dados
 *
 * ex.: "sqlsrv:server=(local);database=fgv"
 *      "mysql:host=localhost;dbname=fgv"
 *
 * @package Smart\Data
 */
class Proxy extends \PDO {
    use Traits\TresultSet,
        Traits\TvalidField,
        Traits\TfileSerialize;

    const
        DML_INSERT = 0,
        DML_SELECT = 1,
        DML_UPDATE = 2,
        DML_DELETE = 3;

    public function __construct(array $link) {
        list ($dns, $usr, $pwd) = $link;

        Start::setTimeZone();

        /**
         * You can also use ini_set function (only for PHP version below 5.3):
         *
         * @author: http://stackoverflow.com/questions/2184513/php-change-the-maximum-upload-file-size
         */
//        ini_set('post_max_size', '64M');
//        ini_set('upload_max_filesize', '64M');

        try {
			parent::__construct( $dns, $usr, $pwd );
            $this->setAttribute( \PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION );
			$this->setAttribute( \PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC );

        } catch ( \PDOException $e ) {
            self::_setSuccess(false);
            self::_setText('Não foi possível acessar a base de dados!');
			echo self::getResultToJson();
        }
    }

    /**
     * Cria um statement DML select
     *
     * @param object $entity
     * @return null|\PDOStatement
     */
    public function sqlSelect(&$entity) {
        $fields = [];
        $exists = $entity->getNotate()->property;
        $extend = $entity->getNotate()->instance->Entity->name;

        // montando DML
        foreach ($exists as $field => $value) {
            $fields[] = " $field";
        }

        $sql = "SELECT " . trim(implode(', ', $fields)) . " FROM {$extend} WHERE id = :id";

        return $this->bindField($entity,$sql,self::DML_SELECT);
    }

    /**
     * Cria um statement DML update
     *
     * @param object $entity
     * @return null|\PDOStatement
     */
    public function sqlUpdate(&$entity) {
        $modify = 0;
        $fields = array();
        $submit = $entity->getSubmit();
        $exists = $entity->getNotate()->property;
        $extend = $entity->getNotate()->instance->Entity->name;

        // montando DML
        foreach ($submit['rows'] as $field => $value) {
            if(isset($exists[$field]) && $field !== "id") {
                $modify++;
                $fields[] = "$field = :$field";
            }
        }

        $sql = "UPDATE {$extend} SET " . trim(implode(', ', $fields)) . " WHERE id = :id";

        return $modify === 0 ? null : $this->bindField($entity,$sql,self::DML_UPDATE);
    }

    /**
     * Cria um statement DML insert
     *
     * @param object $entity
     * @return null|\PDOStatement
     */
    public function sqlInsert(&$entity) {
        $modify = 0;
        $fields = $values = array();
        $submit = $entity->getSubmit();
        $notate = $entity->getNotate();
        $exists = $notate->property;
        $extend = $notate->instance->Entity->name;

        // montando DML
        foreach ($submit['rows'] as $field => $value) {
            if(isset($exists[$field])) {
                $column = $exists[$field]["Column"];
                $strategy = isset($column['strategy']) ? $column['strategy'] === "AUTO" : false;
                if($strategy == false) {
                    $modify++;
                    $fields[] = " $field";
                    $values[] = " :$field";
                }
            }
        }

        $sql = "INSERT INTO {$extend} ( " . trim(implode(',', $fields)) . " ) VALUES ( " . trim(implode(',', $values)) . " )";

        return $modify === 0 ? null : $this->bindField($entity,$sql,self::DML_INSERT);
    }

    /**
     * Cria um statement DML delete
     *
     * @param object $entity
     * @return null|\PDOStatement
     */
    public function sqlDelete(&$entity) {
        $extend = $entity->getNotate()->instance->Entity->name;

        // montando DML
        $sql = "DELETE FROM {$extend} WHERE id = :id";

        return $this->bindField($entity,$sql,self::DML_DELETE);
    }

    /**
     * Prepara a Entity com os valores do submit
     * Monta a DML com os valores achados
     *
     * @param $entity, entidade do banco
     * @param $sql, statement DML
     * @param $type, tipo de statement DML (CRUD)
     * @return null|\PDOStatement
     */
    private function bindField(&$entity,$sql,$type) {
        $commit = $this->prepare($sql);
        $submit = $entity->getSubmit();
        $exists = $entity->getNotate()->property;

        // montando PDO
        foreach ($submit['rows'] as $field => $value) {
            if(isset($exists[$field])) {
                $column = $exists[$field]["Column"];
                $strategy = isset($column['strategy']) ? $column['strategy'] === "AUTO" : false;
                switch ($type) {
                    case self::DML_INSERT:
                        if($strategy == false) {
                            $method = "get" . strtoupper($field[0]) . substr($field, 1);
                            $commit->bindValue(":$field", $entity->$method(), $this->getParams($column["type"]));
                        }
                        break;
                    case self::DML_DELETE:
                        if($field == 'id') {
                            $method = "get" . strtoupper($field[0]) . substr($field, 1);
                            $commit->bindValue(":$field", $entity->$method(), $this->getParams($column["type"]));
                        }
                        break;
                    default:
                        $method = "get" . strtoupper($field[0]) . substr($field, 1);
                        $commit->bindValue(":$field", $entity->$method(), $this->getParams($column["type"]));
                        break;
                }
            }
        }

        return $commit;
    }

    /**
     * Define o tipo de parametro PDO
     *
     * @param string $paramName Nome do evento chamado
     * @return int
     */
    private function getParams($paramName) {
        switch ($paramName) {
            case is_null($paramName):
                return \PDO::PARAM_NULL;
                break;
            case 'boolean':
                return \PDO::PARAM_BOOL;
                break;
            case 'integer':
                return \PDO::PARAM_INT;
                break;
            default:
                return \PDO::PARAM_STR;
        }
    }

    /**
     * Chama o método armazenado no indice <code>action<code/>
     *
     * @return json <code>$result<code/>
     */
    public function callAction() {
        $action = $this->submit['action'];
        return method_exists($this, $action) ? call_user_func(array($this, $action)) : $this->UNEXPECTED_COMMAND;
    }

}