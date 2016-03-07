<?php

namespace Smart\Utils;

class Submit extends \ArrayObject {

    public function getRowValue ($field) {
        return isset($this["rows"][$field]) ? $this["rows"][$field] : null;
    }

    public function getRawValue ($field) {
        return $this[$field];
    }

    public function setRawValue ($field,$value) {
        $this[$field] = $value;
    }

    public function setRowValue ($field,$value) {
        $this["rows"][$field] = $value;
    }

    public function getRow() {
        return $this["rows"];
    }

    public function setRow(array $rows) {
        $this["rows"] = $rows;
    }

    public function getToArray () {
        return $this->getArrayCopy();
    }

}