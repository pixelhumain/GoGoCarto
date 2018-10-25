<?php

namespace Application\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

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
}