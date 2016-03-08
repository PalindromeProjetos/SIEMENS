<?php

namespace Smart\Data;

use Smart\Common\Traits as Traits;

/**
 * Ancestral para as classes do tipo Listeners
 *
 * @methods: update, updateHook, insertHook
 * @category Merge
 */
class Merge {
    use Traits\TresultSet;

    public $entities = array();

    private $submit;

    public function __construct() {
        $this->submit = $this->setSubmit();
    }

    public function update() {
        $update = isset($this->submit["rows"]["id"]) ? strlen($this->submit["rows"]["id"]) !== 0 : false;

        $method = $update == true ? 'updateHook' : 'insertHook';

        foreach ($this->entities as $key => $value) {
            $coach = new $value();
            $store = $coach->getStore();
            $results = $this->$method($store);
            unset($coach);
            unset($store);
        }

        return $results;
    }

    private function updateHook(&$store) {
        $model = $store->getModel();
        return $store->update($model);
    }

    private function insertHook(&$store) {
        $model = $store->getModel();
        $model->_submit = $this->submit;
        $result = $store->insert($model);
        $this->submit["rows"]["id"] = $model->getId();
        unset($model);
        return $result;
    }

}