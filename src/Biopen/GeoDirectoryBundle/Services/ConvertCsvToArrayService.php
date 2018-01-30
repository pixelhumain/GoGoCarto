<?php
namespace Biopen\GeoDirectoryBundle\Services;
 
class ConvertCsvToArrayService {
    
    public function __construct()
    {
    }
    
    public function convert($filename, $delimiter = ',') 
    {
        if(!file_exists($filename) || !is_readable($filename)) {
            return FALSE;
        }
        
        $header = NULL;
        $data = array();
        
        if (($handle = fopen($filename, 'r')) !== FALSE) {
            while (($row = fgetcsv($handle, 1000, $delimiter)) !== FALSE) {
                if(!$header) {
                    $header = $row;
                } else {
                    if (count($header) != count ($row)) dump($row);
                    $data[] = array_combine($header, $row);
                }
            }
            fclose($handle);
        }
        return $data;
    }
 
}