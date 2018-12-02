<?php

namespace Application\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;
use Biopen\SaasBundle\Helper\SaasHelper;

class AppExtension extends AbstractExtension
{
    public function getFilters()
    {
        return array(
            new TwigFilter('json_decode', array($this, 'jsonDecode')),            
        );
    }

    public function jsonDecode($value)
    {
        return json_decode($value);
    }

    public function getFunctions()
    {
        return array(
            new TwigFunction('is_root_project', array($this, 'isRootProject')),
        );
    }

    public function isRootProject()
    {
        $sassHelper = new SaasHelper();
        return $sassHelper->isRootProject();
    }
}