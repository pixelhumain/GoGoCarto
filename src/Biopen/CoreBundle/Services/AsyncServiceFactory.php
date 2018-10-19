<?php

namespace Biopen\CoreBundle\Services;

use Symfony\Component\Filesystem\Exception\FileNotFoundException;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Process\PhpExecutableFinder;

/**
 * Class AsyncServiceFactory
 * @package Krlove\AsyncServiceCallBundle
 */
class AsyncServiceFactory
{
    /**
     * @var Filesystem
     */
    protected $filesystem;

    /**
     * @var string
     */
    protected $rootDir;

    /**
     * @var string
     */
    protected $consolePath;

    /**
     * @var string
     */
    protected $phpPath;

    /**
     * AsyncServiceFactory constructor.
     * @param Filesystem $filesystem
     * @param string $rootDir
     * @param string $consolePath
     * @param string $phpPath
     */
    public function __construct(
        Filesystem $filesystem,
        $rootDir,
        $consolePath,
        $phpPath
    ) {
        $this->filesystem = $filesystem;
        $this->rootDir = $rootDir;
        $this->consolePath = $consolePath;
        $this->phpPath = $phpPath;
    }

    /**
     * @return AsyncService
     */
    public function createAsyncService()
    {
        $consolePath = $this->resolveConsolePath();
        $phpPath = $this->resolvePhpPath();

        return new AsyncService($consolePath, $phpPath);
    }

    /**
     * @return string
     */
    protected function resolveConsolePath()
    {
        $consolePath = $this->consolePath;

        if (!$this->filesystem->isAbsolutePath($consolePath)) {
            $consolePath = $this->rootDir . '/../' . $consolePath;
        }

        if (!$this->filesystem->exists($consolePath)) {
            throw new FileNotFoundException(sprintf('File %s doesn\'t exist', $consolePath));
        }

        return $consolePath;
    }

    /**
     * @return string
     */
    protected function resolvePhpPath()
    {
        $phpPath = $this->phpPath;

        if ($phpPath === null) {
            $finder = new PhpExecutableFinder();
            $phpPath = $finder->find();
        }

        if (!$this->filesystem->exists($phpPath)) {
            throw new FileNotFoundException(sprintf('PHP executable %s doesn\'t exist', $phpPath));
        }

        return $phpPath;
    }
}