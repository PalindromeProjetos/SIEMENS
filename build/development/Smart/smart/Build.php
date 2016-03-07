<?php

require_once 'vendor/autoload.php';

use Smart\Utils\Version;

$version = new Version('smart/Build.json','_Major|_Minor|_Patch|Build');

$version->setNextVersion();