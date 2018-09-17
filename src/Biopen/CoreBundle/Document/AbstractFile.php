<?php

namespace Biopen\CoreBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Biopen\SaasBundle\Helper\SaasHelper;
use Biopen\CoreBundle\Services\UploadDirectoryNamer;

/**
* Represent a common File. Need to be extended by real Document 
* You need to implement $vichUploadFileKey and the annotation of the $file to specify the mapping key inside it (defined also in config.yml -> vich_uploader)
*/
/** 
* @MongoDB\EmbeddedDocument 
* @Vich\Uploadable
*/
class AbstractFile
{
  protected $vichUploadFileKey = "default_file";

  /**
   * NOTE: This is not a mapped field of entity metadata, just a simple property.
   * 
   * @Vich\UploadableField(mapping="default_file", fileNameProperty="fileName", size="fileSize")
   * 
   * @var File
   */
  protected $file;

  /**
   * @var string
   * @MongoDB\Field(type="string")
   */
  public $fileName = "";

  /**
   * @var string
   * @MongoDB\Field(type="int")
   */
  public $fileSize = "";

  /**
   * @var string
   * memory
   * @MongoDB\Field(type="string")  
   */
  public $fileUrl = "";  

  /**
   * @MongoDB\Field(type="date")
   *
   * @var \DateTime
   */
  private $updatedAt;

  public function toJson() 
  { 
    return json_encode($this->fileUrl); 
  }

  /**
   * If manually uploading a file (i.e. not using Symfony Form) ensure an instance
   * of 'UploadedFile' is injected into this setter to trigger the  update. If this
   * bundle's configuration parameter 'inject_on_load' is set to 'true' this setter
   * must be able to accept an instance of 'File' as the bundle will inject one here
   * during Doctrine hydration.
   *
   * @param File|UploadedFile $file
   */
  public function setFile($file = null)
  {
    $this->file = $file;

    if (null !== $file) {
      // store the absolute url of the file so we can directly use it in the json conversion
      $this->fileUrl = $this->calculateFileUrl();

      // It is required that at least one field changes if you are using doctrine
      // otherwise the event listeners won't be called and the file is lost      
      $this->updatedAt = new \DateTimeImmutable();
    }
  }

  public function calculateFileUrl()
  {
    $hostHelper = new SaasHelper();      
    $fileUrl  =     $hostHelper->getPublicFolderUrl();
    $fileUrl .= '/' . $this->calculateFilePath();
    return $fileUrl;
  }

  public function calculateFilePath($suffix = '', $extension = '')
  {
    $uploadDirHelper = new UploadDirectoryNamer();    
    $filePath = $uploadDirHelper->getDirectoryPathFromKey($this->vichUploadFileKey) .'/' . $this->fileName;
    if ($suffix) {
      return preg_replace(
        '/(\.jpe?g|\.png)$/',
        '-'.$suffix.($extension ? '.'.$extension : '$1'),
        $filePath
      );
    } else {
      return $filePath;
    }
  }

  public function getFile()
  {
    return $this->file;
  }

  /**
   * Set fileName
   *
   * @param string $fileName
   * @return $this
   */
  public function setFileName($fileName)
  {
    $this->fileName = $fileName;
    return $this;
  }

  /**
   * Get fileName
   *
   * @return string $fileName
   */
  public function getFileName()
  {
    return $this->fileName;
  }

  /**
   * Set fileSize
   *
   * @param int $fileSize
   * @return $this
   */
  public function setFileSize($fileSize)
  {
    $this->fileSize = $fileSize;
    return $this;
  }

  /**
   * Get fileSize
   *
   * @return int $fileSize
   */
  public function getFileSize()
  {
    return $this->fileSize;
  }

  /**
   * Set updatedAt
   *
   * @param date $updatedAt
   * @return $this
   */
  public function setUpdatedAt($updatedAt)
  {
    $this->updatedAt = $updatedAt;
    return $this;
  }

  /**
   * Get updatedAt
   *
   * @return date $updatedAt
   */
  public function getUpdatedAt()
  {
    return $this->updatedAt;
  }

  /**
   * Set fileUrl
   *
   * @param string $fileUrl
   * @return $this
   */
  public function setFileUrl($fileUrl)
  {
    $this->fileUrl = $fileUrl;
    return $this;
  }

  /**
   * Get fileUrl
   *
   * @return string $fileUrl
   */
  public function getFileUrl()
  {
    return $this->fileUrl;
  }

  public function getVichUploadFileKey()
  {
    return $this->vichUploadFileKey;
  }
}
