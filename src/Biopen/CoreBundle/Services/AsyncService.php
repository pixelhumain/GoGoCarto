<?php

namespace Biopen\CoreBundle\Services;

use Symfony\Component\Process\Process;
use Biopen\SaasBundle\Helper\SaasHelper;
/**
 * Class AsyncService
 * @package Krlove\AsyncServiceCallBundle
 */
class AsyncService
{
    /**
     * @var string
     */
    protected $consolePath;

    /**
     * @var string
     */
    protected $phpPath;

    /**
     * AsyncService constructor.
     * @param string $consolePath
     * @param string $phpPath
     */
    public function __construct(
        $consolePath,
        $phpPath
    ) {
        $this->consolePath = $consolePath;
        $this->phpPath = $phpPath;
    }

    /**
     * @param string $service
     * @param string $method
     * @param array $arguments
     * @return int|null
     */
    public function callService($service, $method, $arguments = [])
    {
        $commandline = $this->createCommandString($service, $method, $arguments);

        return $this->runProcess($commandline);
    }

    public function callCommand($commandName, $arguments = [])
    {
        $saasHelper = new SaasHelper();
        $dbname = $saasHelper->getCurrentProjectCode();
        
        $commandline = $this->phpPath . ' ' . $this->consolePath . ' ' . $commandName;
        foreach ($arguments as $key => $arg) {
            $commandline .= ' ' . $arg;
        }
        $commandline .= ' ' . $dbname;
        $commandline .= ' > /tmp/command.log 2>/tmp/command.log &';
        return $this->runProcess($commandline);
    }

    /**
     * @param string $service
     * @param string $method
     * @param array $arguments
     * @return string
     */
    protected function createCommandString($service, $method, $arguments)
    {
        $arguments = escapeshellarg(base64_encode(serialize($arguments)));

        return sprintf(
            '%s %s krlove:service:call %s %s --args=%s > /tmp/command.log 2>/tmp/command.log &',
            $this->phpPath,
            $this->consolePath,
            $service,
            $method,
            $arguments
        );
    }

    /**
     * @param string $commandline
     * @return int|null
     */
    protected function runProcess($commandline)
    {
        $process = new Process($commandline);
        $process->start();

        return $process->getPid();
    }
}