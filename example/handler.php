<?php
	$file = @file_get_contents($_REQUEST['file'],true);
	$file = str_replace('/*$CREDITOS$*/', '+ " Criado por Rodrigo K Nascimento"', $file);
	echo $file;
?>