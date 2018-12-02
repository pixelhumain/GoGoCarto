<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use \Datetime;

/**
 * External source to load dynamically
 *
 * @MongoDB\Document
 */
class SourceExternal extends Source
{
    /**
     * @var string   
     * @MongoDB\Field(type="string")
     */
    private $url;

    /**
     * @var string   
     * @MongoDB\Field(type="int")
     */
    private $refreshFrequencyInDays;

    /**
     * @var date $lastRefresh
     *
     * @MongoDB\Field(type="date")
     */
    private $lastRefresh = null;

    /**
     * @var date $lastRefresh
     *
     * @MongoDB\Field(type="date")
     */
    private $nextRefresh = null;

    public function isExternalsource() { return true; }

    public function updateNextRefreshDate() 
    {
        if ($this->getRefreshFrequencyInDays() == 0) $this->setNextRefresh(null);
        else 
        {           
            $interval = new \DateInterval('P' . $this->getRefreshFrequencyInDays() .'D');
            $date = new DateTime();
            $date->setTimestamp($this->getLastRefresh());
            $this->setNextRefresh($date->add($interval));
        }
    }    

    /**
     * Set url
     *
     * @param string $url
     * @return $this
     */
    public function setUrl($url)
    {
        $this->url = $url;
        return $this;
    }

    /**
     * Get url
     *
     * @return string $url
     */
    public function getUrl()
    {
        return $this->url;
    }    

    /**
     * Set refreshFrequencyInDays
     *
     * @param int $refreshFrequencyInDays
     * @return $this
     */
    public function setRefreshFrequencyInDays($refreshFrequencyInDays)
    {
        $this->refreshFrequencyInDays = $refreshFrequencyInDays;
        return $this;
    }

    /**
     * Get refreshFrequencyInDays
     *
     * @return int $refreshFrequencyInDays
     */
    public function getRefreshFrequencyInDays()
    {
        return $this->refreshFrequencyInDays;
    }

    /**
     * Set lastRefresh
     *
     * @param date $lastRefresh
     * @return $this
     */
    public function setLastRefresh($lastRefresh)
    {
        $this->lastRefresh = $lastRefresh;
        return $this;
    }

    /**
     * Get lastRefresh
     *
     * @return date $lastRefresh
     */
    public function getLastRefresh()
    {
        return $this->lastRefresh;
    }

    /**
     * Set nextRefresh
     *
     * @param date $nextRefresh
     * @return $this
     */
    public function setNextRefresh($nextRefresh)
    {
        $this->nextRefresh = $nextRefresh;
        return $this;
    }

    /**
     * Get nextRefresh
     *
     * @return date $nextRefresh
     */
    public function getNextRefresh()
    {
        return $this->nextRefresh;
    }
}
